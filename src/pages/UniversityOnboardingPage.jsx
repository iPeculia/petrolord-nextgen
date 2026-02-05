import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, FormProvider } from 'react-hook-form';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

// Sub-components
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import RepDetailsStep from '@/components/onboarding/RepDetailsStep';
import UniversityInfoStep from '@/components/onboarding/UniversityInfoStep';
import SuccessView from '@/components/onboarding/SuccessView';

const UniversityOnboardingPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [emailSendingStatus, setEmailSendingStatus] = useState('pending');

  const methods = useForm();
  const { watch } = methods;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log("[Onboarding] Starting submission process...");

    try {
      // 2. Database Submission
      console.log("[Onboarding] Inserting application into DB...");
      const { data: dbData, error: dbError } = await supabase
        .from('university_applications')
        .insert([{
          rep_name: data.rep_name,
          rep_position: data.rep_position,
          rep_email: data.rep_email,
          university_name: data.university_name,
          address: data.address,
          phone: data.phone,
          website: data.website || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (dbError) {
        console.error("[Onboarding] DB Insert Error:", dbError);
        throw new Error(`Database Error: ${dbError.message}`);
      }
      
      console.log("[Onboarding] DB Insert Success. ID:", dbData.id);
      setApplicationId(dbData.id);

      // 3. Email Notification (Edge Function)
      console.log("[Onboarding] Invoking email notification function...");
      try {
        const { data: funcData, error: fnError } = await supabase.functions.invoke('university-onboarding-notification', {
          body: {
            application_id: dbData.id,
            rep_name: data.rep_name,
            rep_email: data.rep_email,
            university_name: data.university_name,
          }
        });

        if (fnError) {
           console.error("[Onboarding] Function Network/Invoke Error:", fnError);
           setEmailSendingStatus('error');
           toast({
              title: "Application Saved",
              description: "We saved your application, but couldn't send the confirmation email immediately.",
              variant: "warning",
              duration: 6000,
          });
        } else if (funcData && !funcData.success) {
           console.error("[Onboarding] Function Logic Error:", funcData.error);
           setEmailSendingStatus('error');
        } else {
           console.log("[Onboarding] Email sent successfully.");
           setEmailSendingStatus('success');
        }
      } catch (emailErr) {
        console.error("[Onboarding] Unexpected Email Logic Exception:", emailErr);
        setEmailSendingStatus('error');
      }

      setSubmitSuccess(true);
      window.scrollTo(0, 0);

    } catch (error) {
      console.error("[Onboarding] Fatal Submission Error:", error);
      toast({
         title: "Submission Failed",
         description: error.message || "An unexpected error occurred. Please try again.",
         variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <SuccessView 
        emailSendingStatus={emailSendingStatus}
        repEmail={watch('rep_email')}
        applicationId={applicationId}
        repName={watch('rep_name')}
        universityName={watch('university_name')}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>University Onboarding | Petrolord NextGen</title>
        <meta name="description" content="Apply for institutional access to the Petrolord NextGen Suite." />
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/grid-dark-1-M1t2.png')] bg-fixed">
        <div className="max-w-4xl mx-auto">
          <OnboardingHeader />

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              
              <RepDetailsStep />
              <UniversityInfoStep />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold px-8 h-14 text-lg shadow-[0_0_20px_rgba(191,255,0,0.3)] hover:shadow-[0_0_30px_rgba(191,255,0,0.5)] transition-all w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default UniversityOnboardingPage;