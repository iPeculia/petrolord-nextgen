import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ResendUniversityOnboardingEmail from '@/components/ResendUniversityOnboardingEmail';

const SuccessView = ({ emailSendingStatus, repEmail, applicationId, repName, universityName, departments }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <Card className="bg-[#1E293B] border-emerald-500/30 border-2 shadow-2xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Application Received!</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Thank you for applying to the Petrolord NextGen program. 
              {emailSendingStatus === 'success' ? (
                <> We have sent a confirmation email to <span className="text-[#BFFF00] font-medium block mt-1">{repEmail}</span></>
              ) : (
                  <span className="block mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-md text-sm">
                    <strong>Note:</strong> We received your application, but the confirmation email could not be sent due to a temporary system delay.
                  </span>
              )}
            </p>

            {emailSendingStatus === 'error' && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 mb-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>You can try resending the confirmation email manually:</span>
                  </div>
                  <ResendUniversityOnboardingEmail 
                    applicationId={applicationId}
                    email={repEmail}
                    name={repName}
                    universityName={universityName}
                    departments={departments}
                  />
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 rounded-lg p-6 mb-8 text-left">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#BFFF00]" />
                What happens next?
              </h4>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>1. Our admin team will review your university credentials.</li>
                <li>2. Verification usually takes 2-3 business days.</li>
                <li>3. Upon approval, you will receive an invitation to set up your admin account.</li>
              </ul>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessView;