/**
 * API Route: GET Pending Invitations
 * Fetches all pending invitations for the tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { requirePermission } from '@/lib/rbac';
import type { ApiResponse } from '@/types/firestore';
import { Timestamp } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

/**
 * GET /api/users/invitations
 * Fetches all invitations for the tenant
 */
export async function GET(request: NextRequest) {
  try {
    // Check permissions
    const authResult = await requirePermission(request, 'VIEW_USERS');
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user } = authResult;
    const tenantId = user.tenantId;
    if (!tenantId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Tenant ID not found',
          code: 'NO_TENANT',
        },
        { status: 400 }
      );
    }

    // Fetch invitations
    const invitationsSnapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('invitations')
      .orderBy('createdAt', 'desc')
      .get();

    const invitations = invitationsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        status: data.status,
        invitedBy: data.invitedBy,
        invitedByName: data.invitedByName,
        createdAt: data.createdAt.toDate().toISOString(),
        expiresAt: data.expiresAt.toDate().toISOString(),
        acceptedAt: data.acceptedAt ? data.acceptedAt.toDate().toISOString() : null,
        userId: data.userId || null,
      };
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: invitations,
    });
  } catch (error: unknown) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch invitations',
        code: 'FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/invitations?id={invitationId}
 * Cancels a pending invitation
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check permissions
    const authResult = await requirePermission(request, 'DELETE_USERS');
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user } = authResult;
    const tenantId = user.tenantId;
    if (!tenantId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Tenant ID not found',
          code: 'NO_TENANT',
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing invitation ID',
          code: 'MISSING_ID',
        },
        { status: 400 }
      );
    }

    // Get invitation
    const invitationRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('invitations')
      .doc(invitationId);

    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invitation not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const invitation = invitationDoc.data();

    if (invitation?.status !== 'pending') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Only pending invitations can be cancelled',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Update invitation status
    await invitationRef.update({
      status: 'cancelled',
      cancelledAt: Timestamp.now(),
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: invitationId },
    });
  } catch (error: unknown) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to cancel invitation',
        code: 'CANCEL_ERROR',
      },
      { status: 500 }
    );
  }
}
