import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to interact with the Planning Web Worker.
 */
const usePlanningWorker = () => {
  const [worker, setWorker] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState({}); // Map of taskId -> { status, progress, result, error }
  
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize Worker
    const planningWorker = new Worker(new URL('../workers/planningWorker.js', import.meta.url), { type: 'module' });
    
    planningWorker.onmessage = (e) => {
      const { type, id, payload } = e.data;

      setTasks(prev => {
        const currentTask = prev[id] || {};
        
        if (type === 'PROGRESS') {
           return {
               ...prev,
               [id]: { ...currentTask, status: 'processing', progress: payload.progress, message: payload.status }
           };
        } else if (type === 'SUCCESS') {
           return {
               ...prev,
               [id]: { ...currentTask, status: 'completed', progress: 100, result: payload, completedAt: new Date() }
           };
        } else if (type === 'ERROR') {
            return {
                ...prev,
                [id]: { ...currentTask, status: 'error', error: payload, completedAt: new Date() }
            };
        }
        return prev;
      });

      if (type === 'SUCCESS' || type === 'ERROR') {
          // Check if any other tasks are running (simplified global loading state)
          // Ideally we track active count
          setIsProcessing(false); 
      }
    };

    workerRef.current = planningWorker;
    setWorker(planningWorker);

    return () => {
      planningWorker.terminate();
    };
  }, []);

  const runTask = useCallback((type, payload) => {
    if (!workerRef.current) return null;
    
    const id = uuidv4();
    setIsProcessing(true);
    
    // Init task state
    setTasks(prev => ({
        ...prev,
        [id]: { id, type, status: 'pending', progress: 0, submittedAt: new Date() }
    }));

    workerRef.current.postMessage({ type, payload, id });
    return id;
  }, []);

  const getTask = useCallback((id) => tasks[id], [tasks]);

  return {
    runTask,
    getTask,
    tasks,
    isProcessing
  };
};

export default usePlanningWorker;