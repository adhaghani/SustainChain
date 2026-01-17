/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Delete User API Route
 * Deletes a user from Firebase Auth and Firestore
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { requirePermission } from '@/lib/rbac';
import { getUserDocument } from '@/lib/firestore-helpers';
import { createAuditLog } from '@/lib/audit-logger';
import { db } from '@/lib/firebase-admin';
import type { ApiResponse } from '@/types/firestore';

export const runtime = 'nodejs';

interface DeleteUserRequest {
  userId: string;
}

export async function DELETE(request: NextRequest) {
  // Check permission
  const authResult = await requirePermission(request, 'DELETE_USERS');
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const { user: currentUser } = authResult;

  try {
    const body: DeleteUserRequest = await request.json();

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

    // Prevent self-deletion
    if (body.userId === currentUser.uid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Cannot delete your own account',
          code: 'CANNOT_DELETE_SELF',
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
          error: 'Cannot delete users from other tenants',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Create audit log before deletion
    await createAuditLog({
      tenantId: currentUser.tenantId,
      userId: currentUser.uid,
      userName: 'Admin',
      action: 'DELETE',
      resource: 'User',
      resourceId: body.userId,
      details: `Deleted user "${targetUser.name}" (${targetUser.email})`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'success',
      severity: 'warning',
    });

    // Delete from Firestore
    await db.collection('users').doc(body.userId).delete();

    // Delete from Firebase Auth
    await auth().deleteUser(body.userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'User deleted successfully' },
    });
  } catch (error: any) {
    console.error('Delete user error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to delete user',
        code: 'DELETE_ERROR',
      },
      { status: 500 }
    );
  }
}
