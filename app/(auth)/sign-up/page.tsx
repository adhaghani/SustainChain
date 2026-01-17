'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Building2, Loader2, AlertCircle, Leaf, Hash, MapPin } from 'lucide-react';
import { 
  IconBrandGoogle, 
  IconBrandLinkedin,
  IconShieldCheck,
  IconCheck
} from '@tabler/icons-react';
import type { CompanySector } from '@/types/firestore';

const SECTORS: { value: CompanySector; label: string }[] = [
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Other', label: 'Other' },
];

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    uen: '',
    sector: '' as CompanySector | '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    
    // Admin User Info
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSectorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sector: value as CompanySector }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.companyName || !formData.uen || !formData.sector || !formData.address ||
        !formData.adminName || !formData.adminEmail || !formData.adminPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.adminPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!pdpaConsent) {
      setError('Please agree to the PDPA and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      // Call tenant registration API
      const response = await fetch('/api/auth/register-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          uen: formData.uen,
          sector: formData.sector,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPhone: formData.adminPhone,
          adminPassword: formData.adminPassword,
          pdpaConsent: pdpaConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Sign in the user
      if (!auth) {
        throw new Error('Firebase is not configured');
      }

      await signInWithEmailAndPassword(auth, formData.adminEmail, formData.adminPassword);

      // Redirect to onboarding
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
    setError('Google SSO integration coming soon - this will require company UEN verification');
    setTimeout(() => setError(''), 5000);
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
              {/* Company Information */}
              <div className="space-y-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200">Company Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-slate-300">
                      Company Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Syarikat ABC Sdn Bhd"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uen" className="text-slate-300">
                      UEN / ROC Number *
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="uen"
                        name="uen"
                        type="text"
                        placeholder="ROC123456"
                        value={formData.uen}
                        onChange={handleChange}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector" className="text-slate-300">
                    Industry Sector *
                  </Label>
                  <Select value={formData.sector} onValueChange={handleSectorChange}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value} className="text-white hover:bg-slate-800">
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-300">
                    Business Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Jalan Example"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-300">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Kuala Lumpur"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-300">State</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Selangor"
                      value={formData.state}
                      onChange={handleChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-slate-300">Postcode</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      placeholder="50000"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Admin User Information */}
              <div className="space-y-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200">Admin Account</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName" className="text-slate-300">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="adminName"
                        name="adminName"
                        type="text"
                        placeholder="Ahmad Rahman"
                        value={formData.adminName}
                        onChange={handleChange}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPhone" className="text-slate-300">
                      Phone Number
                    </Label>
                    <Input
                      id="adminPhone"
                      name="adminPhone"
                      type="tel"
                      placeholder="+60123456789"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-slate-300">
                    Work Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="text-slate-300">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="adminPassword"
                        name="adminPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">
                      Confirm Password *
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
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PDPA Consent */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Checkbox 
                  id="pdpa" 
                  checked={pdpaConsent}
                  onCheckedChange={(checked) => setPdpaConsent(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="pdpa" className="text-sm text-amber-200 leading-relaxed">
                  I consent to the collection, use, and disclosure of my personal data in accordance with the{' '}
                  <Link href="#" className="text-amber-400 hover:text-amber-300 underline">
                    Personal Data Protection Act (PDPA) 2010
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="text-amber-400 hover:text-amber-300 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading || !pdpaConsent}
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
        