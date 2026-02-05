import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { Zap } from 'lucide-react';

const IntelligentAutomationPage = () => (
  <GenericMLPage 
    title="Intelligent Automation" 
    description="Orchestrate complex workflows across systems with AI-driven triggers and actions."
    type="Automation"
    icon={Zap}
  />
);
export default IntelligentAutomationPage;