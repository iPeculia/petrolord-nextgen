/**
 * Simple Moving Average
 */
export const calculateSMA = (data, windowSize = 7, valueKey = 'oilRate') => {
    if (!data || data.length < windowSize) return data;

    return data.map((point, index) => {
        if (index < windowSize - 1) {
            // Not enough data points yet, return original or partial average
            return { ...point, [`${valueKey}_smooth`]: point[valueKey] };
        }

        let sum = 0;
        for (let i = 0; i < windowSize; i++) {
            sum += (data[index - i][valueKey] || 0);
        }
        
        return {
            ...point,
            [`${valueKey}_smooth`]: sum / windowSize
        };
    });
};

/**
 * Exponential Moving Average
 */
export const calculateEMA = (data, alpha = 0.2, valueKey = 'oilRate') => {
    if (!data || data.length === 0) return data;

    let previousEma = data[0][valueKey] || 0;
    
    return data.map((point, index) => {
        if (index === 0) {
            return { ...point, [`${valueKey}_smooth`]: point[valueKey] };
        }
        
        const currentVal = point[valueKey] || 0;
        const ema = alpha * currentVal + (1 - alpha) * previousEma;
        previousEma = ema;
        
        return {
            ...point,
            [`${valueKey}_smooth`]: ema
        };
    });
};