export const helpArticles = [
  // Getting Started
  {
    id: 'gs-001',
    category: 'Getting Started',
    title: 'Welcome to Facility Master Planner',
    content: `
      <h2>Introduction</h2>
      <p>The Facility Master Planner is a comprehensive tool designed to help engineers and planners optimize oil and gas facility development. It integrates production forecasting, capacity analysis, and economic modeling into a single platform.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Interactive Process Flow Diagrams</li>
        <li>Automated Capacity Bottleneck Analysis</li>
        <li>Expansion Roadmap Generation</li>
        <li>CAPEX and NPV Estimation</li>
      </ul>
    `,
    relatedIds: ['gs-002', 'gs-003'],
    keywords: ['intro', 'overview', 'features']
  },
  {
    id: 'gs-002',
    category: 'Getting Started',
    title: 'Creating Your First Project',
    content: `
      <h2>Step-by-Step Guide</h2>
      <ol>
        <li>Click on the <strong>Project Selector</strong> in the top navigation bar.</li>
        <li>Select <strong>Add New Project</strong>.</li>
        <li>Fill in the project details such as Name, Location, and Facility Type (e.g., FPSO, CPF).</li>
        <li>Set your economic parameters like Discount Rate and Currency.</li>
        <li>Click <strong>Create Project</strong> to initialize your workspace.</li>
      </ol>
    `,
    relatedIds: ['gs-001', 'pl-101'],
    keywords: ['create project', 'new project', 'setup']
  },
  {
    id: 'gs-003',
    category: 'Getting Started',
    title: 'Navigating the Interface',
    content: `
      <h2>Workspace Overview</h2>
      <p>The interface is divided into three main areas:</p>
      <ul>
        <li><strong>Left Sidebar:</strong> Navigation tree for Projects, Facilities, Units, and Equipment.</li>
        <li><strong>Main Canvas:</strong> Interactive visualization of your facility layout and charts.</li>
        <li><strong>Right Panel:</strong> Detailed properties, quick stats, and validation warnings.</li>
      </ul>
    `,
    relatedIds: ['gs-001'],
    keywords: ['interface', 'navigation', 'layout']
  },
  {
    id: 'gs-004',
    category: 'Getting Started',
    title: 'Defining Process Units',
    content: `
      <h2>Adding Units</h2>
      <p>Process units represent major functional blocks like Separation, Compression, or Power Generation.</p>
      <p>To add a unit, select your facility in the sidebar and click the <strong>+</strong> icon next to "Process Units". Define the design capacity and type.</p>
    `,
    relatedIds: ['ua-001'],
    keywords: ['process units', 'separation', 'compression']
  },
  {
    id: 'gs-005',
    category: 'Getting Started',
    title: 'Importing Production Data',
    content: `
      <h2>Data Import</h2>
      <p>Go to the <strong>Production Schedule</strong> tab. You can manually enter annual rates or copy-paste from Excel. Ensure your forecast covers the full life of the field.</p>
    `,
    relatedIds: ['pl-103'],
    keywords: ['import', 'production', 'data']
  },

  // Facility Planning 101
  {
    id: 'pl-101',
    category: 'Planning 101',
    title: 'Understanding Capacity Constraints',
    content: `
      <h2>What is a Bottleneck?</h2>
      <p>A bottleneck occurs when the demand on a specific process unit exceeds its design capacity. This limits the total throughput of the facility.</p>
      <h3>Types of Constraints</h3>
      <ul>
        <li><strong>Hydraulic:</strong> Flow rate limits due to pipe size or vessel residence time.</li>
        <li><strong>Power:</strong> Insufficient electrical power for pumps/compressors.</li>
        <li><strong>Thermal:</strong> Cooling or heating duty limits.</li>
      </ul>
    `,
    relatedIds: ['pl-102'],
    keywords: ['bottleneck', 'constraint', 'capacity']
  },
  {
    id: 'pl-102',
    category: 'Planning 101',
    title: 'Debottlenecking Strategies',
    content: `
      <h2>Optimization Approaches</h2>
      <p>Once a bottleneck is identified, you have several options:</p>
      <ul>
        <li><strong>Retrofit:</strong> Upgrade internals (e.g., high-efficiency coalescers).</li>
        <li><strong>Parallel Train:</strong> Add a new vessel/pump in parallel.</li>
        <li><strong>Process Change:</strong> Reduce load (e.g., lower separator pressure).</li>
      </ul>
    `,
    relatedIds: ['pl-101'],
    keywords: ['debottlenecking', 'retrofit', 'expansion']
  },
  // ... (Add 8 more Planning 101 articles here for full set)

  // Using the App
  {
    id: 'ua-001',
    category: 'Using the App',
    title: 'Running a Capacity Analysis',
    content: `
      <h2>Executing the Engine</h2>
      <p>Navigate to the <strong>Analysis</strong> tab. Click "Re-Run Analysis". The engine will compare your production profile against equipment limits year-by-year and highlight red flags.</p>
    `,
    relatedIds: ['ua-002'],
    keywords: ['analysis', 'run', 'engine']
  },
  // ... (Add 11 more Using the App articles here)

  // Guidelines
  {
    id: 'gl-001',
    category: 'Guidelines',
    title: 'API RP 14C Compliance',
    content: `
      <h2>Safety Systems</h2>
      <p>Ensure all expansion plans comply with API RP 14C for offshore safety systems. Our risk module checks for basic compliance gaps.</p>
    `,
    relatedIds: ['gl-002'],
    keywords: ['api', 'standards', 'safety']
  }
  // ... (Add 7 more Guidelines articles here)
];