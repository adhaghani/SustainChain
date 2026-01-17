/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Get Users API Route
 * Fetches all users for the authenticated user's tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/rbac';
import { getTenantUsers } from '@/lib/firestore-helpers';
import type { ApiResponse, UserDocument } from '@/types/firestore';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Check permission
  const authResult = await requirePermission(request, 'VIEW_USERS');
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const { user } = authResult;

  try {
    // Get all users for the tenant
    const users = await getTenantUsers(user.tenantId);

    return NextResponse.json<ApiResponse<UserDocument[]>>({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Get users error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch users',
        code: 'FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}
