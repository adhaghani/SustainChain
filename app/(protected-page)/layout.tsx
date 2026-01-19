'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { AuthProvider } from '@/lib/auth-context';

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

  // Only render children when authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}