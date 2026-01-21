'use client';

import { auth } from '@/lib/firebase';

/**
 * Force refresh the current user's ID token to get updated custom claims
 * Call this after sign-in or when you suspect custom claims have been updated
 */
export async function refreshUserToken(): Promise<boolean> {
  try {
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      console.error('No user is currently signed in');
      return false;
    }

    // Force token refresh (forceRefresh = true)
    await currentUser.getIdToken(true);
    
    // Verify the token has custom claims
    const tokenResult = await currentUser.getIdTokenResult();
    
    console.log('✅ Token refreshed successfully', {
      uid: currentUser.uid,
      email: currentUser.email,
      claims: {
        role: tokenResult.claims.role,
        tenantId: tokenResult.claims.tenantId,
        tenantName: tokenResult.claims.tenantName,
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    return false;
  }
}

/**
 * Debug function to check current user's token claims
 */
export async function debugTokenClaims(): Promise<void> {
  try {
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      console.log('❌ No user signed in');
      return;
    }

    const tokenResult = await currentUser.getIdTokenResult();
    
    console.log('🔍 Current Token Debug Info:', {
      uid: currentUser.uid,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
      customClaims: tokenResult.claims,
      hasRole: !!tokenResult.claims.role,
      hasTenantId: !!tokenResult.claims.tenantId,
      tokenIssuedAt: new Date(tokenResult.issuedAtTime),
      tokenExpiresAt: new Date(tokenResult.expirationTime),
    });
  } catch (error) {
    console.error('❌ Error checking token:', error);
  }
}
