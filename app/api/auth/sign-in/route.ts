/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * User Sign-In API Route
 * Handles login and updates lastLogin timestamp + custom claims refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { getUserDocument, updateUserLastLogin } from '@/lib/firestore-helpers';
import { logUserLogin } from '@/lib/audit-logger';
import type { ApiResponse } from '@/types/firestore';

export const runtime = 'nodejs';

interface SignInRequest {
  idToken: string; // Firebase ID token from client
}

export async function POST(request: NextRequest) {
  try {
    const body: SignInRequest = await request.json();

    if (!body.idToken) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing ID token',
          code: 'MISSING_TOKEN',
        },
        { status: 400 }
      );
    }

    // Verify ID token
    const decodedToken = await auth().verifyIdToken(body.idToken);
    const userId = decodedToken.uid;

    // Get user document
    const userDoc = await getUserDocument(userId);

    if (!userDoc) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if user is inactive
    if (userDoc.status === 'inactive') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Account is inactive. Please contact your administrator.',
          code: 'ACCOUNT_INACTIVE',
        },
        { status: 403 }
      );
    }

    // Update last login timestamp
    await updateUserLastLogin(userId);

    // Refresh custom claims (in case role changed)
    await auth().setCustomUserClaims(userId, {
      role: userDoc.role,
      tenantId: userDoc.tenantId,
      tenantName: userDoc.tenantName,
    });

    // Create audit log
    await logUserLogin(
      userDoc.tenantId,
      userId,
      userDoc.name,
      userDoc.email,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: userDoc.id,
          name: userDoc.name,
          email: userDoc.email,
          role: userDoc.role,
          tenantId: userDoc.tenantId,
          tenantName: userDoc.tenantName,
        },
      },
    });
  } catch (error: any) {
    console.error('Sign-in error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Sign-in failed',
        code: 'SIGN_IN_ERROR',
      },
      { status: 500 }
    );
  }
}
