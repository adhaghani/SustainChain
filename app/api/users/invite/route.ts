/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Invite User API Route
 * Creates invitation record and sends email with registration link
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { db } from '@/lib/firebase-admin';
import { requirePermission } from '@/lib/rbac';
import { getTenantDocument } from '@/lib/firestore-helpers';
import { createAuditLog } from '@/lib/audit-logger';
import { sendInvitationEmail } from '@/lib/email-service';
import type { ApiResponse, UserRole } from '@/types/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import crypto from 'crypto';

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

    // Check if user already exists in Firebase Auth
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

    // Check for existing non-expired invitation
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const existingInvitations = await db
      .collection('tenants')
      .doc(currentUser.tenantId)
      .collection('invitations')
      .where('email', '==', body.email.toLowerCase())
      .where('status', '==', 'pending')
      .where('expiresAt', '>', Timestamp.fromDate(now))
      .limit(1)
      .get();

    if (!existingInvitations.empty) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'An active invitation for this email already exists. Please wait for it to expire or cancel it first.',
          code: 'INVITATION_EXISTS',
        },
        { status: 409 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invitation document
    const invitationRef = db
      .collection('tenants')
      .doc(currentUser.tenantId)
      .collection('invitations')
      .doc();

    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitationData = {
      id: invitationRef.id,
      token,
      email: body.email.toLowerCase(),
      name: body.name,
      phone: body.phone || null,
      role: body.role,
      tenantId: currentUser.tenantId,
      tenantName: tenant.name,
      invitedBy: currentUser.uid,
      invitedByName: currentUser.name,
      invitedByEmail: currentUser.email,
      status: 'pending',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
      acceptedAt: null,
      cancelledAt: null,
      emailSent: false,
      emailProvider: 'resend',
      userId: null,
    };

    await invitationRef.set(invitationData);

    // Send invitation email via Resend
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/accept-invite?token=${token}`;
    
    try {
      await sendInvitationEmail({
        to: body.email,
        name: body.name,
        inviterName: currentUser.name,
        tenantName: tenant.name,
        role: body.role,
        inviteLink,
        expiresAt,
      });

      // Update invitation to mark email as sent
      await invitationRef.update({
        emailSent: true,
        emailSentAt: Timestamp.now(),
      });
    } catch (emailError:any) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the entire request if email fails
      // The invitation is still created and can be resent
    }

    // Create audit log
    await createAuditLog({
      tenantId: currentUser.tenantId,
      userId: currentUser.uid,
      userName: currentUser.name,
      action: 'CREATE',
      resource: 'Invitation',
      resourceId: invitationRef.id,
      details: `Invited user "${body.name}" (${body.email}) with role ${body.role}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'success',
      severity: 'info',
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        invitationId: invitationRef.id,
        email: body.email,
        expiresAt: expiresAt.toISOString(),
      },
      message: 'Invitation sent successfully',
    });
  } catch (error: any) {
    console.error('Invite user error:', error);

    // Log failed attempt
    await createAuditLog({
      tenantId: currentUser.tenantId,
      userId: currentUser.uid,
      userName: currentUser.name,
      action: 'CREATE',
      resource: 'Invitation',
      resourceId: '',
      details: `Failed to invite user: ${error.message}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'failure',
      severity: 'error',
    });

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to send invitation',
        code: 'INVITE_ERROR',
      },
      { status: 500 }
    );
  }
}
