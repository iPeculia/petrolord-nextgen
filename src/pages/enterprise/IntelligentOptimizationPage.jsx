import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { Zap } from 'lucide-react';

const IntelligentOptimizationPage = () => (
  <GenericMLPage 
    title="Intelligent Optimization" 
    description="Solve complex multi-objective problems for field development and logistics."
    type="Optimization"
    icon={Zap}
  />
);
export default IntelligentOptimizationPage;