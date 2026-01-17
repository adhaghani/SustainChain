/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tenant Registration API Route
 * Creates new tenant and admin user with Firebase custom claims
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import {
  createTenantWithAdmin,
  isUenTaken,
  validateMalaysianUEN,
  validateMalaysianPhone,
} from '@/lib/firestore-helpers';
import { createAuditLog } from '@/lib/audit-logger';
import type { CreateTenantData, ApiResponse, TenantWithAdmin } from '@/types/firestore';

export const runtime = 'nodejs';

interface RegisterTenantRequest {
  // Tenant Data
  companyName: string;
  uen: string;
  sector: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;

  // Admin User Data
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  adminPassword: string;

  // Consent
  pdpaConsent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterTenantRequest = await request.json();

    // ============================================
    // VALIDATION
    // ============================================

    // Required fields
    if (
      !body.companyName ||
      !body.uen ||
      !body.sector ||
      !body.address ||
      !body.adminName ||
      !body.adminEmail ||
      !body.adminPassword ||
      !body.pdpaConsent
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing required fields',
          code: 'MISSING_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate UEN format
    if (!validateMalaysianUEN(body.uen)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            'Invalid UEN format. Must be ROC format (e.g., ROC123456) or 12-digit number (e.g., 201501012345)',
          code: 'INVALID_UEN',
        },
        { status: 400 }
      );
    }

    // Check if UEN already exists
    const uenExists = await isUenTaken(body.uen);
    if (uenExists) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'A company with this UEN is already registered',
          code: 'UEN_EXISTS',
        },
        { status: 409 }
      );
    }

    // Validate phone number if provided
    if (body.adminPhone && !validateMalaysianPhone(body.adminPhone)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid Malaysian phone number format',
          code: 'INVALID_PHONE',
        },
        { status: 400 }
      );
    }

    // Validate PDPA consent
    if (!body.pdpaConsent) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'PDPA consent is required',
          code: 'CONSENT_REQUIRED',
        },
        { status: 400 }
      );
    }

    // ============================================
    // CREATE FIREBASE AUTH USER
    // ============================================

    let adminUser;
    try {
      adminUser = await auth().createUser({
        email: body.adminEmail,
        password: body.adminPassword,
        displayName: body.adminName,
        emailVerified: false,
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'An account with this email already exists',
            code: 'EMAIL_EXISTS',
          },
          { status: 409 }
        );
      }
      throw error;
    }

    // ============================================
    // CREATE TENANT & USER DOCUMENTS
    // ============================================

    const tenantData: CreateTenantData = {
      name: body.companyName,
      uen: body.uen.toUpperCase(),
      sector: body.sector as any,
      address: body.address,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      adminPhone: body.adminPhone,
    };

    const { tenant, admin } = await createTenantWithAdmin(
      tenantData,
      adminUser.uid,
      body.adminEmail
    );

    // ============================================
    // SET FIREBASE CUSTOM CLAIMS
    // ============================================

    await auth().setCustomUserClaims(adminUser.uid, {
      role: 'admin',
      tenantId: tenant.id,
      tenantName: tenant.name,
    });

    // ============================================
    // CREATE AUDIT LOG
    // ============================================

    await createAuditLog({
      tenantId: tenant.id,
      userId: adminUser.uid,
      userName: admin.name,
      userEmail: admin.email,
      userRole: 'admin',
      action: 'CREATE',
      resource: 'Tenant',
      resourceId: tenant.id,
      details: `Tenant "${tenant.name}" registered with UEN ${tenant.uen}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'success',
      severity: 'info',
    });

    // ============================================
    // SEND WELCOME EMAIL (Optional - implement later)
    // ============================================
    // await sendWelcomeEmail(admin.email, tenant.name);

    // ============================================
    // RESPONSE
    // ============================================

    return NextResponse.json<ApiResponse<TenantWithAdmin>>(
      {
        success: true,
        data: {
          tenant,
          admin,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Tenant registration error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to register tenant',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
