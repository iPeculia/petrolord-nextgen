/**
 * Template Engine for saving and loading analysis configurations.
 */

const TEMPLATES_KEY = 'dca_templates';

export const getTemplates = () => {
    try {
        const stored = localStorage.getItem(TEMPLATES_KEY);
        return stored ? JSON.parse(stored) : getDefaults();
    } catch (e) {
        return getDefaults();
    }
};

export const saveTemplate = (template) => {
    const templates = getTemplates();
    const newTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    templates.push(newTemplate);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return newTemplate;
};

export const deleteTemplate = (id) => {
    const templates = getTemplates().filter(t => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

const getDefaults = () => [
    {
        id: 'default-1',
        name: 'Standard Permian',
        type: 'Analysis',
        description: 'Typical hyperbolic fit for Permian Basin unconventionals.',
        config: {
            fit: { modelType: 'hyperbolic', minB: 0.5, maxB: 1.5, minDi: 0.1, maxDi: 2.0 },
            forecast: { economicLimit: 5, maxDuration: 7300, stopAtLimit: true }
        },
        createdAt: new Date().toISOString()
    },
    {
        id: 'default-2',
        name: 'Late Life Gas',
        type: 'Analysis',
        description: 'Exponential decline for mature gas wells.',
        config: {
            fit: { modelType: 'exponential', minB: 0, maxB: 0 },
            forecast: { economicLimit: 50, maxDuration: 3650, stopAtLimit: true }
        },
        createdAt: new Date().toISOString()
    }
];