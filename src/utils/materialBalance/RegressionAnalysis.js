import { mean } from 'mathjs';

// Simple linear regression: y = mx + c
export const linearRegression = (xData, yData) => {
  if (!xData || !yData || xData.length !== yData.length || xData.length < 2) {
    return { slope: 0, intercept: 0, r2: 0, stdError: 0 };
  }

  const n = xData.length;
  const xMean = mean(xData);
  const yMean = mean(yData);

  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (xData[i] - xMean) * (yData[i] - yMean);
    den += (xData[i] - xMean) ** 2;
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  // Calculate R2
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < n; i++) {
    const yPred = slope * xData[i] + intercept;
    ssRes += (yData[i] - yPred) ** 2;
    ssTot += (yData[i] - yMean) ** 2;
  }

  const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
  
  // Calculate Standard Error of Estimate
  const stdError = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

  return { slope, intercept, r2, stdError };
};

export const calculateR2 = (xData, yData, slope, intercept) => {
    // Utility if we need R2 separately
    if (!xData || !yData || xData.length !== yData.length) return 0;
    const yMean = mean(yData);
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < xData.length; i++) {
        const yPred = slope * xData[i] + intercept;
        ssRes += (yData[i] - yPred) ** 2;
        ssTot += (yData[i] - yMean) ** 2;
    }
    return ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
};

export const calculateStandardError = (residuals) => {
    if (!residuals || residuals.length <= 2) return 0;
    const sse = residuals.reduce((acc, val) => acc + val**2, 0);
    return Math.sqrt(sse / (residuals.length - 2));
};

export const detectOutliers = (xData, yData, threshold = 2.0) => {
    // Detect outliers based on standardized residuals
    if (!xData || !yData || xData.length < 5) return [];

    const { slope, intercept, stdError } = linearRegression(xData, yData);
    if (stdError === 0) return [];

    const outliers = [];
    for(let i=0; i<xData.length; i++) {
        const yPred = slope * xData[i] + intercept;
        const residual = yData[i] - yPred;
        const zScore = Math.abs(residual / stdError);
        
        if(zScore > threshold) {
            outliers.push(i);
        }
    }
    return outliers;
};

export const removeOutliers = (xData, yData, threshold = 2.0) => {
    const outlierIndices = detectOutliers(xData, yData, threshold);
    const newX = [];
    const newY = [];
    
    for(let i=0; i<xData.length; i++) {
        if(!outlierIndices.includes(i)) {
            newX.push(xData[i]);
            newY.push(yData[i]);
        }
    }
    
    return { x: newX, y: newY, removedCount: outlierIndices.length };
};