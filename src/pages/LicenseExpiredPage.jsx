import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LicenseExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <Card className="bg-[#1E293B] border-red-900/50 p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">License Expired</h1>
          
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your academic license for this module has expired. You no longer have access to these advanced features.
            Please contact your university administrator to renew your access.
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status Again
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500">
            Error Code: LIC_EXP_001 • Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LicenseExpiredPage;