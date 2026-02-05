import { generatePunqS3Model } from './punqS3Model';

const generateGridData = (nx, ny, pattern, timeStep, totalSteps, type) => {
    const data = [];
    const t = timeStep / totalSteps;
    for (let i = 0; i < nx; i++) {
        const row = [];
        for (let j = 0; j < ny; j++) {
            let val = 0;
            const dx = i - nx/2;
            const dy = j - ny/2;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const maxDist = Math.sqrt((nx/2)*(nx/2) + (ny/2)*(ny/2));
            const normDist = dist / maxDist;

            if (type === 'pressure') val = 0.4 + 0.6 * (1 - normDist) * (1 - 0.3*t);
            else if (type === 'sw') val = Math.max(0, Math.min(1, (1 - normDist) * (0.2 + 0.8*t)));
            else if (type === 'so') {
                 const sw = Math.max(0, Math.min(1, (1 - normDist) * (0.2 + 0.8*t)));
                 val = 1 - sw;
            } else if (type === 'sg') {
                 val = 0.05 * Math.sin(i/5) * Math.cos(j/5); 
                 if (val < 0) val = 0;
            }
            row.push(val);
        }
        data.push(row);
    }
    return data;
};

const normalizeModelData = (model) => {
    if (!model) return null;
    const grid = model.grid || model.gridSize || { nx: 20, ny: 20, nz: 1 };
    const nx = grid.nx || 20;
    const ny = grid.ny || 20;
    if (!model.data) model.data = {};
    const timeSteps = model.timeSteps || Array.from({ length: 50 }, (_, i) => i);
    const numSteps = timeSteps.length;

    const ensureProperty = (propName, generatorType) => {
        if (!model.data[propName]) {
            model.data[propName] = Array.from({ length: numSteps }, (_, t) => 
                generateGridData(nx, ny, 'default', t, numSteps, generatorType || propName)
            );
        }
    };

    ensureProperty('pressure', 'pressure');
    ensureProperty('sw', 'sw');
    if (!model.data.so) ensureProperty('so', 'so');
    if (!model.data.sg) ensureProperty('sg', 'sg');
    return model;
};

const rawPunq = generatePunqS3Model();
const punqModel = normalizeModelData(rawPunq);

const legacyModel = normalizeModelData({
    id: 'model_01',
    name: 'Quarter 5-Spot Waterflood',
    description: 'Classic waterflood pattern in a homogeneous reservoir (Simplified 2D view).',
    type: 'Waterflood',
    pattern: '5-Spot',
    grid: { nx: 20, ny: 20, nz: 1 }, 
    initialConditions: { pressure: 3500, sw: 0.2, porosity: 0.22, permeability: 150 },
    wells: [
      { id: 'I-1', type: 'Injector', x: 0, y: 0, color: '#3b82f6' },
      { id: 'P-1', type: 'Producer', x: 19, y: 19, color: '#ef4444' }
    ],
    timeSteps: Array.from({ length: 50 }, (_, i) => i * 30),
    data: {},
    events: []
});

export const SAMPLE_MODELS_DATA = [punqModel, legacyModel];