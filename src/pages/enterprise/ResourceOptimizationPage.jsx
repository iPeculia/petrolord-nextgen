import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { Layers } from 'lucide-react';

const ResourceOptimizationPage = () => (
  <GenericMLPage 
    title="Resource Optimization" 
    description="Optimize allocation of personnel, equipment, and capital across assets."
    type="Optimization"
    icon={Layers}
  />
);
export default ResourceOptimizationPage;