import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { Box } from 'lucide-react';

const IntelligentClusteringPage = () => (
  <GenericMLPage 
    title="Intelligent Clustering" 
    description="Group similar wells, reservoirs, or operational events automatically."
    type="Clustering"
    icon={Box}
  />
);
export default IntelligentClusteringPage;