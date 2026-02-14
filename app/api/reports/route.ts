import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

/**
 * GET - Fetch reports for current tenant
 * Query parameters:
 *  - limit: number of reports to fetch (default: 50)
 *  - status: filter by status (generating, completed, failed)
 *  - reportType: filter by type (monthly, quarterly, annual, custom)
 */
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token and get user claims
    const { getAuth } = await import('firebase-admin/auth');
    const auth = getAuth();
    
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const tenantId = decodedToken.tenantId as string;
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID not found' }, { status: 400 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const statusParam = searchParams.get('status');
    const reportTypeParam = searchParams.get('reportType');

    const limitCount = limitParam ? parseInt(limitParam, 10) : 50;

    // Build Firestore query
    let query = db
      .collection('tenants')
      .doc(tenantId)
      .collection('reports')
      .orderBy('createdAt', 'desc');

    // Add filters
    if (statusParam) {
      query = query.where('status', '==', statusParam);
    }
    if (reportTypeParam) {
      query = query.where('reportType', '==', reportTypeParam);
    }

    // Apply limit
    query = query.limit(limitCount);

    // Execute query
    const snapshot = await query.get();

    // Map documents to response
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to ISO strings
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      periodStart: doc.data().periodStart?.toDate().toISOString(),
      periodEnd: doc.data().periodEnd?.toDate().toISOString(),
      generationStartedAt: doc.data().generationStartedAt?.toDate().toISOString(),
      generationCompletedAt: doc.data().generationCompletedAt?.toDate().toISOString(),
      lastDownloadedAt: doc.data().lastDownloadedAt?.toDate().toISOString(),
      expiresAt: doc.data().expiresAt?.toDate().toISOString(),
    }));

    return NextResponse.json({
      reports,
      count: reports.length,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
