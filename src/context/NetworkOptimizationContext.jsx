import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { generateDemoData } from '@/services/networkOptimization/data/demoData';

// Validation Functions
import { validateNetwork } from '@/services/networkOptimization/models/Network';
import { validateNode } from '@/services/networkOptimization/models/Node';
import { validatePipeline } from '@/services/networkOptimization/models/Pipeline';
import { validateFacility } from '@/services/networkOptimization/models/Facility';
import { validateOptimizationScenario } from '@/services/networkOptimization/models/OptimizationScenario';
import { validateFlowSimulation } from '@/services/networkOptimization/models/FlowSimulation';
import { validateDebottleneckingStrategy } from '@/services/networkOptimization/models/DebottleneckingStrategy';
import { validateOptimizationResult } from '@/services/networkOptimization/models/OptimizationResult';

const NetworkOptimizationContext = createContext(null);

export const NetworkOptimizationProvider = ({ children }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data State
  const [networks, setNetworks] = useState([]);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [optimizationResults, setOptimizationResultsState] = useState([]);
  const [debottleneckingStrategies, setDebottleneckingStrategies] = useState([]);
  const [nodeResults, setNodeResults] = useState([]);
  const [pipelineResults, setPipelineResults] = useState([]);

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState('Networks');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Local Storage Keys
  const LS_KEYS = {
    NETWORKS: 'netopt_networks',
    NODES: 'netopt_nodes',
    PIPELINES: 'netopt_pipelines',
    FACILITIES: 'netopt_facilities',
    SCENARIOS: 'netopt_scenarios',
    SIMULATIONS: 'netopt_simulations',
    OPT_RESULTS: 'netopt_opt_results',
    STRATEGIES: 'netopt_strategies',
    NODE_RESULTS: 'netopt_node_results',
    PIPE_RESULTS: 'netopt_pipe_results',
    CURRENT_NET: 'netopt_current_network_id'
  };

  // Load Data
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const storedNetworks = JSON.parse(localStorage.getItem(LS_KEYS.NETWORKS) || '[]');
        
        if (storedNetworks.length === 0) {
          // Load Demo Data
          const demoData = generateDemoData();
          setNetworks(demoData.networks);
          setNodes(demoData.nodes);
          setPipelines(demoData.pipelines);
          setFacilities(demoData.facilities);
          setScenarios(demoData.scenarios);
          setSimulations(demoData.simulations);
          setOptimizationResultsState(demoData.optimizationResults);
          setDebottleneckingStrategies(demoData.debottleneckingStrategies);
          setNodeResults(demoData.nodeResults);
          setPipelineResults(demoData.pipelineResults);
          setCurrentNetwork(demoData.networks[0]);
        } else {
          setNetworks(storedNetworks);
          setNodes(JSON.parse(localStorage.getItem(LS_KEYS.NODES) || '[]'));
          setPipelines(JSON.parse(localStorage.getItem(LS_KEYS.PIPELINES) || '[]'));
          setFacilities(JSON.parse(localStorage.getItem(LS_KEYS.FACILITIES) || '[]'));
          setScenarios(JSON.parse(localStorage.getItem(LS_KEYS.SCENARIOS) || '[]'));
          setSimulations(JSON.parse(localStorage.getItem(LS_KEYS.SIMULATIONS) || '[]'));
          setOptimizationResultsState(JSON.parse(localStorage.getItem(LS_KEYS.OPT_RESULTS) || '[]'));
          setDebottleneckingStrategies(JSON.parse(localStorage.getItem(LS_KEYS.STRATEGIES) || '[]'));
          setNodeResults(JSON.parse(localStorage.getItem(LS_KEYS.NODE_RESULTS) || '[]'));
          setPipelineResults(JSON.parse(localStorage.getItem(LS_KEYS.PIPE_RESULTS) || '[]'));

          const currentId = localStorage.getItem(LS_KEYS.CURRENT_NET);
          if (currentId) {
            const found = storedNetworks.find(n => n.network_id === currentId);
            if (found) setCurrentNetwork(found);
          }
        }
      } catch (err) {
        console.error("Failed to load network optimization data", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Persistence (Auto-save)
  useEffect(() => {
    if (!loading) {
      const saveData = setTimeout(() => {
        localStorage.setItem(LS_KEYS.NETWORKS, JSON.stringify(networks));
        localStorage.setItem(LS_KEYS.NODES, JSON.stringify(nodes));
        localStorage.setItem(LS_KEYS.PIPELINES, JSON.stringify(pipelines));
        localStorage.setItem(LS_KEYS.FACILITIES, JSON.stringify(facilities));
        localStorage.setItem(LS_KEYS.SCENARIOS, JSON.stringify(scenarios));
        localStorage.setItem(LS_KEYS.SIMULATIONS, JSON.stringify(simulations));
        localStorage.setItem(LS_KEYS.OPT_RESULTS, JSON.stringify(optimizationResults));
        localStorage.setItem(LS_KEYS.STRATEGIES, JSON.stringify(debottleneckingStrategies));
        localStorage.setItem(LS_KEYS.NODE_RESULTS, JSON.stringify(nodeResults));
        localStorage.setItem(LS_KEYS.PIPE_RESULTS, JSON.stringify(pipelineResults));
        if (currentNetwork) {
          localStorage.setItem(LS_KEYS.CURRENT_NET, currentNetwork.network_id);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(saveData);
    }
  }, [
    networks, nodes, pipelines, facilities, scenarios, simulations, 
    optimizationResults, debottleneckingStrategies, nodeResults, pipelineResults, 
    currentNetwork, loading
  ]);

  // Methods with Validation
  const handleError = (err, action) => {
    console.error(`Error in ${action}:`, err);
    toast({
        title: "Validation Error",
        description: err.errors?.[0]?.message || err.message || "Invalid Data",
        variant: "destructive"
    });
  };

  const addNetwork = (network) => {
    try {
      validateNetwork(network);
      setNetworks(prev => [...prev, network]);
      setCurrentNetwork(network);
      toast({ title: "Network Created", description: network.name });
    } catch (err) { handleError(err, 'addNetwork'); }
  };

  const updateNetwork = (id, updates) => {
    setNetworks(prev => prev.map(n => n.network_id === id ? { ...n, ...updates } : n));
    if (currentNetwork?.network_id === id) {
      setCurrentNetwork(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteNetwork = (id) => {
    setNetworks(prev => prev.filter(n => n.network_id !== id));
    if (currentNetwork?.network_id === id) setCurrentNetwork(null);
    setNodes(prev => prev.filter(n => n.network_id !== id));
    setPipelines(prev => prev.filter(p => p.network_id !== id));
    setFacilities(prev => prev.filter(f => f.network_id !== id));
  };

  const addNode = (node) => {
    try {
      validateNode(node);
      setNodes(prev => [...prev, node]);
      toast({ title: "Node Added", description: node.name });
    } catch (err) { handleError(err, 'addNode'); }
  };

  const updateNode = (id, updates) => setNodes(prev => prev.map(n => n.node_id === id ? { ...n, ...updates } : n));
  const deleteNode = (id) => setNodes(prev => prev.filter(n => n.node_id !== id));

  const addPipeline = (pipeline) => {
    try {
      validatePipeline(pipeline);
      setPipelines(prev => [...prev, pipeline]);
      toast({ title: "Pipeline Added", description: pipeline.name });
    } catch (err) { handleError(err, 'addPipeline'); }
  };

  const updatePipeline = (id, updates) => setPipelines(prev => prev.map(p => p.pipeline_id === id ? { ...p, ...updates } : p));
  const deletePipeline = (id) => setPipelines(prev => prev.filter(p => p.pipeline_id !== id));

  const addFacility = (facility) => {
    try {
      validateFacility(facility);
      setFacilities(prev => [...prev, facility]);
      toast({ title: "Facility Added", description: facility.name });
    } catch (err) { handleError(err, 'addFacility'); }
  };

  const updateFacility = (id, updates) => setFacilities(prev => prev.map(f => f.facility_id === id ? { ...f, ...updates } : f));
  const deleteFacility = (id) => setFacilities(prev => prev.filter(f => f.facility_id !== id));

  const addScenario = (scenario) => {
    try {
      validateOptimizationScenario(scenario);
      setScenarios(prev => [...prev, scenario]);
      toast({ title: "Scenario Created", description: scenario.name });
    } catch (err) { handleError(err, 'addScenario'); }
  };

  const updateScenario = (id, updates) => setScenarios(prev => prev.map(s => s.scenario_id === id ? { ...s, ...updates } : s));
  const deleteScenario = (id) => setScenarios(prev => prev.filter(s => s.scenario_id !== id));

  const addSimulation = (sim) => {
    try {
      validateFlowSimulation(sim);
      setSimulations(prev => [...prev, sim]);
    } catch (err) { handleError(err, 'addSimulation'); }
  };
  
  const updateSimulation = (id, updates) => setSimulations(prev => prev.map(s => s.simulation_id === id ? { ...s, ...updates } : s));

  const addOptimizationResult = (res) => {
    try {
      validateOptimizationResult(res);
      setOptimizationResultsState(prev => [...prev, res]);
    } catch (err) { handleError(err, 'addOptimizationResult'); }
  };

  const setOptimizationResults = (results) => setOptimizationResultsState(results);

  const addDebottleneckingStrategy = (strategy) => {
    try {
      validateDebottleneckingStrategy(strategy);
      setDebottleneckingStrategies(prev => [...prev, strategy]);
    } catch (err) { handleError(err, 'addDebottleneckingStrategy'); }
  };

  const updateDebottleneckingStrategy = (id, updates) => setDebottleneckingStrategies(prev => prev.map(s => s.strategy_id === id ? { ...s, ...updates } : s));
  const deleteDebottleneckingStrategy = (id) => setDebottleneckingStrategies(prev => prev.filter(s => s.strategy_id !== id));

  // UI Methods
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  
  const handleSelection = (type, item) => {
    setSelectedNode(type === 'node' ? item : null);
    setSelectedPipeline(type === 'pipeline' ? item : null);
    setSelectedFacility(type === 'facility' ? item : null);
  };

  const contextValue = {
    // State
    networks,
    currentNetwork,
    nodes,
    pipelines,
    facilities,
    scenarios,
    simulations,
    optimizationResults,
    debottleneckingStrategies,
    nodeResults,
    pipelineResults,
    loading,
    error,
    
    // UI State
    sidebarCollapsed,
    currentTab,
    selectedNode,
    selectedPipeline,
    selectedFacility,

    // Methods
    setCurrentNetwork,
    addNetwork,
    updateNetwork,
    deleteNetwork,
    addNode,
    updateNode,
    deleteNode,
    addPipeline,
    updatePipeline,
    deletePipeline,
    addFacility,
    updateFacility,
    deleteFacility,
    addScenario,
    updateScenario,
    deleteScenario,
    addSimulation,
    updateSimulation,
    addOptimizationResult,
    setOptimizationResults,
    addDebottleneckingStrategy,
    updateDebottleneckingStrategy,
    deleteDebottleneckingStrategy,
    setLoading,
    setError,
    toggleSidebar,
    setCurrentTab,
    setSelectedNode: (node) => handleSelection('node', node),
    setSelectedPipeline: (pipeline) => handleSelection('pipeline', pipeline),
    setSelectedFacility: (facility) => handleSelection('facility', facility),
  };

  return (
    <NetworkOptimizationContext.Provider value={contextValue}>
      {children}
    </NetworkOptimizationContext.Provider>
  );
};

export const useNetworkOptimization = () => {
  const context = useContext(NetworkOptimizationContext);
  if (!context) {
    throw new Error('useNetworkOptimization must be used within a NetworkOptimizationProvider');
  }
  return context;
};