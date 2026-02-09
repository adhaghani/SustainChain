'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Building2, Loader2, AlertCircle, Hash, MapPin } from 'lucide-react';
import type { CompanySector } from '@/types/firestore';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/i18n';

export default function SignUpPage() {
  const [lang, setLang] = useState<"en" | "bm">("en");
  const t = translations[lang];

  const toggleLang = () => {
    setLang(lang === "en" ? "bm" : "en");
  };

  const SECTORS: { value: CompanySector; label: string }[] = [
    { value: 'Manufacturing', label: t.auth.sectors.manufacturing },
    { value: 'Technology', label: t.auth.sectors.technology },
    { value: 'Food & Beverage', label: t.auth.sectors.foodBeverage },
    { value: 'Logistics', label: t.auth.sectors.logistics },
    { value: 'Retail', label: t.auth.sectors.retail },
    { value: 'Agriculture', label: t.auth.sectors.agriculture },
    { value: 'Construction', label: t.auth.sectors.construction },
    { value: 'Healthcare', label: t.auth.sectors.healthcare },
    { value: 'Education', label: t.auth.sectors.education },
    { value: 'Hospitality', label: t.auth.sectors.hospitality },
    { value: 'Other', label: t.auth.sectors.other },
  ];
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
          setError(t.auth.errors.fillRequired);
          return false;
        }
        return true;
      
      case 2: // Admin Account
        if (!formData.adminName || !formData.adminEmail) {
          setError(t.auth.errors.fillRequired);
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.adminEmail)) {
          setError(t.auth.errors.validEmail);
          return false;
        }
        return true;
      
      case 3: // Password & Consent
        if (!formData.adminPassword || !formData.confirmPassword) {
          setError(t.auth.errors.fillRequired);
          return false;
        }
        if (formData.adminPassword !== formData.confirmPassword) {
          setError(t.auth.errors.passwordMismatch);
          return false;
        }
        if (formData.adminPassword.length < 6) {
          setError(t.auth.errors.passwordLength);
          return false;
        }
        if (!pdpaConsent) {
          setError(t.auth.errors.agreeTerms);
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
        throw new Error(data.error || t.auth.errors.registrationFailed);
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
      <div className="flex justify-end">
        <Badge 
          variant="outline" 
          className="border text-gray-400 font-medium cursor-pointer hover:bg-white/5 transition-colors"
          onClick={toggleLang}
        >
          <span className={lang === "en" ? "text-primary" : ""}>EN</span> / <span className={lang === "bm" ? "text-primary" : ""}>BM</span>
        </Badge>
      </div>
      <Card>
          <CardHeader className="text-center">
            <CardTitle>{t.auth.signUp.title}</CardTitle>
          <CardDescription>
            {t.auth.signUp.stepIndicator.replace('{currentStep}', currentStep.toString()).replace('{totalSteps}', totalSteps.toString())} {
              currentStep === 1 ? t.auth.signUp.steps.company :
              currentStep === 2 ? t.auth.signUp.steps.admin :
              t.auth.signUp.steps.password
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
                  <h3 className="text-sm font-semibold">{t.auth.signUp.companyInfo.title}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">{t.auth.signUp.companyInfo.companyName}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          placeholder={t.auth.signUp.companyInfo.companyPlaceholder}
                          value={formData.companyName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="uen">{t.auth.signUp.companyInfo.uen}</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="uen"
                          name="uen"
                          type="text"
                          placeholder={t.auth.signUp.companyInfo.uenPlaceholder}
                          value={formData.uen}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sector">{t.auth.signUp.companyInfo.sector}</Label>
                    <Select value={formData.sector} onValueChange={handleSectorChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t.auth.signUp.companyInfo.sectorPlaceholder} />
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
                    <Label htmlFor="address">{t.auth.signUp.companyInfo.address}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder={t.auth.signUp.companyInfo.addressPlaceholder}
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">{t.auth.signUp.companyInfo.city}</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder={t.auth.signUp.companyInfo.cityPlaceholder}
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">{t.auth.signUp.companyInfo.state}</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        placeholder={t.auth.signUp.companyInfo.statePlaceholder}
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postalCode">{t.auth.signUp.companyInfo.postcode}</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        placeholder={t.auth.signUp.companyInfo.postcodePlaceholder}
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
                  <h3 className="text-sm font-semibold">{t.auth.signUp.adminAccount.title}</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adminName">{t.auth.signUp.adminAccount.fullName}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="adminName"
                          name="adminName"
                          type="text"
                          placeholder={t.auth.signUp.adminAccount.namePlaceholder}
                          value={formData.adminName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="adminEmail">{t.auth.signUp.adminAccount.workEmail}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="adminEmail"
                          name="adminEmail"
                          type="email"
                          placeholder={t.auth.signUp.adminAccount.emailPlaceholder}
                          value={formData.adminEmail}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="adminPhone">{t.auth.signUp.adminAccount.phone}</Label>
                      <Input
                        id="adminPhone"
                        name="adminPhone"
                        type="tel"
                        placeholder={t.auth.signUp.adminAccount.phonePlaceholder}
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
                  <h3 className="text-sm font-semibold">{t.auth.signUp.password.title}</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adminPassword">{t.auth.signUp.password.password}</Label>
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
                      <p className="text-xs text-muted-foreground">{t.auth.signUp.password.passwordHint}</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">{t.auth.signUp.password.confirmPassword}</Label>
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
                        {t.auth.signUp.password.agreeTo}{' '}
                        <Link href="#" className="underline underline-offset-4 hover:text-primary">
                          {t.auth.signUp.password.termsOfService}
                        </Link>
                        {' '}{t.auth.signUp.password.and}{' '}
                        <Link href="#" className="underline underline-offset-4 hover:text-primary">
                          {t.auth.signUp.password.privacyPolicy}
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
                    {t.auth.signUp.buttons.back}
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    {t.auth.signUp.buttons.next}
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
                        {t.auth.signUp.buttons.creating}
                      </>
                    ) : (
                      t.auth.signUp.buttons.createAccount
                    )}
                  </Button>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {t.auth.signUp.haveAccount}{' '}
              <Link
                href="/sign-in"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t.auth.signUp.signInLink}
              </Link>
            </p>
          </CardContent>
        </Card>
      
    </div>
  );
}
        