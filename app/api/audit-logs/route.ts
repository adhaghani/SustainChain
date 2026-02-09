import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit-logger';
import { verifyIdToken } from '@/lib/firebase-admin';
import type {
  AuditAction,
  AuditResource,
  AuditStatus,
  AuditSeverity,
} from '@/types/firestore';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user info from token
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || '';
    const userName = decodedToken.name || userEmail.split('@')[0];
    const userRole = decodedToken.role;
    const tenantId = decodedToken.tenantId;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'User not associated with a tenant' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      action,
      resource,
      resourceId,
      details,
      status = 'success',
      severity = 'info',
      errorMessage,
      errorCode,
      changeLog,
    } = body;

    // Validate required fields
    if (!action || !resource || !details) {
      return NextResponse.json(
        { error: 'Missing required fields: action, resource, details' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Create audit log
    await createAuditLog({
      tenantId,
      userId,
      userName,
      userEmail,
      userRole,
      action: action as AuditAction,
      resource: resource as AuditResource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      status: status as AuditStatus,
      severity: severity as AuditSeverity,
      errorMessage,
      errorCode,
      changeLog,
    });

    return NextResponse.json(
      { message: 'Audit log created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
