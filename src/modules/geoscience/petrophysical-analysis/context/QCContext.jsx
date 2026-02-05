import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { calculateDataQualityMetrics, detectDepthGaps, detectOutliers, classifyCurve } from '../utils/qcCalculations';
import { useToast } from '@/components/ui/use-toast';

const QCContext = createContext();

export const QCProvider = ({ children }) => {
  const { activeWell, wellLogs, wells } = useGlobalDataStore();
  const { toast } = useToast();
  
  const [qcResults, setQcResults] = useState({});
  const [issues, setIssues] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState({
    zScoreThreshold: 3.0,
    checkForSpikes: true,
    checkForGaps: true,
    checkForFlatline: true,
    outlierMethod: 'zscore'
  });

  // Helper to get well name reliably
  const activeWellName = activeWell && wells && wells[activeWell] 
    ? wells[activeWell].name 
    : (activeWell ? 'Unknown Well (' + activeWell.substring(0, 8) + '...)' : 'No Well Selected');

  // Reset when active well changes
  useEffect(() => {
    setQcResults({});
    setIssues([]);
  }, [activeWell]);

  const runQCChecks = useCallback(async () => {
    if (!activeWell || !wellLogs[activeWell]) {
      toast({ title: "No data", description: "Please select a well with logs first.", variant: "destructive" });
      return;
    }

    setIsRunning(true);
    const logs = wellLogs[activeWell];
    const results = {};
    const newIssues = [];
    
    // Use setTimeout to allow UI to update to "Running" state before heavy calculation
    setTimeout(() => {
        try {
            Object.entries(logs).forEach(([curveId, curve]) => {
                const { value_array, depth_array, log_name, unit } = curve;
                
                // 1. Basic Metrics
                const metrics = calculateDataQualityMetrics(value_array, depth_array);
                
                // 2. Classification & Limit Check
                const classification = classifyCurve(log_name, unit);
                
                // 3. Gap Detection
                const gapData = detectDepthGaps(depth_array);

                // 4. Outlier Detection
                const outliers = detectOutliers(value_array, depth_array, settings.outlierMethod, settings.zScoreThreshold);

                // Store Results
                results[curveId] = {
                    metrics,
                    classification,
                    gaps: gapData,
                    outliers,
                    status: 'analyzed',
                    curveName: log_name // Ensure curve name is stored
                };

                // Generate Issues
                if (metrics.completeness < 95) {
                    newIssues.push({ id: crypto.randomUUID(), curveId, curveName: log_name, type: 'Data Loss', severity: 'High', description: `Curve completeness is only ${metrics.completeness.toFixed(1)}%` });
                }
                if (metrics.negativePercentage > 5 && classification.type !== 'Unknown') {
                     newIssues.push({ id: crypto.randomUUID(), curveId, curveName: log_name, type: 'Physical Range', severity: 'Medium', description: `${metrics.negativePercentage.toFixed(1)}% negative values detected.` });
                }
                if (gapData.gaps.length > 0) {
                    newIssues.push({ id: crypto.randomUUID(), curveId, curveName: log_name, type: 'Depth Gaps', severity: 'High', description: `${gapData.gaps.length} depth interval gaps detected.` });
                }
                if (outliers.length > (value_array.length * 0.05)) {
                     newIssues.push({ id: crypto.randomUUID(), curveId, curveName: log_name, type: 'Noise', severity: 'Low', description: `High number of statistical outliers detected (${outliers.length}).` });
                }
            });

            setQcResults(results);
            setIssues(newIssues);
            toast({ title: "QC Complete", description: `Analyzed ${Object.keys(logs).length} curves for ${activeWellName}.` });

        } catch (error) {
            console.error("QC Error", error);
            toast({ title: "QC Failed", description: "An error occurred during analysis.", variant: "destructive" });
        } finally {
            setIsRunning(false);
        }
    }, 100);
  }, [activeWell, wellLogs, settings, toast, activeWellName]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resolveIssue = (issueId) => {
    setIssues(prev => prev.filter(i => i.id !== issueId));
  };

  return (
    <QCContext.Provider value={{
      qcResults,
      issues,
      isRunning,
      settings,
      runQCChecks,
      updateSettings,
      resolveIssue,
      activeWell,
      activeWellName
    }}>
      {children}
    </QCContext.Provider>
  );
};

export const useQC = () => {
  const context = useContext(QCContext);
  if (!context) throw new Error('useQC must be used within a QCProvider');
  return context;
};