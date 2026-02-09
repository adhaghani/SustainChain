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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Building2, Loader2, AlertCircle, Hash, MapPin } from 'lucide-react';
import type { CompanySector } from '@/types/firestore';
import { cn } from '@/lib/utils';

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
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSectorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sector: value as CompanySector }));
  };

  const validateStep = (step: number): boolean => {
    setError('');
    
    switch (step) {
      case 1: // Company Information
        if (!formData.companyName || !formData.uen || !formData.sector || !formData.address) {
          setError('Please fill in all required company information fields');
          return false;
        }
        return true;
      
      case 2: // Admin Account
        if (!formData.adminName || !formData.adminEmail) {
          setError('Please fill in all required admin account fields');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.adminEmail)) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;
      
      case 3: // Password & Consent
        if (!formData.adminPassword || !formData.confirmPassword) {
          setError('Please fill in all password fields');
          return false;
        }
        if (formData.adminPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.adminPassword.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (!pdpaConsent) {
          setError('Please agree to the Terms of Service and Privacy Policy');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
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

      const userCredential = await signInWithEmailAndPassword(auth, formData.adminEmail, formData.adminPassword);
      
      // Force token refresh to ensure custom claims are loaded
      await userCredential.user.getIdToken(true);

      // Redirect to onboarding
      router.push('/onboarding');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-6")}>
      <Card>
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Company Information' :
              currentStep === 2 ? 'Admin Account' :
              'Password & Agreement'
            }
          </CardDescription>
          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  step <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

            <form onSubmit={handleEmailSignUp} className="grid gap-4">
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div className="grid gap-4">
                  <h3 className="text-sm font-semibold">Company Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          placeholder="Syarikat ABC Sdn Bhd"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="uen">UEN / ROC Number *</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="uen"
                          name="uen"
                          type="text"
                          placeholder="ROC123456"
                          value={formData.uen}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sector">Industry Sector *</Label>
                    <Select value={formData.sector} onValueChange={handleSectorChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector.value} value={sector.value}>
                            {sector.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="123 Jalan Example"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Kuala Lumpur"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Selangor"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postalCode">Postcode</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        placeholder="50000"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Admin Account Information */}
              {currentStep === 2 && (
                <div className="grid gap-4">
                  <h3 className="text-sm font-semibold">Admin Account</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adminName">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="adminName"
                          name="adminName"
                          type="text"
                          placeholder="Ahmad Rahman"
                          value={formData.adminName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="adminEmail">Work Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="adminEmail"
                          name="adminEmail"
                          type="email"
                          placeholder="you@company.com"
                          value={formData.adminEmail}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="adminPhone">Phone Number</Label>
                      <Input
                        id="adminPhone"
                        name="adminPhone"
                        type="tel"
                        placeholder="+60123456789"
                        value={formData.adminPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Password & Consent */}
              {currentStep === 3 && (
                <div className="grid gap-4">
                  <h3 className="text-sm font-semibold">Secure Your Account</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adminPassword">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="adminPassword"
                          name="adminPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.adminPassword}
                          onChange={handleChange}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox 
                        id="pdpa" 
                        checked={pdpaConsent}
                        onCheckedChange={(checked) => setPdpaConsent(checked as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="pdpa" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I agree to the{' '}
                        <Link href="#" className="underline underline-offset-4 hover:text-primary">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="#" className="underline underline-offset-4 hover:text-primary">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
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
                )}
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      
    </div>
  );
}
        