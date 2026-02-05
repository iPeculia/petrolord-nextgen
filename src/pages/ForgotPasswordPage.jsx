import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ForgotPasswordPage = () => {
  const { resetPasswordForEmail, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { error } = await resetPasswordForEmail(data.email);
    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Email Sent",
        description: "If an account exists, a password reset link has been sent to your email.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Petrolord NextGen Suite</title>
        <meta name="description" content="Request a password reset link for your Petrolord NextGen Suite account." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8 p-10 bg-[#1E293B] rounded-lg shadow-lg border border-gray-800"
        >
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-7N6nn.png"
              alt="Petrolord Workflow Suite"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          {!emailSent ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <Label htmlFor="email-address" className="sr-only">
                    Email address
                  </Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-[#BFFF00] focus:border-[#BFFF00] focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#0F172A] bg-[#BFFF00] hover:bg-[#A8E600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BFFF00]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Send reset link
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center text-white">
              <p>A password reset link has been sent to your email address. Please check your inbox.</p>
              <Link to="/login" className="mt-4 block font-medium text-[#BFFF00] hover:text-[#A8E600]">
                Back to Login
              </Link>
            </div>
          )}
          <div className="text-center">
            <Link to="/login" className="font-medium text-[#BFFF00] hover:text-[#A8E600]">
              Remembered your password? Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;