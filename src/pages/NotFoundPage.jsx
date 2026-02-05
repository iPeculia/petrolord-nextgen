import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 max-w-lg">
        <h1 className="text-[150px] font-black text-slate-800/50 leading-none select-none">404</h1>
        
        <div className="relative -mt-16 mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full border border-slate-700 shadow-xl mb-6">
                <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
            <p className="text-slate-400">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-semibold px-8"
            >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
            </Button>
            <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
            </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;