/**
 * Firestore Database Schema TypeScript Interfaces
 * Based on FIREBASE_SCHEMA.md
 */

import { Timestamp } from 'firebase-admin/firestore';

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type UserRole = 'admin' | 'clerk' | 'viewer';
export type UserStatus = 'active' | 'pending' | 'inactive';
export type TenantStatus = 'active' | 'trial' | 'inactive' | 'suspended';
export type SubscriptionTier = 'trial' | 'standard' | 'premium' | 'enterprise';
export type CompanySector = 
  | 'Manufacturing' 
  | 'Technology' 
  | 'Food & Beverage' 
  | 'Logistics' 
  | 'Retail' 
  | 'Agriculture' 
  | 'Construction' 
  | 'Healthcare' 
  | 'Education' 
  | 'Hospitality' 
  | 'Other';

export type UtilityType = 'electricity' | 'water' | 'fuel' | 'other';
export type EntryStatus = 'verified' | 'pending' | 'flagged' | 'rejected';
export type ExtractionMethod = 'auto' | 'manual';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================
// FIREBASE AUTH CUSTOM CLAIMS
// ============================================

export interface CustomClaims {
  role: UserRole;
  tenantId: string;
  tenantName: string;
}

// ============================================
// USER DOCUMENT
// ============================================

export interface UserDocument {
  // Identity
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;

  // Multi-Tenant Relationship
  tenantId: string;
  tenantName: string;

  // Role-Based Access Control
  role: UserRole;

  // Status & Activity
  status: UserStatus;
  lastLogin: Timestamp | null;
  lastActivity: Timestamp;

  // Aggregated Metrics
  entriesCreated: number;
  reportsGenerated: number;

  // Onboarding
  onboardingCompleted: boolean;
  onboardingStep?: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Compliance
  pdpaConsentGiven: boolean;
  pdpaConsentDate?: Timestamp;
}

export interface CreateUserData {
  email: string;
  name: string;
  phone?: string;
  tenantId: string;
  tenantName: string;
  role: UserRole;
  pdpaConsentGiven: boolean;
}

// ============================================
// TENANT DOCUMENT
// ============================================

export interface TenantDocument {
  // Identity
  id: string;
  name: string;
  uen: string;

  // Business Information
  sector: CompanySector;
  industry?: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;

  // Admin Contact
  adminName: string;
  adminEmail: string;
  adminPhone?: string;

  // Branding
  logo?: string | null;
  primaryColor?: string;

  // Status & Subscription
  status: TenantStatus;
  subscriptionTier: SubscriptionTier;
  trialEndsAt?: Timestamp;

  // Aggregated Metrics
  userCount: number;
  totalEntries: number;
  totalEmissions: number;
  currentMonthEmissions: number;
  lastMonthEmissions: number;

  // Benchmarking Cache
  sectorPercentile?: number;
  sectorRank?: string;
  lastBenchmarkUpdate?: Timestamp;

  // Settings
  settings: {
    defaultCurrency: 'MYR';
    language: 'en' | 'ms';
    timezone: string;
    fiscalYearStart: string;
  };

  // Compliance
  pdpaRegistrationNumber?: string;
  dataRetentionYears: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivity: Timestamp;

  // Feature Flags
  features?: {
    aiExtractionEnabled: boolean;
    benchmarkingEnabled: boolean;
    multiCurrencyEnabled: boolean;
  };
}

export interface CreateTenantData {
  name: string;
  uen: string;
  sector: CompanySector;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
}

// ============================================
// ENTRY DOCUMENT
// ============================================

export interface EntryDocument {
  // Identity
  id: string;
  tenantId: string;
  userId: string;
  userName: string;

  // Utility Information
  utilityType: UtilityType;
  provider: string;
  region?: 'peninsular' | 'sabah' | 'sarawak';

  // Usage Data
  usage: number;
  unit: 'kWh' | 'm³' | 'L' | 'kg';
  amount: number;
  currency: string;

  // Carbon Calculation
  co2e: number;
  emissionFactor: number;
  calculationMethod: string;

  // Billing Period
  billingDate: Timestamp;
  billingPeriodStart?: Timestamp;
  billingPeriodEnd?: Timestamp;

  // Account Information
  accountNumber?: string;
  meterNumber?: string;
  contractDemand?: number;

  // AI Extraction Metadata
  extractionMethod: ExtractionMethod;
  confidence?: number;
  status: EntryStatus;

  // Gemini Raw Output
  rawGeminiResponse?: {
    modelVersion: string;
    responseJson: Record<string, unknown>;
    tokensUsed: number;
  };

  // Bill Image
  billImageUrl?: string;
  billImageThumbnailUrl?: string;
  billImageStoragePath?: string;

  // Verification & Audit
  verifiedBy?: string;
  verifiedAt?: Timestamp;
  editHistory?: Array<{
    editedBy: string;
    editedAt: Timestamp;
    fieldChanged: string;
    oldValue: unknown;
    newValue: unknown;
  }>;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  uploadedAt: Timestamp;

  // Tags & Notes
  tags?: string[];
  notes?: string;
  department?: string;

  // Validation Flags
  isAnomaly?: boolean;
  anomalyReason?: string;
}

// ============================================
// AUDIT LOG DOCUMENT
// ============================================

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'UPLOAD' 
  | 'DOWNLOAD' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'EXPORT' 
  | 'VERIFY' 
  | 'REJECT' 
  | 'GENERATE_REPORT' 
  | 'AUTO_BACKUP' 
  | 'SETTINGS_CHANGE';

export type AuditResource = 
  | 'Entry' 
  | 'Bill' 
  | 'Report' 
  | 'User' 
  | 'Tenant' 
  | 'Subscription' 
  | 'Database' 
  | 'Settings';

export type AuditStatus = 'success' | 'failure' | 'warning';
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLogDocument {
  id: string;
  tenantId: string;
  timestamp: Timestamp;

  // User Information
  userId: string | null;
  userName: string;
  userEmail?: string;
  userRole?: UserRole;

  // Action Details
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details: string;

  // Technical Context
  ipAddress: string;
  userAgent: string;
  requestId?: string;

  // Status & Severity
  status: AuditStatus;
  severity: AuditSeverity;
  errorMessage?: string;
  errorCode?: string;

  // Changes
  changeLog?: Array<{
    fieldName: string;
    oldValue: unknown;
    newValue: unknown;
  }>;

  // Compliance
  retainUntil: Timestamp;
}

// ============================================
// NOTIFICATION DOCUMENT
// ============================================

export interface NotificationDocument {
  id: string;
  tenantId: string;
  userId: string;

  // Content
  type: NotificationType;
  icon: string;
  title: string;
  message: string;

  // Localization
  titleMs?: string;
  messageMs?: string;

  // Status
  read: boolean;
  readAt?: Timestamp;
  dismissed: boolean;

  // Action
  actionUrl?: string;
  actionLabel?: string;
  actionLabelMs?: string;

  // Priority
  priority: NotificationPriority;

  // Auto-dismiss
  expiresAt?: Timestamp;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// ONBOARDING SESSION DOCUMENT
// ============================================

export interface OnboardingSessionDocument {
  id: string;
  userId: string;
  tenantId: string;

  // Progress
  currentStep: number;
  completedSteps: number[];

  // Step Data
  companyInfo?: {
    name: string;
    uen: string;
    sector: string;
    address: string;
  };

  adminInfo?: {
    name: string;
    email: string;
    phone: string;
  };

  sampleBillUploaded: boolean;
  sampleBillUrl?: string;

  preferences?: {
    language: 'en' | 'ms';
    timezone: string;
    fiscalYearStart: string;
  };

  pdpaConsent: boolean;
  pdpaConsentDate?: Timestamp;

  // Status
  status: 'in_progress' | 'completed' | 'abandoned';

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
}

// ============================================
// HELPER TYPES FOR API RESPONSES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface TenantWithAdmin {
  tenant: TenantDocument;
  admin: UserDocument;
}
