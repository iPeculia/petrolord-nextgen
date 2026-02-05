export const defaultTrackConfig = {
  width: 200,
  showGrid: true,
  tracks: [
    {
      id: 'depth',
      type: 'depth',
      width: 60
    },
    {
      id: 'gamma',
      type: 'log',
      title: 'Gamma Ray',
      curves: ['GR'],
      scale: { min: 0, max: 150, type: 'linear' }
    },
    {
      id: 'resistivity',
      type: 'log',
      title: 'Resistivity',
      curves: ['RES_DEEP', 'RES_MED'],
      scale: { min: 0.2, max: 2000, type: 'log' }
    }
  ]
};