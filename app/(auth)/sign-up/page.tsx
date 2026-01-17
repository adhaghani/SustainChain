'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, Building2, Loader2, AlertCircle, Leaf } from 'lucide-react';
import { 
  IconBrandGoogle, 
  IconBrandLinkedin,
  IconShieldCheck,
  IconCheck
} from '@tabler/icons-react';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase is not configured. Please set up environment variables.');
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      router.push('/dashboard/onboarding');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase is not configured. Please set up environment variables.');
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard/onboarding');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up with Google.'
      );
    } finally {
      setLoading(false);
    }
  };


  const handleLinkedInSignUp = async () => {
    setError('LinkedIn SSO integration coming soon');
    setTimeout(() => setError(''), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">SustainChain</span>
        </Link>

        <Card className="border-white/10 bg-slate-900/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Create your account</CardTitle>
            <CardDescription className="text-slate-400">
              Join Malaysian SMEs achieving ESG compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Benefits */}
            <div className="grid gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h3 className="font-semibold text-emerald-200 text-sm">What you&apos;ll get:</h3>
              <div className="grid gap-2">
                {[
                  'AI-powered bill extraction (90%+ accuracy)',
                  '14-day free trial with all Premium features',
                  'Sector benchmarking against 1000+ companies',
                  'Professional ESG reports for stakeholders'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-emerald-200">
                    <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Sign Up Options */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                <IconBrandGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
              
              <div className="grid grid-cols-2 gap-3">

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLinkedInSignUp}
                  disabled={loading}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                >
                  <IconBrandLinkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <div className="relative">
              <Separator className="bg-slate-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase">Or</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ahmad Rahman"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-300">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Syarikat ABC Sdn Bhd"
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms" 
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 leading-relaxed">
                  I agree to the{' '}
                  <Link href="#" className="text-emerald-400 hover:text-emerald-300">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="text-emerald-400 hover:text-emerald-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading || !agreeToTerms}
                className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-2.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <IconShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-xs text-blue-200">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          Protected by PDPA • Data encrypted with AES-256 • ISO 27001 certified
        </p>
      </div>
    </div>
  );
}
        