/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// User data interface for easy access to display info
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  tenantId: string | null;
  tenantName: string | null;
  role: 'admin' | 'clerk' | 'viewer' | null;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
  tenantId: string | null;
  role: 'admin' | 'clerk' | 'viewer' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Fetch user document from Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            
            // Extract user data including tenant info
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || firestoreData.name || null,
              photoURL: currentUser.photoURL || firestoreData.avatar || null,
              emailVerified: currentUser.emailVerified,
              tenantId: firestoreData.tenantId || null,
              tenantName: firestoreData.tenantName || null,
              role: firestoreData.role || null,
            });
          } else {
            // Fallback if user document doesn't exist in Firestore yet
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              emailVerified: currentUser.emailVerified,
              tenantId: null,
              tenantName: null,
              role: null,
            });
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
          // Fallback to basic auth data
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            emailVerified: currentUser.emailVerified,
            tenantId: null,
            tenantName: null,
            role: null,
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signOut,
    tenantId: userData?.tenantId || null,
    role: userData?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convenience hook to get just user data
export function useUserData() {
  const { userData } = useAuth();
  return userData;
}
