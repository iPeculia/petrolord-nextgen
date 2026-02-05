import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import {
  wellSchema,
  reservoirPropertiesSchema,
  productionDataSchema,
  espDesignSchema,
  gasLiftDesignSchema,
  rodPumpDesignSchema,
  equipmentCatalogSchema,
  designResultSchema,
  designComparisonSchema
} from '../models/schemas';

const ArtificialLiftContext = createContext(null);

// Local Storage Helper Functions
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading from localStorage key "${key}":`, error);
    return null;
  }
};

const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

const clearAllLocalStorage = () => {
    const keys = [
        "ald_wells",
        "ald_reservoir_properties",
        "ald_production_data",
        "ald_esp_designs",
        "ald_gas_lift_designs",
        "ald_rod_pump_designs",
        "ald_equipment_catalog",
        "ald_design_results",
        "ald_design_comparisons"
    ];
    keys.forEach(key => removeFromLocalStorage(key));
};

export const ArtificialLiftProvider = ({ children }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data State
  const [wells, setWells] = useState([]);
  const [reservoirProperties, setReservoirProperties] = useState({});
  const [productionData, setProductionData] = useState({});
  const [espDesigns, setEspDesigns] = useState([]);
  const [gasLiftDesigns, setGasLiftDesigns] = useState([]);
  const [rodPumpDesigns, setRodPumpDesigns] = useState([]);
  const [equipmentCatalog, setEquipmentCatalog] = useState([]);
  const [designResults, setDesignResults] = useState([]);
  const [designComparisons, setDesignComparisons] = useState([]);

  // UI/Selection State
  const [currentWellId, setCurrentWellId] = useState(null);
  const [currentDesignId, setCurrentDesignId] = useState(null);

  // Derived State
  const currentWell = wells.find(w => w.well_id === currentWellId) || null;
  // Generic design finding logic can be complex if across multiple types, 
  // keeping it simple for now or strictly when we know the type.
  
  // Initialization: Load from LocalStorage
  useEffect(() => {
    const initData = () => {
      setWells(loadFromLocalStorage('ald_wells') || []);
      setReservoirProperties(loadFromLocalStorage('ald_reservoir_properties') || {});
      setProductionData(loadFromLocalStorage('ald_production_data') || {});
      setEspDesigns(loadFromLocalStorage('ald_esp_designs') || []);
      setGasLiftDesigns(loadFromLocalStorage('ald_gas_lift_designs') || []);
      setRodPumpDesigns(loadFromLocalStorage('ald_rod_pump_designs') || []);
      setEquipmentCatalog(loadFromLocalStorage('ald_equipment_catalog') || []);
      setDesignResults(loadFromLocalStorage('ald_design_results') || []);
      setDesignComparisons(loadFromLocalStorage('ald_design_comparisons') || []);
      
      // Attempt to restore last session selection if desired, or just init
      setLoading(false);
    };
    initData();
  }, []);

  // Persistence: Save to LocalStorage on changes
  useEffect(() => saveToLocalStorage('ald_wells', wells), [wells]);
  useEffect(() => saveToLocalStorage('ald_reservoir_properties', reservoirProperties), [reservoirProperties]);
  useEffect(() => saveToLocalStorage('ald_production_data', productionData), [productionData]);
  useEffect(() => saveToLocalStorage('ald_esp_designs', espDesigns), [espDesigns]);
  useEffect(() => saveToLocalStorage('ald_gas_lift_designs', gasLiftDesigns), [gasLiftDesigns]);
  useEffect(() => saveToLocalStorage('ald_rod_pump_designs', rodPumpDesigns), [rodPumpDesigns]);
  useEffect(() => saveToLocalStorage('ald_equipment_catalog', equipmentCatalog), [equipmentCatalog]);
  useEffect(() => saveToLocalStorage('ald_design_results', designResults), [designResults]);
  useEffect(() => saveToLocalStorage('ald_design_comparisons', designComparisons), [designComparisons]);


  // Helper for generic Zod validation handling
  const validate = (schema, data, operationName) => {
    try {
      return schema.parse(data);
    } catch (err) {
      console.error(`${operationName} validation error:`, err);
      const errorMessage = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errorMessage,
      });
      throw err; 
    }
  };

  // --- CRUD Operations ---

  // Wells
  const addWell = (wellData) => {
    try {
        const newWell = {
            ...wellData,
            well_id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const validated = validate(wellSchema, newWell, "addWell");
        setWells(prev => [...prev, validated]);
        setCurrentWellId(validated.well_id); // Auto-select new well
        toast({ title: "Success", description: "Well added successfully." });
        return validated;
    } catch (e) { return null; }
  };

  const updateWell = (well_id, wellData) => {
    try {
        const updatedWell = { ...wellData, well_id, updated_at: new Date().toISOString() };
        const validated = validate(wellSchema, updatedWell, "updateWell");
        setWells(prev => prev.map(w => w.well_id === well_id ? validated : w));
        toast({ title: "Success", description: "Well updated successfully." });
        return validated;
    } catch (e) { return null; }
  };

  const deleteWell = (well_id) => {
    setWells(prev => prev.filter(w => w.well_id !== well_id));
    if (currentWellId === well_id) setCurrentWellId(null);
    toast({ title: "Success", description: "Well deleted." });
  };
  
  const getWell = (well_id) => wells.find(w => w.well_id === well_id);
  const getAllWells = () => wells;

  // Reservoir Properties
  const addReservoirProperties = (data) => {
      try {
        const newData = {
            ...data,
            property_id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const validated = validate(reservoirPropertiesSchema, newData, "addReservoirProperties");
        setReservoirProperties(prev => ({ ...prev, [validated.well_id]: validated }));
        toast({ title: "Success", description: "Reservoir properties saved." });
      } catch (e) { return null; }
  };
  
  const updateReservoirProperties = (well_id, data) => {
      addReservoirProperties({ ...data, well_id });
  };
  
  const getReservoirProperties = (well_id) => reservoirProperties[well_id];

  // Production Data
  const addProductionData = (data) => {
      try {
          const newData = {
              ...data,
              production_id: uuidv4(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
          };
          const validated = validate(productionDataSchema, newData, "addProductionData");
          setProductionData(prev => ({ ...prev, [validated.well_id]: validated }));
          toast({ title: "Success", description: "Production data saved." });
      } catch (e) { return null; }
  };

  const updateProductionData = (well_id, data) => {
      addProductionData({...data, well_id});
  };

  const getProductionData = (well_id) => productionData[well_id];

  // ESP Designs
  const addESPDesign = (data) => {
      try {
          const newData = {
              ...data,
              design_id: uuidv4(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
          };
          const validated = validate(espDesignSchema, newData, "addESPDesign");
          setEspDesigns(prev => [...prev, validated]);
          toast({ title: "Success", description: "ESP Design saved." });
      } catch (e) { return null; }
  };

  const updateESPDesign = (design_id, data) => {
      try {
          const existing = espDesigns.find(d => d.design_id === design_id);
          const newData = { ...existing, ...data, updated_at: new Date().toISOString() };
          const validated = validate(espDesignSchema, newData, "updateESPDesign");
          setEspDesigns(prev => prev.map(d => d.design_id === design_id ? validated : d));
          toast({ title: "Success", description: "ESP Design updated." });
      } catch (e) { return null; }
  };
  
  const deleteESPDesign = (design_id) => {
      setEspDesigns(prev => prev.filter(d => d.design_id !== design_id));
      toast({ title: "Success", description: "ESP Design deleted." });
  };

  const getESPDesign = (design_id) => espDesigns.find(d => d.design_id === design_id);
  const getAllESPDesigns = (well_id) => well_id ? espDesigns.filter(d => d.well_id === well_id) : espDesigns;

  // Gas Lift Designs
  const addGasLiftDesign = (data) => {
      try {
        const newData = { ...data, design_id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const validated = validate(gasLiftDesignSchema, newData, "addGasLiftDesign");
        setGasLiftDesigns(prev => [...prev, validated]);
        toast({ title: "Success", description: "Gas Lift Design saved." });
      } catch (e) { return null; }
  };
  
  const updateGasLiftDesign = (design_id, data) => {
      try {
        const existing = gasLiftDesigns.find(d => d.design_id === design_id);
        const newData = { ...existing, ...data, updated_at: new Date().toISOString() };
        const validated = validate(gasLiftDesignSchema, newData, "updateGasLiftDesign");
        setGasLiftDesigns(prev => prev.map(d => d.design_id === design_id ? validated : d));
        toast({ title: "Success", description: "Gas Lift Design updated." });
      } catch(e) { return null; }
  };

  const deleteGasLiftDesign = (design_id) => {
      setGasLiftDesigns(prev => prev.filter(d => d.design_id !== design_id));
      toast({ title: "Success", description: "Gas Lift Design deleted." });
  };

  const getGasLiftDesign = (design_id) => gasLiftDesigns.find(d => d.design_id === design_id);
  const getAllGasLiftDesigns = (well_id) => well_id ? gasLiftDesigns.filter(d => d.well_id === well_id) : gasLiftDesigns;

  // Rod Pump Designs
  const addRodPumpDesign = (data) => {
      try {
          const newData = { ...data, design_id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          const validated = validate(rodPumpDesignSchema, newData, "addRodPumpDesign");
          setRodPumpDesigns(prev => [...prev, validated]);
          toast({ title: "Success", description: "Rod Pump Design saved." });
      } catch (e) { return null; }
  };
  
  const updateRodPumpDesign = (design_id, data) => {
      try {
          const existing = rodPumpDesigns.find(d => d.design_id === design_id);
          const newData = { ...existing, ...data, updated_at: new Date().toISOString() };
          const validated = validate(rodPumpDesignSchema, newData, "updateRodPumpDesign");
          setRodPumpDesigns(prev => prev.map(d => d.design_id === design_id ? validated : d));
          toast({ title: "Success", description: "Rod Pump Design updated." });
      } catch (e) { return null; }
  };

  const deleteRodPumpDesign = (design_id) => {
      setRodPumpDesigns(prev => prev.filter(d => d.design_id !== design_id));
      toast({ title: "Success", description: "Rod Pump Design deleted." });
  };
  
  const getRodPumpDesign = (design_id) => rodPumpDesigns.find(d => d.design_id === design_id);
  const getAllRodPumpDesigns = (well_id) => well_id ? rodPumpDesigns.filter(d => d.well_id === well_id) : rodPumpDesigns;

  // Equipment Catalog
  const addEquipment = (data) => {
      try {
          const newData = { ...data, equipment_id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          const validated = validate(equipmentCatalogSchema, newData, "addEquipment");
          setEquipmentCatalog(prev => [...prev, validated]);
          toast({ title: "Success", description: "Equipment added." });
      } catch(e) { return null; }
  };

  const updateEquipment = (equipment_id, data) => {
      try {
          const existing = equipmentCatalog.find(e => e.equipment_id === equipment_id);
          const newData = { ...existing, ...data, updated_at: new Date().toISOString() };
          const validated = validate(equipmentCatalogSchema, newData, "updateEquipment");
          setEquipmentCatalog(prev => prev.map(e => e.equipment_id === equipment_id ? validated : e));
          toast({ title: "Success", description: "Equipment updated." });
      } catch (e) { return null; }
  };

  const deleteEquipment = (equipment_id) => {
      setEquipmentCatalog(prev => prev.filter(e => e.equipment_id !== equipment_id));
      toast({ title: "Success", description: "Equipment deleted." });
  };

  const getEquipment = (equipment_id) => equipmentCatalog.find(e => e.equipment_id === equipment_id);
  const getAllEquipment = (category) => category ? equipmentCatalog.filter(e => e.category === category) : equipmentCatalog;

  // Design Results
  const addDesignResult = (data) => {
      try {
          const newData = { ...data, result_id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          const validated = validate(designResultSchema, newData, "addDesignResult");
          setDesignResults(prev => [...prev, validated]);
      } catch (e) { return null; }
  };

  const updateDesignResult = (result_id, data) => {
      try {
          const existing = designResults.find(r => r.result_id === result_id);
          const newData = { ...existing, ...data, updated_at: new Date().toISOString() };
          const validated = validate(designResultSchema, newData, "updateDesignResult");
          setDesignResults(prev => prev.map(r => r.result_id === result_id ? validated : r));
      } catch (e) { return null; }
  };

  const deleteDesignResult = (result_id) => setDesignResults(prev => prev.filter(r => r.result_id !== result_id));
  const getDesignResult = (result_id) => designResults.find(r => r.result_id === result_id);
  const getAllDesignResults = (well_id) => well_id ? designResults.filter(r => r.well_id === well_id) : designResults;

  // Design Comparisons
  const addDesignComparison = (data) => {
      try {
          const newData = { ...data, comparison_id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          const validated = validate(designComparisonSchema, newData, "addDesignComparison");
          setDesignComparisons(prev => [...prev, validated]);
      } catch (e) { return null; }
  };

  const updateDesignComparison = (comparison_id, data) => {
      try {
          const existing = designComparisons.find(c => c.comparison_id === comparison_id);
          const newData = { ...existing, ...data, updated_at: new Date().toISOString() };
          const validated = validate(designComparisonSchema, newData, "updateDesignComparison");
          setDesignComparisons(prev => prev.map(c => c.comparison_id === comparison_id ? validated : c));
      } catch (e) { return null; }
  };
  
  const deleteDesignComparison = (comparison_id) => setDesignComparisons(prev => prev.filter(c => c.comparison_id !== comparison_id));
  const getDesignComparison = (comparison_id) => designComparisons.find(c => c.comparison_id === comparison_id);
  const getWellDesignComparison = (well_id) => designComparisons.find(c => c.well_id === well_id); 

  return (
    <ArtificialLiftContext.Provider
      value={{
        wells,
        reservoirProperties,
        productionData,
        espDesigns,
        gasLiftDesigns,
        rodPumpDesigns,
        equipmentCatalog,
        designResults,
        designComparisons,
        
        // UI State
        currentWellId,
        setCurrentWellId,
        currentWell,
        currentDesignId,
        setCurrentDesignId,
        loading,
        setLoading,
        error,
        setError,
        
        // Methods
        addWell, updateWell, deleteWell, getWell, getAllWells,
        addReservoirProperties, updateReservoirProperties, getReservoirProperties,
        addProductionData, updateProductionData, getProductionData,
        addESPDesign, updateESPDesign, deleteESPDesign, getESPDesign, getAllESPDesigns,
        addGasLiftDesign, updateGasLiftDesign, deleteGasLiftDesign, getGasLiftDesign, getAllGasLiftDesigns,
        addRodPumpDesign, updateRodPumpDesign, deleteRodPumpDesign, getRodPumpDesign, getAllRodPumpDesigns,
        addEquipment, updateEquipment, deleteEquipment, getEquipment, getAllEquipment,
        addDesignResult, updateDesignResult, deleteDesignResult, getDesignResult, getAllDesignResults,
        addDesignComparison, updateDesignComparison, deleteDesignComparison, getDesignComparison, getWellDesignComparison,
        
        clearAllLocalStorage
      }}
    >
      {children}
    </ArtificialLiftContext.Provider>
  );
};

export const useArtificialLift = () => {
  const context = useContext(ArtificialLiftContext);
  if (!context) {
    throw new Error('useArtificialLift must be used within an ArtificialLiftProvider');
  }
  return context;
};