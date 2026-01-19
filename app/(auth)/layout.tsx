'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If Firebase is not configured, allow access to auth pages
    if (!isFirebaseConfigured || !auth) {
      setIsChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is already logged in, redirect to dashboard
        router.replace('/dashboard');
      } else {
        // User is not logged in, allow access to auth pages
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Don't render auth pages while checking or if user is authenticated
  if (isChecking) {
    return null;
  }

  return (
    <div className="h-screen grid place-items-center">
      {children}
    </div>
  );
}