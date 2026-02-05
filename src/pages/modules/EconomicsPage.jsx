import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AppCard from '@/components/modules/AppCard';
import { 
    NPVIcon,
    IRRIcon,
    CashFlowIcon,
    RiskAnalysisIcon,
    PortfolioIcon
} from '@/components/modules/ModuleIcons';
import { Calculator, BarChart4 } from 'lucide-react';

const EconomicsPage = () => {
  const applications = [
    {
        name: 'IRR Analysis',
        description: 'Comprehensive financial analysis tool for calculating IRR, NPV, and other key investment metrics for energy projects.',
        path: '/dashboard/modules/economics/irr-analysis',
        icon: Calculator,
        status: 'active',
        badge: "Core",
        colorTheme: "#3B82F6" // Blue
    },
    {
        name: 'Risk Analysis Studio',
        description: 'Comprehensive risk analysis and Monte Carlo simulation for economic uncertainties.',
        path: '/dashboard/modules/economics/risk-analysis',
        icon: RiskAnalysisIcon,
        status: 'active',
        badge: "New",
        colorTheme: "#EF4444" // Red
    },
    {
        name: 'NPV Calculator',
        description: 'Calculate Net Present Value with flexible discount rates and cash flow scenarios.',
        link: '#',
        icon: <NPVIcon />,
        status: 'coming-soon',
        colorTheme: "#EAB308" // Gold
    },
    {
        name: 'Cash Flow Modeling',
        description: 'Detailed revenue and OPEX modeling with tax regimes and production decline integration.',
        link: '#',
        icon: <CashFlowIcon />,
        status: 'coming-soon',
        colorTheme: "#22C55E" // Green
    },
    {
        name: 'Portfolio Optimization',
        description: 'Strategic asset allocation and ranking to maximize corporate value and balance risk.',
        link: '#',
        icon: <PortfolioIcon />,
        status: 'coming-soon',
        colorTheme: "#3B82F6" // Blue
    }
  ];

  return (
    <>
      <Helmet>
        <title>Economics & Project Management - PetroLord</title>
        <meta name="description" content="Financial modeling and project lifecycle management" />
      </Helmet>
      
      <div className="p-6 md:p-12 bg-[#0F172A] min-h-screen">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <h1 className="text-4xl font-bold text-white mb-4">Economics & Project Management</h1>
            <p className="text-xl text-slate-400 max-w-3xl">
                Comprehensive financial modeling, risk assessment, and portfolio optimization tools.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {applications.map((app, index) => (
            <AppCard
                key={index}
                title={app.name}
                description={app.description}
                icon={app.icon}
                link={app.link}
                path={app.path}
                status={app.status}
                badge={app.badge}
                colorTheme={app.colorTheme}
            />
        ))}
        </div>
      </div>
    </>
  );
};

export default EconomicsPage;