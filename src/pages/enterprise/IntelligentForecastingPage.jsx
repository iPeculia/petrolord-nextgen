import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { TrendingUp } from 'lucide-react';

const IntelligentForecastingPage = () => (
  <GenericMLPage 
    title="Intelligent Forecasting" 
    description="Predict future production trends using advanced time-series algorithms."
    type="Forecasting"
    icon={TrendingUp}
  />
);
export default IntelligentForecastingPage;