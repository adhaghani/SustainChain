'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { 
  IconBrandGoogle, 
} from '@tabler/icons-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from '@/lib/utils';
import { translations } from '@/lib/i18n';


export default function LoginForm(){
  const [lang, setLang] = useState<"en" | "bm">("en");
  const t = translations[lang];

  const toggleLang = () => {
    setLang(lang === "en" ? "bm" : "en");
  };


      const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        throw new Error(t.auth.errors.firebaseNotConfigured);
      }
      
      // Step 1: Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 2: Get ID token and call backend to set custom claims
      const idToken = await userCredential.user.getIdToken();
      
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t.auth.errors.signInFailed);
      }
      
      // Step 3: Force token refresh to get new custom claims
      await userCredential.user.getIdToken(true);
      
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.auth.errors.signInFailed
      );
    } finally {
      setLoading(false);
    }
  };
  const handleLinkedInSignIn = async () => {
    setError(t.auth.errors.linkedinComingSoon);
    setTimeout(() => setError(''), 3000);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        throw new Error(t.auth.errors.firebaseNotConfigured);
      }
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get ID token and call backend to set custom claims
      const idToken = await userCredential.user.getIdToken();
      
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t.auth.errors.signInFailed);
      }
      
      // Force token refresh to get new custom claims
      await userCredential.user.getIdToken(true);
      
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.auth.errors.googleSignInFailed
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
          className="border-white/10 text-gray-400 font-medium cursor-pointer hover:bg-white/5 transition-colors"
          onClick={toggleLang}
        >
          <span className={lang === "en" ? "text-white" : ""}>EN</span> / <span className={lang === "bm" ? "text-white" : ""}>BM</span>
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.auth.signIn.title}</CardTitle>
          <CardDescription>
            {t.auth.signIn.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleEmailSignIn}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t.auth.signIn.emailLabel}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.signIn.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>
              <Field>
             
                  <FieldLabel htmlFor="password">{t.auth.signIn.passwordLabel}</FieldLabel>

                
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required 
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.auth.signIn.loggingIn}
                    </>
                  ) : (
                    t.auth.signIn.loginButton
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full"
                >
                  <IconBrandGoogle className="mr-2 h-4 w-4" />
                  {t.auth.signIn.googleButton}
                </Button>
                <FieldDescription className="text-center">
                  {t.auth.signIn.noAccount}{' '}
                  <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
                    {t.auth.signIn.signUpLink}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
