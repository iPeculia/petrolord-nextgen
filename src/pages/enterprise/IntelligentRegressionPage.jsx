import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { Activity } from 'lucide-react';

const IntelligentRegressionPage = () => (
  <GenericMLPage 
    title="Intelligent Regression" 
    description="Model relationships between variables to estimate missing log curves or production rates."
    type="Regression"
    icon={Activity}
  />
);
export default IntelligentRegressionPage;