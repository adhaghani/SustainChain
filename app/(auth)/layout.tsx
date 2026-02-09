/* eslint-disable react-hooks/set-state-in-effect */
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
    if (!isFirebaseConfigured || !auth) {
      setIsChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.replace('/dashboard');
      } else {
        setIsChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);
  if (isChecking) {
    return null;
  }

  return (
    <div className="h-screen grid place-items-center">
      {children}
    </div>
  );
}