import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const { updatePassword, loading } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newPassword = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { error } = await updatePassword(data.password);
    if (error) {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated. You can now log in.",
      });
      navigate('/login');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Update Password - Petrolord NextGen Suite</title>
        <meta name="description" content="Update your password for your Petrolord NextGen Suite account." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8 p-10 bg-card rounded-lg shadow-lg border border-border"
        >
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-7N6nn.png"
              alt="Petrolord Workflow Suite"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Set a new password
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Please enter your new password.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Label htmlFor="password" className="sr-only">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  {...register('password', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="pt-4">
                <Label htmlFor="confirm-password" className="sr-only">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Confirm New Password"
                  {...register('confirm_password', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                />
                {errors.confirm_password && <p className="mt-2 text-sm text-red-500">{errors.confirm_password.message}</p>}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Password
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default UpdatePasswordPage;