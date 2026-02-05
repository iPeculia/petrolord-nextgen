import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AppCard from '@/components/modules/AppCard';
import { 
    WellLogIcon, 
    PetrophysicalIcon, 
    VolumetricsIcon, 
    SeismicIcon, 
    StratumVaultIcon 
} from '@/components/modules/ModuleIcons';

const GeosciencePage = () => {
  const applications = [
    {
      name: "Well Log Correlation",
      description: "Correlate well logs, manage stratigraphy, and build cross-sections with advanced visualization tools.",
      link: "/dashboard/modules/geoscience/well-correlation",
      icon: <WellLogIcon />,
      status: "available",
      colorTheme: "#06B6D4" // Cyan
    },
    {
      name: "Petrophysical Analysis",
      description: "Comprehensive log analysis to determine porosity, saturation, and lithology with multi-well support.",
      link: "/dashboard/modules/geoscience/petrophysics",
      icon: <PetrophysicalIcon />,
      status: "available",
      colorTheme: "#F97316" // Orange
    },
    {
      name: "Volumetrics Pro",
      description: "Calculate original hydrocarbons in place (OOIP/OGIP) using deterministic and probabilistic Monte Carlo methods.",
      link: "/dashboard/modules/geoscience/volumetrics",
      icon: <VolumetricsIcon />,
      status: "available",
      colorTheme: "#EC4899" // Pink
    },
    {
      name: "Seismic Interpretation",
      description: "Interpret seismic volumes, pick horizons, identify faults, and analyze subsurface structures in 2D/3D.",
      link: "/dashboard/modules/geoscience/seismic",
      icon: <SeismicIcon />,
      status: "available",
      colorTheme: "#10B981" // Emerald
    },
    {
      name: "StratumVault",
      description: "Formation database with geological column management, regional correlation, and lithology classification.",
      link: "#",
      icon: <StratumVaultIcon />,
      status: "coming-soon",
      colorTheme: "#EAB308" // Amber
    },
  ];

  return (
    <>
      <Helmet>
        <title>Geoscience Module - PetroLord</title>
        <meta name="description" content="Explore geoscience applications for subsurface analysis." />
      </Helmet>
      
      <div className="p-6 md:p-12 bg-[#0F172A] min-h-screen">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <h1 className="text-4xl font-bold text-white mb-4">Geoscience Module</h1>
            <p className="text-xl text-slate-400 max-w-3xl">
              A comprehensive suite of advanced tools for subsurface characterization, geological analysis, and reservoir mapping.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {applications.map((app) => (
            <AppCard
                key={app.name}
                title={app.name}
                description={app.description}
                icon={app.icon}
                link={app.link}
                status={app.status}
                colorTheme={app.colorTheme}
                actionText={app.actionText}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GeosciencePage;