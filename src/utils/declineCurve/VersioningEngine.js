export const getHistory = (projectId) => {
    // Mock history
    return [
        { id: 'v3', version: '3.0', date: new Date().toISOString(), user: 'Alex Chen', change: 'Updated forecast limit', type: 'minor' },
        { id: 'v2', version: '2.1', date: new Date(Date.now() - 86400000).toISOString(), user: 'Alex Chen', change: 'Added 2 new wells', type: 'minor' },
        { id: 'v1', version: '1.0', date: new Date(Date.now() - 172800000).toISOString(), user: 'System', change: 'Project Created', type: 'major' },
    ];
};