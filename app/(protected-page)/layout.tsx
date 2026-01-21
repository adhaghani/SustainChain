'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { AuthProvider } from '@/lib/auth-context';
import { Spinner } from '@/components/ui/spinner';
import { DebugTokenButton } from '@/components/debug-token-button';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      router.replace('/sign-in');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        router.replace('/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if(!isAuthenticated){
    return <div className='flex items-center justify-center h-screen'><Spinner /></div>;
  }


  return (
    <AuthProvider>
      {children}
      <DebugTokenButton />
    </AuthProvider>
  );
}