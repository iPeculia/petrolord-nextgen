import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pressureTransientService } from '@/services/pressureTransientService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const PressureTransientContext = createContext();

export const usePressureTransient = () => {
  const context = useContext(PressureTransientContext);
  if (!context) {
    throw new Error('usePressureTransient must be used within a PressureTransientProvider');
  }
  return context;
};

// LocalStorage Keys
const STORAGE_KEYS = {
  WELLS: 'pta_wells',
  TESTS: 'pta_tests',
  RESULTS: 'pta_results',
  CURRENT_WELL: 'pta_current_well',
  CURRENT_TEST: 'pta_current_test',
  CURRENT_RESULT: 'pta_current_result'
};

export const PressureTransientProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [wells, setWells] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  
  const [currentWellId, setCurrentWellId] = useState(null);
  const [currentTestId, setCurrentTestId] = useState(null);
  const [currentResultId, setCurrentResultId] = useState(null);
  
  // Renamed internal state setters to avoid conflict with public methods
  const [currentWellState, setCurrentWellState] = useState(null);
  const [currentTestState, setCurrentTestState] = useState(null);
  const [currentResultState, setCurrentResultState] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Initialization & LocalStorage ---

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedWells = localStorage.getItem(STORAGE_KEYS.WELLS);
      const storedTests = localStorage.getItem(STORAGE_KEYS.TESTS);
      const storedResults = localStorage.getItem(STORAGE_KEYS.RESULTS);
      const storedCurrentWellId = localStorage.getItem(STORAGE_KEYS.CURRENT_WELL);
      const storedCurrentTestId = localStorage.getItem(STORAGE_KEYS.CURRENT_TEST);
      const storedCurrentResultId = localStorage.getItem(STORAGE_KEYS.CURRENT_RESULT);

      if (storedWells) setWells(JSON.parse(storedWells));
      if (storedTests) setTests(JSON.parse(storedTests));
      if (storedResults) setResults(JSON.parse(storedResults));
      if (storedCurrentWellId) setCurrentWellId(storedCurrentWellId);
      if (storedCurrentTestId) setCurrentTestId(storedCurrentTestId);
      if (storedCurrentResultId) setCurrentResultId(storedCurrentResultId);
    } catch (err) {
      console.error("Failed to load PTA data from localStorage", err);
    }
  }, []);

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    if (wells.length > 0) localStorage.setItem(STORAGE_KEYS.WELLS, JSON.stringify(wells));
  }, [wells]);

  useEffect(() => {
    if (tests.length > 0) localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    if (results.length > 0) localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    if (currentWellId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WELL, currentWellId);
      const found = wells.find(w => w.well_id === currentWellId);
      if (found) setCurrentWellState(found);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WELL);
      setCurrentWellState(null);
    }
  }, [currentWellId, wells]);

  useEffect(() => {
    if (currentTestId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TEST, currentTestId);
      const found = tests.find(t => t.test_id === currentTestId);
      if (found) setCurrentTestState(found);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_TEST);
      setCurrentTestState(null);
    }
  }, [currentTestId, tests]);

  useEffect(() => {
    if (currentResultId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_RESULT, currentResultId);
      const found = results.find(r => r.result_id === currentResultId);
      if (found) setCurrentResultState(found);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RESULT);
      setCurrentResultState(null);
    }
  }, [currentResultId, results]);


  // Clear LocalStorage
  const clearLocalStorage = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setWells([]);
    setTests([]);
    setResults([]);
    setCurrentWellId(null);
    setCurrentTestId(null);
    setCurrentResultId(null);
  }, []);

  // Initial Data Fetch from Supabase
  useEffect(() => {
    if (user) {
      refreshAllData();
    }
  }, [user]);

  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [fetchedWells, fetchedTests, fetchedResults] = await Promise.all([
        pressureTransientService.getAllWells(),
        pressureTransientService.getAllTests(),
        pressureTransientService.getAllResults()
      ]);
      setWells(fetchedWells || []);
      setTests(fetchedTests || []);
      setResults(fetchedResults || []);
    } catch (err) {
      setError(err.message);
      toast({ title: "Error loading data", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- WELL METHODS ---
  const addWell = async (wellData) => {
    setIsLoading(true);
    try {
      const newWell = await pressureTransientService.createWell({ ...wellData, user_id: user.id });
      setWells(prev => [newWell, ...prev]);
      toast({ title: "Success", description: "Well created successfully" });
      return newWell;
    } catch (err) {
      toast({ title: "Error", description: "Failed to create well", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWell = async (wellId, wellData) => {
    setIsLoading(true);
    try {
      const updatedWell = await pressureTransientService.updateWell(wellId, wellData);
      setWells(prev => prev.map(w => w.well_id === wellId ? updatedWell : w));
      if (currentWellId === wellId) setCurrentWellState(updatedWell);
      toast({ title: "Success", description: "Well updated successfully" });
      return updatedWell;
    } catch (err) {
      toast({ title: "Error", description: "Failed to update well", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWell = async (wellId) => {
    setIsLoading(true);
    try {
      await pressureTransientService.deleteWell(wellId);
      setWells(prev => prev.filter(w => w.well_id !== wellId));
      if (currentWellId === wellId) setCurrentWellId(null);
      toast({ title: "Success", description: "Well deleted successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete well", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getWell = (wellId) => wells.find(w => w.well_id === wellId);
  const getAllWells = () => wells;

  // --- TEST METHODS ---
  const addTest = async (testData) => {
    setIsLoading(true);
    try {
      const newTest = await pressureTransientService.createTest(testData);
      setTests(prev => [newTest, ...prev]);
      toast({ title: "Success", description: "Test created successfully" });
      return newTest;
    } catch (err) {
      toast({ title: "Error", description: "Failed to create test", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTest = async (testId, testData) => {
    setIsLoading(true);
    try {
      const updatedTest = await pressureTransientService.updateTest(testId, testData);
      setTests(prev => prev.map(t => t.test_id === testId ? updatedTest : t));
      if (currentTestId === testId) setCurrentTestState(updatedTest);
      toast({ title: "Success", description: "Test updated successfully" });
      return updatedTest;
    } catch (err) {
      toast({ title: "Error", description: "Failed to update test", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTest = async (testId) => {
    setIsLoading(true);
    try {
      await pressureTransientService.deleteTest(testId);
      setTests(prev => prev.filter(t => t.test_id !== testId));
      if (currentTestId === testId) setCurrentTestId(null);
      toast({ title: "Success", description: "Test deleted successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete test", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTest = (testId) => tests.find(t => t.test_id === testId);
  const getTestsByWell = (wellId) => tests.filter(t => t.well_id === wellId);
  const getAllTests = () => tests;

  // --- RESULT METHODS ---
  const addResult = async (resultData) => {
    setIsLoading(true);
    try {
      const newResult = await pressureTransientService.createResult(resultData);
      setResults(prev => [newResult, ...prev]);
      toast({ title: "Success", description: "Analysis result saved" });
      return newResult;
    } catch (err) {
      toast({ title: "Error", description: "Failed to save result", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateResult = async (resultId, resultData) => {
    setIsLoading(true);
    try {
      const updatedResult = await pressureTransientService.updateResult(resultId, resultData);
      setResults(prev => prev.map(r => r.result_id === resultId ? updatedResult : r));
      if (currentResultId === resultId) setCurrentResultState(updatedResult);
      toast({ title: "Success", description: "Result updated" });
      return updatedResult;
    } catch (err) {
      toast({ title: "Error", description: "Failed to update result", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResult = async (resultId) => {
    setIsLoading(true);
    try {
      await pressureTransientService.deleteResult(resultId);
      setResults(prev => prev.filter(r => r.result_id !== resultId));
      if (currentResultId === resultId) setCurrentResultId(null);
      toast({ title: "Success", description: "Result deleted" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete result", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getResult = (resultId) => results.find(r => r.result_id === resultId);
  const getResultsByTest = (testId) => results.filter(r => r.test_id === testId);
  const getAllResults = () => results;

  // --- CURRENT SELECTION METHODS ---
  const setCurrentWell = (wellOrId) => {
    if (!wellOrId) {
      setCurrentWellId(null);
      return;
    }
    const id = typeof wellOrId === 'object' ? wellOrId.well_id : wellOrId;
    setCurrentWellId(id);
  };

  const setCurrentTest = (testOrId) => {
    if (!testOrId) {
      setCurrentTestId(null);
      return;
    }
    const id = typeof testOrId === 'object' ? testOrId.test_id : testOrId;
    setCurrentTestId(id);
  };

  const setCurrentResult = (resultOrId) => {
    if (!resultOrId) {
      setCurrentResultId(null);
      return;
    }
    const id = typeof resultOrId === 'object' ? resultOrId.result_id : resultOrId;
    setCurrentResultId(id);
  };

  return (
    <PressureTransientContext.Provider
      value={{
        // State
        wells,
        tests,
        results,
        currentWell: currentWellState,
        currentTest: currentTestState,
        currentResult: currentResultState,
        isLoading,
        error,

        // Well Methods
        addWell,
        updateWell,
        deleteWell,
        getWell,
        getAllWells,

        // Test Methods
        addTest,
        updateTest,
        deleteTest,
        getTest,
        getTestsByWell,
        getAllTests,

        // Result Methods
        addResult,
        updateResult,
        deleteResult,
        getResult,
        getResultsByTest,
        getAllResults,

        // Selection Methods
        setCurrentWell,
        setCurrentTest,
        setCurrentResult,

        // Utils
        clearLocalStorage,
        refreshAllData
      }}
    >
      {children}
    </PressureTransientContext.Provider>
  );
};