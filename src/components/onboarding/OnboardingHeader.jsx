import React from 'react';
import { motion } from 'framer-motion';

const OnboardingHeader = () => {
  return (
    <div className="text-center mb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center justify-center p-3 bg-slate-800/50 rounded-xl mb-6 border border-slate-700"
      >
        <img 
          src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-7N6nn.png" 
          alt="Logo" 
          className="w-10 h-10"
        />
      </motion.div>
      <h1 className="text-4xl font-bold text-white mb-4">University Partner Application</h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Join the network of forward-thinking institutions using Petrolord NextGen to train the energy workforce of tomorrow.
      </p>
    </div>
  );
};

export default OnboardingHeader;