import React from 'react';
import { 
  Layers, BarChart, Box, Activity, Database, Scale, TrendingDown, 
  FlaskConical, Droplets, TrendingUp, Settings, LineChart, ArrowUpCircle, 
  GitMerge, Gauge, Calculator, Percent, Banknote, AlertTriangle, PieChart, 
  Map, PenTool, Waves, RotateCw, CircleDot, Building2
} from 'lucide-react';

const GradientDef = ({ id, from, to }) => (
  <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor={from} />
    <stop offset="100%" stopColor={to} />
  </linearGradient>
);

const IconWrapper = ({ children, gradientId, from, to, className = "w-16 h-16" }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={`url(#${gradientId})`} xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <GradientDef id={gradientId} from={from} to={to} />
    </defs>
    {React.cloneElement(children, { stroke: `url(#${gradientId})`, strokeWidth: 1.5 })}
  </svg>
);

// --- Geoscience ---
export const WellLogIcon = ({ className }) => (
  <IconWrapper gradientId="blue-cyan" from="#3B82F6" to="#06B6D4" className={className}>
    <Layers />
  </IconWrapper>
);
export const PetrophysicalIcon = ({ className }) => (
  <IconWrapper gradientId="orange-red" from="#F97316" to="#EF4444" className={className}>
    <BarChart />
  </IconWrapper>
);
export const VolumetricsIcon = ({ className }) => (
  <IconWrapper gradientId="purple-pink" from="#A855F7" to="#EC4899" className={className}>
    <Box />
  </IconWrapper>
);
export const SeismicIcon = ({ className }) => (
  <IconWrapper gradientId="teal-green" from="#14B8A6" to="#10B981" className={className}>
    <Activity />
  </IconWrapper>
);
export const StratumVaultIcon = ({ className }) => (
  <IconWrapper gradientId="gold-amber" from="#EAB308" to="#F59E0B" className={className}>
    <Database />
  </IconWrapper>
);

// --- Reservoir Engineering ---
export const MaterialBalanceIcon = ({ className }) => (
  <IconWrapper gradientId="green-grad" from="#22C55E" to="#16A34A" className={className}>
    <Scale />
  </IconWrapper>
);
export const DeclineCurveIcon = ({ className }) => (
  <IconWrapper gradientId="lime-grad" from="#84CC16" to="#65A30D" className={className}>
    <TrendingDown />
  </IconWrapper>
);
export const FluidSystemsIcon = ({ className }) => (
  <IconWrapper gradientId="bright-green" from="#4ADE80" to="#22C55E" className={className}>
    <FlaskConical />
  </IconWrapper>
);
export const WaterfloodIcon = ({ className }) => (
  <IconWrapper gradientId="emerald-grad" from="#10B981" to="#059669" className={className}>
    <Droplets />
  </IconWrapper>
);
export const ReservoirBalanceIcon = ({ className }) => (
  <IconWrapper gradientId="lime-balance" from="#BEF264" to="#84CC16" className={className}>
    <Scale />
  </IconWrapper>
);
export const ProductionForecastingIcon = ({ className }) => (
  <IconWrapper gradientId="prod-forecast" from="#4ADE80" to="#15803D" className={className}>
    <TrendingUp />
  </IconWrapper>
);

// --- Production ---
export const ProdOptimizationIcon = ({ className }) => (
  <IconWrapper gradientId="bright-blue" from="#3B82F6" to="#2563EB" className={className}>
    <Settings />
  </IconWrapper>
);
export const WellPerformanceIcon = ({ className }) => (
  <IconWrapper gradientId="cyan-grad" from="#06B6D4" to="#0891B2" className={className}>
    <LineChart />
  </IconWrapper>
);
export const ArtificialLiftIcon = ({ className }) => (
  <IconWrapper gradientId="orange-grad" from="#F97316" to="#EA580C" className={className}>
    <ArrowUpCircle />
  </IconWrapper>
);
export const NodalAnalysisIcon = ({ className }) => (
  <IconWrapper gradientId="red-grad" from="#EF4444" to="#DC2626" className={className}>
    <GitMerge />
  </IconWrapper>
);
export const PressureTransientIcon = ({ className }) => (
  <IconWrapper gradientId="purple-grad" from="#A855F7" to="#9333EA" className={className}>
    <Gauge />
  </IconWrapper>
);

// --- Economics ---
export const NPVIcon = ({ className }) => (
  <IconWrapper gradientId="gold-grad" from="#EAB308" to="#CA8A04" className={className}>
    <Calculator />
  </IconWrapper>
);
export const IRRIcon = ({ className }) => (
  <IconWrapper gradientId="amber-grad" from="#F59E0B" to="#D97706" className={className}>
    <Percent />
  </IconWrapper>
);
export const CashFlowIcon = ({ className }) => (
  <IconWrapper gradientId="green-econ-grad" from="#22C55E" to="#16A34A" className={className}>
    <Banknote />
  </IconWrapper>
);
export const RiskAnalysisIcon = ({ className }) => (
  <IconWrapper gradientId="red-econ-grad" from="#EF4444" to="#B91C1C" className={className}>
    <AlertTriangle />
  </IconWrapper>
);
export const PortfolioIcon = ({ className }) => (
  <IconWrapper gradientId="blue-econ-grad" from="#3B82F6" to="#1D4ED8" className={className}>
    <PieChart />
  </IconWrapper>
);

// --- Drilling ---
export const WellPlanningIcon = ({ className }) => (
  <IconWrapper gradientId="teal-drill-grad" from="#14B8A6" to="#0D9488" className={className}>
    <Map />
  </IconWrapper>
);
export const WellboreDesignIcon = ({ className }) => (
  <IconWrapper gradientId="cyan-drill-grad" from="#06B6D4" to="#0891B2" className={className}>
    <PenTool />
  </IconWrapper>
);
export const HydraulicsIcon = ({ className }) => (
  <IconWrapper gradientId="orange-drill-grad" from="#F97316" to="#EA580C" className={className}>
    <Waves />
  </IconWrapper>
);
export const TorqueDragIcon = ({ className }) => (
  <IconWrapper gradientId="red-drill-grad" from="#EF4444" to="#DC2626" className={className}>
    <RotateCw />
  </IconWrapper>
);
export const CasingDesignIcon = ({ className }) => (
  <IconWrapper gradientId="purple-drill-grad" from="#A855F7" to="#9333EA" className={className}>
    <CircleDot />
  </IconWrapper>
);

// --- Facilities ---
export const FacilitiesIcon = ({ className }) => (
  <IconWrapper gradientId="facilities-grad" from="#6366f1" to="#8b5cf6" className={className}>
    <Building2 />
  </IconWrapper>
);

// Default export for dynamic usage
const ModuleIcons = ({ type, className }) => {
  switch (type?.toLowerCase()) {
    case 'drilling':
      return <WellPlanningIcon className={className} />;
    case 'production':
      return <ProdOptimizationIcon className={className} />;
    case 'reservoir':
      return <MaterialBalanceIcon className={className} />;
    case 'economics':
      return <NPVIcon className={className} />;
    case 'geoscience':
      return <WellLogIcon className={className} />;
    case 'facilities':
      return <FacilitiesIcon className={className} />;
    default:
      return <Layers className={className} />;
  }
};

export default ModuleIcons;