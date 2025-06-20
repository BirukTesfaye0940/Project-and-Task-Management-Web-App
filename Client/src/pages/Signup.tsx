import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

import { signupUser, clearError } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import axios from 'axios'; // Import axios

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook
  const { loading, error, user } = useAppSelector((state) => state.auth);

  // Parse query params only once
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get("redirect");
  const token = queryParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const acceptTerms = watch('acceptTerms');

  // Effect to handle redirection AFTER successful signup
  useEffect(() => {
    if (user) { // Check if a user is successfully authenticated (signed up)
      toast.success('Account Created Successfully!', {
        description: 'Welcome to ProcrastiNOT! Your account has been created.',
      });

      // If user signed up and there's an invite token, accept it
      if (redirect === "accept-invite" && token) {
        const acceptInvitation = async () => {
          try {
            await axios.post(
              `http://localhost:5003/api/invite/accept/${token}`,
              {},
              { withCredentials: true }
            );
            toast.success("Invitation accepted!", {
              description: "You have successfully joined the project.",
            });
            navigate("/dashboard", { replace: true }); // Use replace
          } catch (err: any) {
            console.error("Failed to accept invitation:", err);
            toast.error("Invitation Error", {
              description:
                err.response?.data?.message ||
                "Failed to accept invitation. It might be invalid or expired.",
            });
            // Still navigate to dashboard even if invite failed
            navigate("/dashboard", { replace: true });
          }
        };
        acceptInvitation();
      } else {
        // Regular successful signup, no invite token, go to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate, redirect, token]); // Add redirect and token to dependencies

  useEffect(() => {
    if (error) {
      toast.error('Sign Up Failed', {
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Exclude confirmPassword and acceptTerms as they are only for client-side validation
      const { 
        //confirmPassword, acceptTerms,
         ...signupData } = data;
      // signupUser action should handle creating the user and then logging them in,
      // which will update the 'user' state in Redux.
      await dispatch(signupUser(signupData)).unwrap();
      // The useEffect will handle navigation after 'user' state is updated
    } catch (err) {
      // Error handling for signup is done in the useEffect above
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProcrastiNOT
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600">Join thousands of teams using ProcrastiNOT</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-900">Sign Up</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
                  className="border-gray-300"
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                >
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6"
              >
                {loading || isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          By creating an account, you're joining thousands of teams who trust ProcrastiNOT with their projects.
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;