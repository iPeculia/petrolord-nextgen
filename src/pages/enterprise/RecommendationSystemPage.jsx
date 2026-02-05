import React from 'react';
import GenericMLPage from '@/components/ai/GenericMLPage';
import { Lightbulb } from 'lucide-react';

const RecommendationSystemPage = () => (
  <GenericMLPage 
    title="Recommendation System" 
    description="Get AI-driven suggestions for next-best-actions in well intervention and drilling."
    type="Recommendation"
    icon={Lightbulb}
  />
);
export default RecommendationSystemPage;