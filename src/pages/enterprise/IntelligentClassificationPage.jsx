import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { GitBranch } from 'lucide-react';

const IntelligentClassificationPage = () => (
  <GenericMLPage 
    title="Intelligent Classification" 
    description="Classify lithology, fluid types, and operational states from raw data."
    type="Classification"
    icon={GitBranch}
  />
);
export default IntelligentClassificationPage;