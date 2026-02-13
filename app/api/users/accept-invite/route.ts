/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Accept Invitation API Route
 * GET: Fetches invitation details by token
 * POST: Accepts invitation and creates user account
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { db } from '@/lib/firebase-admin';
import { createAuditLog } from '@/lib/audit-logger';
import type { ApiResponse, CreateUserData } from '@/types/firestore';
import { Timestamp } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

/**
 * GET /api/users/accept-invite?token={token}
 * Fetches invitation details for display
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Missing invitation token',
        code: 'MISSING_TOKEN',
      },
      { status: 400 }
    );
  }

  try {
    // Find invitation by token
    const invitationsSnapshot = await db
      .collectionGroup('invitations')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (invitationsSnapshot.empty) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid invitation link',
          code: 'INVALID_TOKEN',
        },
        { status: 404 }
      );
    }

    const invitationDoc = invitationsSnapshot.docs[0];
    const invitation = invitationDoc.data();

    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `This invitation has already been ${invitation.status}`,
          code: 'INVITATION_NOT_PENDING',
        },
        { status: 400 }
      );
    }

    // Check if invitation has expired
    const now = Timestamp.now();
    if (invitation.expiresAt.toMillis() < now.toMillis()) {
      // Update status to expired
      await invitationDoc.ref.update({
        status: 'expired',
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'This invitation has expired. Please request a new one.',
          code: 'INVITATION_EXPIRED',
        },
        { status: 400 }
      );
    }

    // Return invitation data
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        phone: invitation.phone,
        role: invitation.role,
        tenantName: invitation.tenantName,
        invitedByName: invitation.invitedByName,
        expiresAt: invitation.expiresAt.toDate().toISOString(),
        status: invitation.status,
      },
    });
  } catch (error: any) {
    console.error('Error fetching invitation:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch invitation',
        code: 'FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/accept-invite
 * Accepts invitation and creates user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validation
    if (!token || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing required fields',
          code: 'MISSING_FIELDS',
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Password must be at least 8 characters long',
          code: 'INVALID_PASSWORD',
        },
        { status: 400 }
      );
    }

    // Find invitation by token
    const invitationsSnapshot = await db
      .collectionGroup('invitations')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (invitationsSnapshot.empty) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid invitation link',
          code: 'INVALID_TOKEN',
        },
        { status: 404 }
      );
    }

    const invitationDoc = invitationsSnapshot.docs[0];
    const invitation = invitationDoc.data();

    // Validate invitation status
    if (invitation.status !== 'pending') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `This invitation has already been ${invitation.status}`,
          code: 'INVITATION_NOT_PENDING',
        },
        { status: 400 }
      );
    }

    // Check expiration
    const now = Timestamp.now();
    if (invitation.expiresAt.toMillis() < now.toMillis()) {
      await invitationDoc.ref.update({ status: 'expired' });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'This invitation has expired',
          code: 'INVITATION_EXPIRED',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await auth().getUserByEmail(invitation.email);
      if (existingUser) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'An account with this email already exists',
            code: 'EMAIL_EXISTS',
          },
          { status: 409 }
        );
      }
    } catch (error: any) {
      // User doesn't exist, continue
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create Firebase Auth user
    const newUser = await auth().createUser({
      email: invitation.email,
      password: password,
      displayName: invitation.name,
      emailVerified: false,
    });

    // Set custom claims
    await auth().setCustomUserClaims(newUser.uid, {
      role: invitation.role,
      tenantId: invitation.tenantId,
      tenantName: invitation.tenantName,
    });

    // Create user document in Firestore
    const userData: CreateUserData = {
      email: invitation.email,
      name: invitation.name,
      phone: invitation.phone,
      tenantId: invitation.tenantId,
      tenantName: invitation.tenantName,
      role: invitation.role,
      pdpaConsentGiven: false, // Will be set on first login
    };

    await db
      .collection('users')
      .doc(newUser.uid)
      .set({
        id: newUser.uid,
        email: userData.email,
        name: userData.name,
        phone: userData.phone || null,
        avatar: null,
        tenantId: userData.tenantId,
        tenantName: userData.tenantName,
        role: userData.role,
        status: 'active',
        lastLogin: null,
        lastActivity: Timestamp.now(),
        entriesCreated: 0,
        reportsGenerated: 0,
        onboardingCompleted: false,
        onboardingStep: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        pdpaConsentGiven: userData.pdpaConsentGiven,
        pdpaConsentDate: null,
      });

    // Update invitation status
    await invitationDoc.ref.update({
      status: 'accepted',
      acceptedAt: Timestamp.now(),
      userId: newUser.uid,
    });

    // Create audit log
    await createAuditLog({
      tenantId: invitation.tenantId,
      userId: newUser.uid,
      userName: invitation.name,
      action: 'CREATE',
      resource: 'User',
      resourceId: newUser.uid,
      details: `User accepted invitation and created account with role ${invitation.role}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'success',
      severity: 'info',
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        userId: newUser.uid,
        email: invitation.email,
      },
    });
  } catch (error: any) {
    console.error('Error accepting invitation:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to accept invitation',
        code: 'ACCEPT_ERROR',
      },
      { status: 500 }
    );
  }
}
