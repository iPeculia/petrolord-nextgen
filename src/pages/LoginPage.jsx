import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithEmail, user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // If user is already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoginError(null);

    try {
        const { error } = await signInWithEmail(data.email, data.password);
        
        if (error) {
          console.error("Login error:", error);
          
          let errorMessage = error.message;
          if (errorMessage.includes("Invalid login credentials")) {
             errorMessage = "Incorrect email or password. Please check your credentials.";
          } else if (errorMessage.includes("Email not confirmed")) {
             errorMessage = "Please verify your email address before logging in.";
          }

          setLoginError(errorMessage);
          
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "Login Successful",
            description: "Redirecting to dashboard...",
            className: "bg-[#BFFF00] text-slate-900"
          });
          setTimeout(() => navigate('/dashboard'), 500);
        }
    } catch (err) {
        console.error("Unexpected login error:", err);
        setIsSubmitting(false);
        setLoginError("An unexpected network error occurred. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Petrolord NextGen Suite</title>
        <meta name="description" content="Login to your Petrolord NextGen Suite account." />
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
              className="mx-auto h-16 w-auto object-contain"
              src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-7N6nn.png"
              alt="Petrolord Workflow Suite"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {loginError && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#BFFF00] focus:border-[#BFFF00] sm:text-sm bg-gray-700 text-white"
                  placeholder="info@petrolord.com"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#BFFF00] focus:border-[#BFFF00] sm:text-sm bg-gray-700 text-white"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#BFFF00] hover:text-[#A8E600]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#0F172A] bg-[#BFFF00] hover:bg-[#A8E600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BFFF00] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;