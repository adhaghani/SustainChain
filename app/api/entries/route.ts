import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getApps, initializeApp, cert} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { calculateCO2e, inferRegionFromProvider, type UtilityType } from '@/lib/carbon-calculator';

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    try {
      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
      });
    } catch {
      console.error('Failed to initialize Firebase Admin SDK');
    }
  }
}

const db = getFirestore();
const auth = getAuth();

interface CreateEntryBody {
  utilityType: UtilityType;
  provider: string;
  usage: number;
  unit: 'kWh' | 'm³' | 'L' | 'kg';
  billingDate: string;
  amount: number;
  currency?: string;
  accountNumber?: string;
  meterNumber?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  billImageUrl?: string;
  billImageStoragePath?: string;
  confidence?: number;
  extractionMethod: 'auto' | 'manual';
  notes?: string;
  tags?: string[];
}

/**
 * Verify Firebase auth token and extract user claims
 */
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      tenantId: decodedToken.tenantId as string,
      role: decodedToken.role as string,
      name: decodedToken.name as string || 'Unknown',
    };
  } catch {
    return null;
  }
}

/**
 * POST - Create a new entry
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userClaims = await verifyAuth(request);
    if (!userClaims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateEntryBody = await request.json();

    // Validate required fields
    const requiredFields = ['utilityType', 'usage', 'unit', 'billingDate', 'amount', 'extractionMethod'];
    for (const field of requiredFields) {
      if (body[field as keyof CreateEntryBody] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate CO2e emissions
    const region = body.provider ? inferRegionFromProvider(body.provider) : 'peninsular';
    const co2eResult = calculateCO2e(
      body.usage,
      body.unit,
      body.utilityType,
      { region }
    );

    // Prepare entry document
    const entryData = {
      // Identity
      tenantId: userClaims.tenantId,
      userId: userClaims.uid,
      userName: userClaims.name,

      // Utility Information
      utilityType: body.utilityType,
      provider: body.provider || 'Unknown',
      region: region,

      // Usage Data
      usage: body.usage,
      unit: body.unit,
      amount: body.amount,
      currency: body.currency || 'MYR',

      // Carbon Calculation
      co2e: co2eResult.co2e,
      emissionFactor: co2eResult.emissionFactor,
      calculationMethod: co2eResult.calculationMethod,

      // Billing Period
      billingDate: Timestamp.fromDate(new Date(body.billingDate)),
      billingPeriodStart: body.billingPeriodStart 
        ? Timestamp.fromDate(new Date(body.billingPeriodStart)) 
        : null,
      billingPeriodEnd: body.billingPeriodEnd 
        ? Timestamp.fromDate(new Date(body.billingPeriodEnd)) 
        : null,

      // Account Information
      accountNumber: body.accountNumber || null,
      meterNumber: body.meterNumber || null,

      // AI Extraction Metadata
      extractionMethod: body.extractionMethod,
      confidence: body.confidence || null,
      status: body.confidence && body.confidence < 0.7 ? 'pending' : 'verified',

      // Bill Image
      billImageUrl: body.billImageUrl || null,
      billImageStoragePath: body.billImageStoragePath || null,

      // Tags & Notes
      tags: body.tags || [],
      notes: body.notes || null,

      // Timestamps
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      uploadedAt: FieldValue.serverTimestamp(),
    };

    // Create entry in Firestore
    const entriesRef = db.collection('tenants').doc(userClaims.tenantId).collection('entries');
    const docRef = await entriesRef.add(entryData);

    // Update tenant aggregates (async, don't wait)
    db.collection('tenants').doc(userClaims.tenantId).update({
      totalEntries: FieldValue.increment(1),
      totalEmissions: FieldValue.increment(co2eResult.co2e),
      currentMonthEmissions: FieldValue.increment(co2eResult.co2e),
      lastActivity: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }).catch(console.error);

    // Update user aggregates
    db.collection('users').doc(userClaims.uid).update({
      entriesCreated: FieldValue.increment(1),
      lastActivity: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...entryData,
        co2e: co2eResult.co2e,
        calculationMethod: co2eResult.calculationMethod,
      },
      message: 'Entry created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create entry' },
      { status: 500 }
    );
  }
}

/**
 * GET - List entries for a tenant
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userClaims = await verifyAuth(request);
    if (!userClaims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const utilityType = searchParams.get('utilityType');
    const status = searchParams.get('status');

    // Build query
    let query = db
      .collection('tenants')
      .doc(userClaims.tenantId)
      .collection('entries')
      .orderBy('billingDate', 'desc')
      .limit(Math.min(limit, 100));

    if (utilityType) {
      query = query.where('utilityType', '==', utilityType);
    }
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: entries,
      count: entries.length,
    });

  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}
