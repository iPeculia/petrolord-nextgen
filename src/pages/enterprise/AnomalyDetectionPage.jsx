import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { AlertTriangle } from 'lucide-react';

const AnomalyDetectionPage = () => (
  <GenericMLPage 
    title="Anomaly Detection" 
    description="Identify outliers in production data, sensor readings, and financial logs."
    type="Anomaly Detection"
    icon={AlertTriangle}
  />
);
export default AnomalyDetectionPage;