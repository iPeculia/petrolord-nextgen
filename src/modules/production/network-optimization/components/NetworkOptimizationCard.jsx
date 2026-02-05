import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network } from 'lucide-react';
import AppCard from '@/components/modules/AppCard';

const NetworkOptimizationCard = () => {
  const navigate = useNavigate();
  
  return (
    <AppCard
      title="Network Optimization Studio"
      description="Interactive network design and optimization for production systems."
      icon={Network}
      status="available"
      actionText="Launch Studio"
      colorTheme="#06B6D4" // Cyan-500
      onNavigate={() => navigate('/dashboard/modules/production/network-optimization')}
    />
  );
};

export default NetworkOptimizationCard;