/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Firestore Helper Functions
 * CRUD operations for common database operations
 */

import { db } from "./firebase-admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import type {
  UserDocument,
  TenantDocument,
  CreateUserData,
  CreateTenantData,
  UserRole,
  TenantWithAdmin,
} from "@/types/firestore";

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create a new user document in Firestore
 */
export async function createUserDocument(
  userId: string,
  data: CreateUserData,
): Promise<UserDocument> {
  const userDoc: Partial<UserDocument> = {
    id: userId,
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    avatar: null,
    tenantId: data.tenantId,
    tenantName: data.tenantName,
    role: data.role,
    status: "active",
    lastLogin: Timestamp.now(),
    lastActivity: Timestamp.now(),
    entriesCreated: 0,
    reportsGenerated: 0,
    onboardingCompleted: false,
    onboardingStep: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    pdpaConsentGiven: data.pdpaConsentGiven,
  };

  // Only add pdpaConsentDate if consent was given
  if (data.pdpaConsentGiven) {
    userDoc.pdpaConsentDate = Timestamp.now();
  }

  await db
    .collection("users")
    .doc(userId)
    .set(userDoc as UserDocument);
  return userDoc as UserDocument;
}

/**
 * Get user document by ID
 */
export async function getUserDocument(
  userId: string,
): Promise<UserDocument | null> {
  const doc = await db.collection("users").doc(userId).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as UserDocument;
}

/**
 * Update user's last login timestamp
 */
export async function updateUserLastLogin(userId: string): Promise<void> {
  await db.collection("users").doc(userId).update({
    lastLogin: Timestamp.now(),
    lastActivity: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get all users for a tenant
 */
export async function getTenantUsers(
  tenantId: string,
): Promise<UserDocument[]> {
  const snapshot = await db
    .collection("users")
    .where("tenantId", "==", tenantId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc: any) => doc.data() as UserDocument);
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
): Promise<void> {
  await db.collection("users").doc(userId).update({
    role: newRole,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Update user profile information
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    phone?: string | null;
    jobTitle?: string | null;
    avatar?: string | null;
  },
): Promise<void> {
  const updateData: Record<string, unknown> = {
    ...updates,
    updatedAt: Timestamp.now(),
  };

  await db.collection("users").doc(userId).update(updateData);
}

// ============================================
// TENANT OPERATIONS
// ============================================

/**
 * Create a new tenant document
 */
export async function createTenantDocument(
  data: CreateTenantData,
): Promise<TenantDocument> {
  const tenantRef = db.collection("tenants").doc();
  const tenantId = tenantRef.id;

  const tenantDoc: TenantDocument = {
    id: tenantId,
    name: data.name,
    uen: data.uen,
    sector: data.sector,
    address: data.address,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: "Malaysia",
    adminName: data.adminName,
    adminEmail: data.adminEmail,
    adminPhone: data.adminPhone,
    logo: null,
    status: "trial",
    subscriptionTier: "trial",
    trialEndsAt: Timestamp.fromDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    ),
    userCount: 1,
    totalEntries: 0,
    totalEmissions: 0,
    currentMonthEmissions: 0,
    lastMonthEmissions: 0,
    settings: {
      defaultCurrency: "MYR",
      language: "en",
      timezone: "Asia/Kuala_Lumpur",
      fiscalYearStart: "01",
    },
    dataRetentionYears: 7,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastActivity: Timestamp.now(),
    features: {
      aiExtractionEnabled: true,
      benchmarkingEnabled: true,
      multiCurrencyEnabled: false,
    },
  };

  await tenantRef.set(tenantDoc);
  return tenantDoc;
}

/**
 * Get tenant document by ID
 */
export async function getTenantDocument(
  tenantId: string,
): Promise<TenantDocument | null> {
  const doc = await db.collection("tenants").doc(tenantId).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as TenantDocument;
}

/**
 * Check if UEN (company registration number) already exists
 */
export async function isUenTaken(uen: string): Promise<boolean> {
  const snapshot = await db
    .collection("tenants")
    .where("uen", "==", uen)
    .limit(1)
    .get();

  return !snapshot.empty;
}

/**
 * Increment tenant user count
 */
export async function incrementTenantUserCount(
  tenantId: string,
): Promise<void> {
  await db
    .collection("tenants")
    .doc(tenantId)
    .update({
      userCount: FieldValue.increment(1),
      updatedAt: Timestamp.now(),
    });
}

/**
 * Update tenant activity timestamp
 */
export async function updateTenantActivity(tenantId: string): Promise<void> {
  await db.collection("tenants").doc(tenantId).update({
    lastActivity: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get audit logs for a tenant
 */

export async function getTenantAuditLogs(tenantId: string): Promise<any[]> {
  const snapshot = await db
    .collection("auditLogs")
    .where("tenantId", "==", tenantId)
    .get();

  return snapshot.docs.map((doc: any) => doc.data());
}

/**
 * Get all entries for a tenant
 */

export async function getTenantEntries(tenantId: string): Promise<any[]> {
  const snapshot = await db
    .collection("entries")
    .where("tenantId", "==", tenantId)
    .get();

  return snapshot.docs.map((doc: any) => doc.data());
}

// ============================================
// COMBINED OPERATIONS
// ============================================

/**
 * Create tenant and admin user in a transaction
 */
export async function createTenantWithAdmin(
  tenantData: CreateTenantData,
  adminUserId: string,
  adminEmail: string,
): Promise<TenantWithAdmin> {
  // Create tenant
  const tenant = await createTenantDocument(tenantData);

  // Create admin user
  const admin = await createUserDocument(adminUserId, {
    email: adminEmail,
    name: tenantData.adminName,
    phone: tenantData.adminPhone,
    tenantId: tenant.id,
    tenantName: tenant.name,
    role: "admin",
    pdpaConsentGiven: true,
  });

  return { tenant, admin };
}

// ============================================
// SYSTEM ADMIN OPERATION
// ============================================

/**
 * UpdateApiLimits
 */
export async function updateApiLimits(rateLimits?: {
  billAnalysis?: {
    requestPerDay?: number;
    requestPerHour?: number;
    requestPerMinute?: number;
  };
  dashboard?: {
    requestPerMinute?: number;
  };
  reportGeneration?: {
    requestPerHour?: number;
    requestPerMinute?: number;
  };
}): Promise<void> {
  await db.collection("system_config").doc("api_limits").update({
    lastUpdated: Timestamp.now(),
    rateLimits: rateLimits,
  });
}

/**
 * update system Quota
 */

export async function updateSystemQuota(newQuota: {
  enterprise?: {
    maxBillUploads?: number;
    maxReports?: number;
    maxStorageGB?: number;
    maxUsers?: number;
  };
  premium?: {
    maxBillUploads?: number;
    maxReports?: number;
    maxStorageGB?: number;
    maxUsers?: number;
  };
  standard?: {
    maxBillUploads?: number;
    maxReports?: number;
    maxStorageGB?: number;
    maxUsers?: number;
  };
  trial?: {
    maxBillUploads?: number;
    maxReports?: number;
    maxStorageGB?: number;
    maxUsers?: number;
  };
}): Promise<void> {
  await db.collection("system_config").doc("api_limits").update({
    lastUpdated: Timestamp.now(),
    quotas: newQuota,
  });
}

export async function updateEmissionFactors(
  ValidUntil: string,
  version: string,
  source: string,
  newEmissionFactors?: {
    electricity?: {
      default?: number;
      peninsular?: number;
      sabah?: number;
      sarawak?: number;
    };
    water?: {
      default?: number;
      desalination?: number;
      treatment?: number;
    };
    fuel?: {
      default?: number;
      diesel_b10?: number;
      diesel_b20?: number;
      lng?: number;
      petrol_ron95?: number;
      petrol_ron97?: number;
    };
  },
): Promise<void> {
  await db.collection("system_config").doc("emission_factors").update({
    lastUpdated: Timestamp.now(),
    factors: newEmissionFactors,
    validUntil: ValidUntil,
    version: version,
    source: source,
  });
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate Malaysian UEN format
 * Format: 201501012345 (12 digits) or ROC123456 (ROC + 6 digits)
 */
export function validateMalaysianUEN(uen: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanUen = uen.replace(/\s/g, "").toUpperCase();

  // Check for ROC format (e.g., ROC123456)
  const rocPattern = /^ROC\d{6,7}$/;
  if (rocPattern.test(cleanUen)) {
    return true;
  }

  // Check for numeric format (e.g., 201501012345 - 12 digits)
  const numericPattern = /^\d{12}$/;
  if (numericPattern.test(cleanUen)) {
    return true;
  }

  return false;
}

/**
 * Validate Malaysian phone number format
 */
export function validateMalaysianPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, "");

  // Check for valid Malaysian mobile/landline formats
  // Mobile: 01X-XXXXXXX (10-11 digits)
  // Landline: 0X-XXXXXXX (9-10 digits)
  // International: +60XXXXXXXXX
  const patterns = [
    /^01[0-9]{8,9}$/, // Mobile without country code
    /^0[2-9][0-9]{7,8}$/, // Landline without country code
    /^\+60[1-9][0-9]{7,9}$/, // With country code
    /^60[1-9][0-9]{7,9}$/, // With country code (no +)
  ];

  return patterns.some((pattern) => pattern.test(cleanPhone));
}
