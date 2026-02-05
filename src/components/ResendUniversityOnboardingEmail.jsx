import React, { useState } from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const ResendUniversityOnboardingEmail = ({ applicationId, email, name, universityName, departments }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('idle'); // idle, success, error
  const { toast } = useToast();

  const handleResend = async () => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID is missing. Cannot resend email.",
        variant: "destructive"
      });
      return;
    }

    setIsResending(true);
    setResendStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('university-onboarding-notification', {
        body: {
          application_id: applicationId,
          rep_email: email,
          rep_name: name,
          university_name: universityName,
          departments: departments
        }
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.error || 'Unknown error occurred');

      setResendStatus('success');
      toast({
        title: "Email Sent",
        description: `Confirmation email successfully resent to ${email}`,
        variant: "default",
        className: "bg-emerald-500 text-white border-emerald-600"
      });

    } catch (err) {
      console.error('Resend failed:', err);
      setResendStatus('error');
      toast({
        title: "Resend Failed",
        description: err.message || "Failed to resend confirmation email. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  if (resendStatus === 'success') {
    return (
      <Button variant="outline" size="sm" className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10 cursor-default">
        <Check className="w-4 h-4 mr-2" /> Email Sent
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleResend} 
      disabled={isResending}
      className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
    >
      {isResending ? (
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4 mr-2" />
      )}
      {isResending ? 'Sending...' : 'Resend Confirmation Email'}
    </Button>
  );
};

export default ResendUniversityOnboardingEmail;