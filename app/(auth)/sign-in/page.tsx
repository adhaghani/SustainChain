'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2, AlertCircle, Leaf } from 'lucide-react';
import { 
  IconBrandGoogle, 
  IconBrandLinkedin,
  IconShieldCheck 
} from '@tabler/icons-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from '@/lib/utils';


export default function LoginForm(){


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
        throw new Error('Firebase is not configured. Please set up environment variables.');
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  const handleLinkedInSignIn = async () => {
    setError('LinkedIn SSO integration coming soon');
    setTimeout(() => setError(''), 3000);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase is not configured. Please set up environment variables.');
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign in with Google.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>
              <Field>
             
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                
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
                      Logging in...
                    </>
                  ) : (
                    'Login'
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
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
                    Sign up
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
