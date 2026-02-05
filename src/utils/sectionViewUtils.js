import { interpolateHsl } from 'd3-interpolate';
import { scaleSequential } from 'd3-scale';

export const SECTION_TYPES = {
    INLINE: 'i',
    CROSSLINE: 'j'
};

export const FACIES_COLORS = {
    'Sand': '#fcd34d',
    'Shaly Sand': '#a3e635',
    'Shale': '#94a3b8',
    'Null': 'transparent'
};

const waterScale = scaleSequential(interpolateHsl("#f0f9ff", "#0284c7")).domain([0, 1]);
const oilScale = scaleSequential(interpolateHsl("#ecfccb", "#166534")).domain([0, 1]);
const gasScale = scaleSequential(interpolateHsl("#fff7ed", "#ea580c")).domain([0, 1]);
const pressureScale = scaleSequential(interpolateHsl("#eef2ff", "#4338ca")).domain([100, 350]);

export const getPropertyColor = (value, propertyType, facies) => {
    if (facies === 'Null' || value === null || value === undefined) return 'transparent';
    switch (propertyType) {
        case 'sw': return waterScale(value);
        case 'so': return oilScale(value);
        case 'sg': return gasScale(value);
        case 'pressure': return pressureScale(value);
        case 'facies': return FACIES_COLORS[value] || '#cbd5e1';
        default: return '#cbd5e1';
    }
};

export const extractSectionCells = (gridData, type, index, gridDims) => {
    const sectionCells = [];
    if (!gridData || !gridDims) return [];
    const { nx, ny, nz } = gridDims;

    if (type === SECTION_TYPES.INLINE) {
        if (index < 0 || index >= nx) return [];
        for (let j = 0; j < ny; j++) {
            for (let k = 0; k < nz; k++) {
                const cell = gridData[index]?.[j]?.[k];
                if (cell) {
                    sectionCells.push({ ...cell, plotX: j, plotY: cell.tvd });
                }
            }
        }
    } else {
        if (index < 0 || index >= ny) return [];
        for (let i = 0; i < nx; i++) {
            for (let k = 0; k < nz; k++) {
                const cell = gridData[i]?.[index]?.[k];
                if (cell) {
                    sectionCells.push({ ...cell, plotX: i, plotY: cell.tvd });
                }
            }
        }
    }
    return sectionCells;
};

export const findWellsOnSection = (wells, type, index, tolerance = 1) => {
    if (!wells) return [];
    return wells.filter(well => {
        const wellPos = type === SECTION_TYPES.INLINE ? well.i : well.j;
        return Math.abs(wellPos - index) <= tolerance;
    }).map(well => ({
        ...well,
        plotX: type === SECTION_TYPES.INLINE ? well.j : well.i
    }));
};