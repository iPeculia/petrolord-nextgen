import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  Mail, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // View State: 'detecting' | 'request-link' | 'reset-password'
  const [mode, setMode] = useState('detecting'); 
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Password Strength
  const [strengthScore, setStrengthScore] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  // Initialization: Check Session & Params
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const paramEmail = searchParams.get('email');

        if (session) {
          // User is authenticated (clicked magic link)
          setMode('reset-password');
          setEmail(session.user.email || paramEmail || '');
        } else {
          // No session - User needs to request a link
          setMode('request-link');
          if (paramEmail) setEmail(paramEmail);
        }
      } catch (err) {
        console.error("Session check failed", err);
        setMode('request-link');
      }
    };

    checkSession();
  }, [searchParams]);

  // Password Analysis
  useEffect(() => {
    const reqs = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    setRequirements(reqs);
    
    const metCount = Object.values(reqs).filter(Boolean).length;
    setStrengthScore((metCount / 5) * 100);
  }, [password]);

  // Countdown for redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
  }, [success, countdown, navigate]);

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
        className: "bg-blue-600 text-white"
      });
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (strengthScore < 60) { // Require at least 3/5 requirements
      setError("Password is too weak. Please meet more requirements.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Success!",
        description: "Password updated successfully.",
        className: "bg-emerald-600 text-white"
      });
    } catch (err) {
      setError(err.message || "Failed to update password. Your session may have expired.");
      if (err.message.includes("session")) {
        setMode('request-link'); // Fallback if session died
      }
    } finally {
      setLoading(false);
    }
  };

  const StrengthItem = ({ met, label }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${met ? 'text-emerald-400' : 'text-slate-500'}`}>
      {met ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
      <span>{label}</span>
    </div>
  );

  if (mode === 'detecting') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Brand Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 shadow-xl shadow-blue-900/20 mb-2">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Petrolord NextGen</h1>
          <p className="text-slate-400 font-medium">
            {mode === 'request-link' ? 'Account Recovery' : 'Secure Password Reset'}
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Progress Bar (Visual indicator of steps) */}
          <div className="w-full bg-slate-800 h-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: mode === 'request-link' ? '50%' : '100%' }}
            />
          </div>

          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              {success ? (
                <span className="text-emerald-400">Success</span>
              ) : mode === 'request-link' ? (
                <>Step 1: Identify Account</>
              ) : (
                <>Step 2: Create New Password</>
              )}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {success 
                ? (mode === 'request-link' ? "Email sent successfully." : "Password updated successfully.")
                : (mode === 'request-link' ? "Enter your email to receive a secure reset link." : "Please enter a strong password to secure your account.")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-950/30 border-red-900/50 text-red-200 animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {mode === 'request-link' ? 'Reset Link Sent' : 'Password Reset Complete'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                    {mode === 'request-link' 
                      ? `We've sent a link to ${email}. Please check your inbox and spam folder.`
                      : `You will be redirected to the login page in ${countdown} seconds.`}
                  </p>
                </div>
                {mode === 'reset-password' && (
                  <Button onClick={() => navigate('/login')} className="bg-emerald-600 hover:bg-emerald-500 text-white w-full">
                    Go to Login Now
                  </Button>
                )}
              </div>
            ) : (
              /* Forms Container */
              <div className="space-y-4">
                {/* Email Field - Always Visible but state changes */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={mode === 'reset-password'}
                      disabled={loading || mode === 'reset-password'}
                      placeholder="name@university.edu"
                      className={`pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 
                        ${mode === 'reset-password' ? 'opacity-70 cursor-not-allowed border-transparent ring-0' : 'focus:border-blue-500 focus:ring-blue-500/20'}`}
                    />
                    {mode === 'reset-password' && (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                </div>

                {/* Password Fields - Only visible in reset mode */}
                {mode === 'reset-password' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300">New Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Strength</span>
                          <span>{Math.round(strengthScore)}%</span>
                        </div>
                        <Progress value={strengthScore} className={`h-1.5 ${
                          strengthScore < 40 ? "bg-slate-800 [&>div]:bg-red-500" :
                          strengthScore < 80 ? "bg-slate-800 [&>div]:bg-yellow-500" :
                          "bg-slate-800 [&>div]:bg-emerald-500"
                        }`} />
                        <div className="grid grid-cols-2 gap-y-1 gap-x-4 pt-1">
                          <StrengthItem met={requirements.length} label="8+ Characters" />
                          <StrengthItem met={requirements.upper} label="Uppercase" />
                          <StrengthItem met={requirements.lower} label="Lowercase" />
                          <StrengthItem met={requirements.number} label="Number" />
                          <StrengthItem met={requirements.special} label="Special Char" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="text-slate-300">Confirm Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`pl-10 pr-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-blue-500/20 
                            ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                          placeholder="Re-enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-400 animate-in slide-in-from-top-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="pt-4">
                  {mode === 'request-link' ? (
                    <Button 
                      onClick={handleRequestLink}
                      disabled={loading || !email}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                      Send Reset Link
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleUpdatePassword}
                      disabled={loading || !password || !confirmPassword || password !== confirmPassword || strengthScore < 60}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02]"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Update Password
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="bg-slate-950/30 border-t border-slate-800 py-4 flex flex-col gap-2">
            {mode === 'reset-password' && !success && (
               <button 
               onClick={() => {
                 setMode('request-link');
                 setPassword('');
                 setConfirmPassword('');
                 setError('');
               }}
               className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
             >
               <ArrowLeft className="w-3 h-3" />
               Not {email}? Request a new link
             </button>
            )}
            
            <button 
              onClick={() => navigate('/login')}
              className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              Back to Login
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetPage;