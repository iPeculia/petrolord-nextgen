export const helpCategories = [
  { id: 'getting-started', label: 'Getting Started', icon: 'Rocket' },
  { id: 'features', label: 'Features', icon: 'LayoutGrid' },
  { id: 'workflows', label: 'Workflows', icon: 'Workflow' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: 'Wrench' },
  { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
  { id: 'best-practices', label: 'Best Practices', icon: 'Star' },
  { id: 'glossary', label: 'Glossary', icon: 'Book' },
];

export const helpTopics = [
  {
    id: 'intro',
    title: 'Introduction to Material Balance',
    category: 'getting-started',
    content: 'Material Balance is a fundamental reservoir engineering tool used to estimate hydrocarbons in place (OOIP/OGIP), identify drive mechanisms, and forecast future performance based on production and pressure history.'
  },
  {
    id: 'loading-data',
    title: 'Loading Sample Data',
    category: 'getting-started',
    content: 'To quickly explore the application, use the "Load Sample Data" button on the empty state dashboard. This populates the project with realistic Permian Basin reservoirs.'
  },
  {
    id: 'dashboard-kpis',
    title: 'Dashboard KPIs',
    category: 'features',
    content: 'The dashboard provides a high-level overview of your project, displaying Total Reservoirs, Active Wells, and Data Health metrics.'
  },
  {
    id: 'pvt-correlations',
    title: 'PVT Correlations',
    category: 'features',
    content: 'The application uses industry-standard black oil correlations (Standing, Vasquez-Beggs) to generate fluid properties based on API gravity and gas specific gravity.'
  },
  {
    id: 'basic-workflow',
    title: 'Basic Workflow',
    category: 'workflows',
    content: '1. Load or import data. 2. Verify PVT and Production history. 3. Perform diagnostic plots to identify drive mechanisms. 4. Run material balance calculations. 5. Forecast future production.'
  },
  {
    id: 'calc-errors',
    title: 'Calculation Errors',
    category: 'troubleshooting',
    content: 'If you encounter calculation errors, ensure your pressure data is strictly decreasing over time (for depletion drive) and that your PVT properties cover the full pressure range.'
  }
];

export const faqItems = [
  {
    question: "What is Material Balance?",
    answer: "A method to estimate reservoir volume and drive mechanisms using production and pressure data."
  },
  {
    question: "How do I import data?",
    answer: "Go to the Data & Tanks tab and use the CSV importer."
  },
  {
    question: "Can I compare scenarios?",
    answer: "Yes, use the Forecast & Scenarios tab to create and compare multiple development strategies."
  }
];

export const glossaryTerms = [
  { term: "OOIP", definition: "Original Oil In Place - The total volume of oil estimated to exist in a reservoir before production begins." },
  { term: "OGIP", definition: "Original Gas In Place - The total volume of gas estimated to exist in a reservoir." },
  { term: "Recovery Factor", definition: "The percentage of OOIP/OGIP that can be technically and economically recovered." },
  { term: "Bo", definition: "Oil Formation Volume Factor - Relates the volume of oil at reservoir conditions to stock tank conditions." }
];