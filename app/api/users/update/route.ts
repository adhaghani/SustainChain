/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Update User API Route
 * Updates user role and status
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/rbac';
import { updateUserRole, getUserDocument } from '@/lib/firestore-helpers';
import { updateUserRoleWithClaims } from '@/lib/rbac';
import { createAuditLog } from '@/lib/audit-logger';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { ApiResponse, UserRole, UserStatus } from '@/types/firestore';

export const runtime = 'nodejs';

interface UpdateUserRequest {
  userId: string;
  role?: UserRole;
  status?: UserStatus;
}

export async function PATCH(request: NextRequest) {
  // Check permission
  const authResult = await requirePermission(request, 'UPDATE_USERS');
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const { user: currentUser } = authResult;

  try {
    const body: UpdateUserRequest = await request.json();

    if (!body.userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing userId',
          code: 'MISSING_USER_ID',
        },
        { status: 400 }
      );
    }

    // Get target user
    const targetUser = await getUserDocument(body.userId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check tenant access
    if (targetUser.tenantId !== currentUser.tenantId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Cannot update users from other tenants',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Update role if provided
    if (body.role && body.role !== targetUser.role) {
      await updateUserRole(body.userId, body.role);
      await updateUserRoleWithClaims(body.userId, body.role);

      await createAuditLog({
        tenantId: currentUser.tenantId,
        userId: currentUser.uid,
        userName: 'Admin',
        action: 'UPDATE',
        resource: 'User',
        resourceId: body.userId,
        details: `Changed role of "${targetUser.name}" from ${targetUser.role} to ${body.role}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'success',
        severity: 'info',
        changeLog: [{
          fieldName: 'role',
          oldValue: targetUser.role,
          newValue: body.role,
        }],
      });
    }

    // Update status if provided
    if (body.status && body.status !== targetUser.status) {
      await db.collection('users').doc(body.userId).update({
        status: body.status,
        updatedAt: Timestamp.now(),
      });

      await createAuditLog({
        tenantId: currentUser.tenantId,
        userId: currentUser.uid,
        userName: 'Admin',
        action: 'UPDATE',
        resource: 'User',
        resourceId: body.userId,
        details: `Changed status of "${targetUser.name}" from ${targetUser.status} to ${body.status}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'success',
        severity: body.status === 'inactive' ? 'warning' : 'info',
        changeLog: [{
          fieldName: 'status',
          oldValue: targetUser.status,
          newValue: body.status,
        }],
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'User updated successfully' },
    });
  } catch (error: any) {
    console.error('Update user error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to update user',
        code: 'UPDATE_ERROR',
      },
      { status: 500 }
    );
  }
}
