/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Invite User API Route
 * Sends invitation email and creates pending user account
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { requirePermission } from '@/lib/rbac';
import { createUserDocument, getTenantDocument } from '@/lib/firestore-helpers';
import { createAuditLog } from '@/lib/audit-logger';
import type { ApiResponse, UserRole, CreateUserData } from '@/types/firestore';

export const runtime = 'nodejs';

interface InviteUserRequest {
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export async function POST(request: NextRequest) {
  // Check permission
  const authResult = await requirePermission(request, 'CREATE_USERS');
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const { user: currentUser } = authResult;

  try {
    const body: InviteUserRequest = await request.json();

    // Validation
    if (!body.email || !body.name || !body.role) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing required fields',
          code: 'MISSING_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'clerk', 'viewer'].includes(body.role)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid role',
          code: 'INVALID_ROLE',
        },
        { status: 400 }
      );
    }

    // Get tenant info
    const tenant = await getTenantDocument(currentUser.tenantId);
    if (!tenant) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await auth().getUserByEmail(body.email);
      if (existingUser) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'A user with this email already exists',
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

    // Generate random password (user will reset on first login)
    const temporaryPassword = `Temp${Math.random().toString(36).slice(-8)}!`;

    // Create Firebase Auth user
    const newUser = await auth().createUser({
      email: body.email,
      password: temporaryPassword,
      displayName: body.name,
      emailVerified: false,
    });

    // Create user document
    const userData: CreateUserData = {
      email: body.email,
      name: body.name,
      phone: body.phone,
      tenantId: currentUser.tenantId,
      tenantName: tenant.name,
      role: body.role,
      pdpaConsentGiven: false, // Will be set on first login
    };

    const userDoc = await createUserDocument(newUser.uid, userData);

    // Set custom claims
    await auth().setCustomUserClaims(newUser.uid, {
      role: body.role,
      tenantId: currentUser.tenantId,
      tenantName: tenant.name,
    });

    // Create audit log
    await createAuditLog({
      tenantId: currentUser.tenantId,
      userId: currentUser.uid,
      userName: 'Admin',
      action: 'CREATE',
      resource: 'User',
      resourceId: newUser.uid,
      details: `Invited user "${body.name}" (${body.email}) with role ${body.role}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'success',
      severity: 'info',
    });

    // TODO: Send invitation email with temporary password
    // await sendInvitationEmail(body.email, body.name, temporaryPassword, tenant.name);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        userId: newUser.uid,
        email: body.email,
        temporaryPassword, // Return for now, remove in production
      },
    });
  } catch (error: any) {
    console.error('Invite user error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to invite user',
        code: 'INVITE_ERROR',
      },
      { status: 500 }
    );
  }
}
