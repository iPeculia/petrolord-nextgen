import { v4 as uuidv4 } from 'uuid';

export const TEMPLATES = {
  wellpad: {
    name: "Standard Wellpad",
    description: "Single wellhead connected to a manifold and test separator.",
    items: [
      { type: 'Wellhead', tag: 'WH-001', offset: [0, 0], category: 'safety' },
      { type: 'Manifold', tag: 'MAN-001', offset: [0.0003, 0], category: 'piping' }, // ~30m south
      { type: 'Separator (Horizontal)', tag: 'SEP-001', offset: [0.0006, 0.0003], category: 'vessels' },
      { type: 'Storage Tank', tag: 'TK-001', offset: [0.0006, 0.0008], category: 'vessels' }
    ],
    lines: [
      { from: 'WH-001', to: 'MAN-001' },
      { from: 'MAN-001', to: 'SEP-001' },
      { from: 'SEP-001', to: 'TK-001' }
    ]
  },
  test_separator: {
    name: "Test Separator Package",
    description: "Mobile test separator skid with metering.",
    items: [
      { type: 'Separator (Horizontal)', tag: 'TEST-SEP-01', offset: [0, 0], category: 'vessels' },
      { type: 'Meter Skid', tag: 'MTR-01', offset: [0, 0.0004], category: 'instrumentation' }
    ],
    lines: [
      { from: 'TEST-SEP-01', to: 'MTR-01' }
    ]
  },
  water_injection: {
    name: "Water Injection Skid",
    description: "Filtration and high pressure pump package.",
    items: [
      { type: 'Filter', tag: 'FIL-101', offset: [0, 0], category: 'vessels' },
      { type: 'Booster Pump', tag: 'P-101', offset: [0, 0.0003], category: 'rotating' },
      { type: 'Injection Pump', tag: 'P-102', offset: [0, 0.0006], category: 'rotating' }
    ],
    lines: [
      { from: 'FIL-101', to: 'P-101' },
      { from: 'P-101', to: 'P-102' }
    ]
  }
};

export const instantiateTemplate = (templateKey, startLat, startLng) => {
  const template = TEMPLATES[templateKey];
  if (!template) return { items: [], lines: [] };

  const itemMap = {}; // old tag -> new id
  const newItems = template.items.map(t => {
    const id = uuidv4();
    itemMap[t.tag] = id;
    return {
      id,
      tag: t.tag, // Keep tag for initial display
      type: t.type,
      lat: startLat + t.offset[0],
      lng: startLng + t.offset[1],
      rotation: 0,
      scale_x: 1,
      scale_y: 1,
      category: t.category,
      status: 'Proposed',
      properties: { service: template.name }
    };
  });

  const newLines = template.lines.map((l, idx) => {
    const fromItem = newItems.find(i => i.tag === l.from);
    const toItem = newItems.find(i => i.tag === l.to);
    
    if (!fromItem || !toItem) return null;

    return {
      id: uuidv4(),
      line_id: `L-${idx+100}`,
      from_tag: l.from,
      to_tag: l.to,
      points: [{lat: fromItem.lat, lng: fromItem.lng}, {lat: toItem.lat, lng: toItem.lng}],
      properties: {
        size: '4"',
        spec: 'CS',
        fluid: 'Process'
      },
      status: 'Proposed',
      flow_direction: 'forward'
    };
  }).filter(Boolean);

  return { items: newItems, lines: newLines };
};