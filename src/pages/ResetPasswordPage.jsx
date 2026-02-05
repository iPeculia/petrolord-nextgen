import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { toast } = useToast();
  
  const [isChecking, setIsChecking] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState('idle'); // idle, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Extract token from query parameters
  const token = searchParams.get('token');

  // Log incoming token immediately for debugging (Task 3)
  useEffect(() => {
    console.log('--- PASSWORD RESET DEBUG START ---');
    console.log('URL Search Params:', searchParams.toString());
    console.log('Extracted Token:', token);
    if (!token) {
        console.warn('Token is missing from URL parameters.');
    }
  }, [token, searchParams]);

  // Password Strength Logic
  const password = watch('password', '');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 9) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  // Validate Token on Load
  useEffect(() => {
    const validateToken = async () => {
        if (!token) {
            setErrorMessage("Invalid reset link. Token is missing.");
            setIsChecking(false);
            return;
        }

        try {
            console.log('Invoking reset-password function with action: check');
            
            const { data, error } = await supabase.functions.invoke('reset-password', {
                body: { action: 'check', token }
            });

            console.log('Supabase Function Result (Check):', { data, error });

            if (error) {
                console.error("Supabase invoke error:", error);
                throw new Error("Failed to connect to the server.");
            }
            
            if (data && data.success) {
                console.log('Token is valid. Email:', data.email);
                setIsValidToken(true);
                setUserEmail(data.email);
            } else {
                console.warn('Token validation failed:', data?.error);
                setIsValidToken(false);
                setErrorMessage(data?.error || "This link is invalid or has expired.");
            }
        } catch (err) {
            console.error("Validation error:", err);
            setIsValidToken(false);
            setErrorMessage("Failed to validate link. Please try again later.");
        } finally {
            setIsChecking(false);
        }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setResetStatus('idle');
    setErrorMessage('');

    try {
        console.log('Submitting password reset request...');
        const { data: result, error } = await supabase.functions.invoke('reset-password', {
            body: {
                action: 'reset',
                token,
                new_password: data.password
            }
        });

        console.log('Supabase Function Result (Reset):', { result, error });

        if (error) throw new Error(error.message);

        if (result && !result.success) {
             throw new Error(result.error || "Failed to reset password.");
        }

        setResetStatus('success');
        toast({
            title: "Success",
            description: "Your password has been set successfully.",
            className: "bg-emerald-600 text-white border-none"
        });

        // Delay redirect
        setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
        console.error("Reset Password Error:", err);
        setResetStatus('error');
        setErrorMessage(err.message || "Failed to reset password. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] bg-[url('https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/grid-dark-1-M1t2.png')] bg-fixed">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      )
  }

  return (
    <>
      <Helmet>
        <title>Set Password | Petrolord NextGen</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/grid-dark-1-M1t2.png')] bg-fixed">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-[#1E293B]/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50"
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Set Your Password
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Create a secure password to activate your university admin account.
            </p>
          </div>

          {/* Error View (Invalid Token or Submit Error) */}
          {(!isValidToken || resetStatus === 'error') && (
            <Alert variant="destructive" className="bg-red-950/30 border-red-900/50 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Action Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Invalid Token Only - Show Back Button */}
          {!isValidToken && !isSubmitting && (
               <div className="text-center mt-4">
                 <Link to="/login">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        Return to Login
                    </Button>
                 </Link>
               </div>
          )}

          {/* Success View */}
          {resetStatus === 'success' ? (
            <div className="text-center py-8 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white">Password Set Successfully!</h3>
                <p className="text-slate-400">
                    Your account is now active. You will be redirected to the login page shortly.
                </p>
                <Link to="/login">
                    <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                        Go to Login Now
                    </Button>
                </Link>
            </div>
          ) : isValidToken && (
            /* Form View */
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                
                {/* Readonly Email */}
                <div>
                  <Label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Account Email</Label>
                  <div className="mt-1 flex items-center px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300 text-sm font-mono">
                    {userEmail || 'Loading...'}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={isSubmitting}
                    className="bg-slate-900 border-slate-700 focus:ring-indigo-500 text-white"
                    placeholder="Enter new password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Minimum 6 characters'
                        }
                    })}
                  />
                  {/* Strength Meter */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`} 
                        style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Strength check</span>
                     <span className={`${strength > 3 ? 'text-emerald-400' : 'text-slate-400'}`}>{getStrengthText()}</span>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={isSubmitting}
                    className="bg-slate-900 border-slate-700 focus:ring-indigo-500 text-white"
                    placeholder="Repeat password"
                    {...register('confirmPassword', {
                        validate: val => val === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
                </div>

              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Set Password & Login"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;