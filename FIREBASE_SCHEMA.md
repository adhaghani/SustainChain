# SustainChain: Firebase/Firestore Database Schema

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Production-Ready Design

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Collection Structure](#collection-structure)
3. [Core Collections](#core-collections)
4. [Multi-Tenant Subcollections](#multi-tenant-subcollections)
5. [TypeScript Interfaces](#typescript-interfaces)
6. [Security Rules](#security-rules)
7. [Indexes](#indexes)
8. [Cloud Storage](#cloud-storage)
9. [BigQuery ETL Mapping](#bigquery-etl-mapping)
10. [Migration Plan](#migration-plan)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Design Principles

1. **Multi-Tenant Isolation**: All business data stored in `/tenants/{tenantId}/[subcollection]`
2. **Role-Based Access Control**: Admin, Clerk, Viewer roles enforced via custom claims + security rules
3. **PDPA Compliance**: Audit logs, data retention policies, user consent tracking
4. **Real-Time Analytics**: Aggregated metrics cached in tenant documents for fast dashboard queries
5. **Scalability**: Partitioned by tenant for horizontal scaling (10,000 docs/tenant limit)

### Data Flow

```
┌─────────────────┐
│ Firebase Auth   │ ← User authentication (UID)
│ Custom Claims:  │   - role: admin/clerk/viewer
│ {tenantId, role}│   - tenantId: "tenant_123"
└─────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Firestore Database                                          │
│                                                             │
│  /users/{userId}           ← Global user profiles          │
│  /tenants/{tenantId}       ← Tenant metadata               │
│     ├── /entries           ← Bills & emissions (isolated)  │
│     ├── /audit_logs        ← Activity tracking             │
│     ├── /notifications     ← User notifications            │
│     ├── /reports           ← Generated PDF metadata        │
│     └── /subscriptions     ← Billing info                  │
│  /system_config            ← Global settings (admin-only)  │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────┐
│ Cloud Storage   │ ← Bill images
│ gs://sustainchain-bills/{tenantId}/{entryId}.jpg
└─────────────────┘
         ↓
┌─────────────────┐
│ BigQuery        │ ← Sector benchmarking analytics
│ Dataset: sustainchain
│ Table: emissions
└─────────────────┘
```

---

## 📁 COLLECTION STRUCTURE

```
/users (collection)                    ← Global, linked to Firebase Auth
  └── {userId} (document)              ← Same as Firebase Auth UID

/tenants (collection)                  ← Tenant metadata
  └── {tenantId} (document)
      ├── /entries (subcollection)     ← Emission entries (multi-tenant isolation)
      │   └── {entryId} (document)
      ├── /audit_logs (subcollection)  ← Activity logs
      │   └── {logId} (document)
      ├── /notifications (subcollection) ← User notifications
      │   └── {notificationId} (document)
      ├── /reports (subcollection)     ← PDF reports metadata
      │   └── {reportId} (document)
      ├── /invitations (subcollection) ← User invitation tracking
      │   └── {invitationId} (document)
      └── /subscriptions (subcollection) ← Billing data
          └── {subscriptionId} (document)

/system_config (collection)            ← Global configuration (admin-only)
  ├── emission_factors (document)      ← CO2e calculation constants
  ├── api_limits (document)            ← Rate limiting config
  └── feature_flags (document)         ← Feature toggles

/onboarding_sessions (collection)      ← Temporary onboarding data (TTL: 24h)
  └── {sessionId} (document)
```

---

## 🗄️ CORE COLLECTIONS

### 1. `/users` Collection

**Purpose**: Global user profiles linked to Firebase Auth UIDs

#### Document Schema: `/users/{userId}`

```typescript
interface UserDocument {
  // Identity (synced with Firebase Auth)
  id: string;                    // Same as Firebase Auth UID
  email: string;                 // From Firebase Auth
  name: string;                  // Display name
  phone?: string | null;         // Optional phone number
  avatar?: string | null;        // Cloud Storage URL or null

  // Multi-Tenant Relationship
  tenantId: string;              // Reference to /tenants/{tenantId}
  tenantName: string;            // Denormalized for UI display

  // Role-Based Access Control (synced with custom claims)
  role: 'admin' | 'clerk' | 'viewer';

  // Status & Activity
  status: 'active' | 'pending' | 'inactive';
  lastLogin: FirebaseFirestore.Timestamp | null;
  lastActivity: FirebaseFirestore.Timestamp;

  // Aggregated Metrics (updated via Cloud Functions)
  entriesCreated: number;        // Total emission entries uploaded
  reportsGenerated: number;      // Total reports created

  // Onboarding
  onboardingCompleted: boolean;
  onboardingStep?: number;       // Current step if incomplete

  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;

  // Compliance
  pdpaConsentGiven: boolean;     // PDPA compliance flag
  pdpaConsentDate?: FirebaseFirestore.Timestamp;
}
```

#### Indexes

```
Composite Indexes:
- (tenantId ASC, status ASC, lastLogin DESC)
- (tenantId ASC, role ASC, createdAt DESC)
```

---

### 2. `/tenants` Collection

**Purpose**: Tenant (company) metadata and aggregated metrics

#### Document Schema: `/tenants/{tenantId}`

```typescript
interface TenantDocument {
  // Identity
  id: string;                    // Tenant ID (auto-generated)
  name: string;                  // Company name
  uen: string;                   // Unique Entity Number (Malaysia)
  
  // Business Information
  sector: 'Manufacturing' | 'Technology' | 'Food & Beverage' | 
          'Logistics' | 'Retail' | 'Agriculture' | 'Construction' | 
          'Healthcare' | 'Education' | 'Hospitality' | 'Other';
  industry?: string;             // More specific industry (optional)
  address: string;               // Registered address
  city?: string;
  state?: string;                // Malaysian states
  postalCode?: string;
  country: string;               // Default: "Malaysia"

  // Admin Contact
  adminName: string;
  adminEmail: string;
  adminPhone?: string;

  // Branding
  logo?: string | null;          // Cloud Storage URL
  primaryColor?: string;         // Hex color for reports

  // Status & Subscription
  status: 'active' | 'trial' | 'inactive' | 'suspended';
  subscriptionTier: 'trial' | 'standard' | 'premium' | 'enterprise';
  trialEndsAt?: FirebaseFirestore.Timestamp;

  // Aggregated Metrics (updated via Cloud Functions)
  userCount: number;             // Active users
  totalEntries: number;          // Total emission entries
  totalEmissions: number;        // Lifetime CO2e (kg)
  currentMonthEmissions: number; // Current month CO2e (kg)
  lastMonthEmissions: number;    // Previous month CO2e (kg)

  // Benchmarking Cache (updated weekly)
  sectorPercentile?: number;     // 0-100 (50 = median)
  sectorRank?: string;           // "Top 25%", "Above Average", etc.
  lastBenchmarkUpdate?: FirebaseFirestore.Timestamp;

  // Settings
  settings: {
    defaultCurrency: 'MYR';
    language: 'en' | 'ms';       // English or Malay
    timezone: string;            // Default: "Asia/Kuala_Lumpur"
    fiscalYearStart: string;     // ISO month "01" to "12"
  };

  // Compliance
  pdpaRegistrationNumber?: string;
  dataRetentionYears: number;    // Default: 7 (PDPA requirement)

  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  lastActivity: FirebaseFirestore.Timestamp;

  // Feature Flags (tenant-specific)
  features?: {
    aiExtractionEnabled: boolean;
    benchmarkingEnabled: boolean;
    multiCurrencyEnabled: boolean;
  };
}
```

#### Indexes

```
Composite Indexes:
- (status ASC, sector ASC, totalEmissions DESC)
- (sector ASC, sectorPercentile DESC)
```

---

### 3. `/tenants/{tenantId}/invitations` Subcollection

**Purpose**: User invitation tracking for multi-tenant access management

#### Document Schema: `/tenants/{tenantId}/invitations/{invitationId}`

```typescript
interface InvitationDocument {
  // Identity
  id: string;                    // Auto-generated invitation ID
  token: string;                 // Unique secure token for invitation link (64 chars hex)
  
  // Invitee Information
  email: string;                 // Email address of invitee
  name: string;                  // Full name of invitee
  phone?: string | null;         // Optional phone number
  role: 'admin' | 'clerk' | 'viewer';  // Assigned role for invitee
  
  // Tenant Context
  tenantId: string;              // Reference to parent tenant
  tenantName: string;            // Denormalized for email display
  
  // Inviter Information
  invitedBy: string;             // User ID of admin who sent invitation
  invitedByName: string;         // Name of inviter (for email display)
  invitedByEmail: string;        // Email of inviter (for email display)
  
  // Status & Lifecycle
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  
  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;  // 7 days from createdAt
  acceptedAt?: FirebaseFirestore.Timestamp | null;  // Set when invitation is accepted
  cancelledAt?: FirebaseFirestore.Timestamp | null;  // Set if admin cancels
  
  // Email Tracking
  emailSent: boolean;            // Whether email was successfully sent
  emailSentAt?: FirebaseFirestore.Timestamp;
  emailProvider: 'resend';       // Email service used
  
  // User Creation
  userId?: string | null;        // Firebase Auth UID (set after acceptance)
}
```

#### Indexes

```
Composite Indexes:
- (status ASC, expiresAt ASC)        // For finding expired invitations
- (email ASC, status ASC)            // For checking duplicate invitations
- (token ASC)                        // For fast token lookup (single field)
- (invitedBy ASC, createdAt DESC)    // For showing what admin invited
```

#### Security Rules

```javascript
match /tenants/{tenantId}/invitations/{invitationId} {
  // Admins can create, read, and cancel invitations
  allow create: if isAuthenticated() && 
                   hasRole('admin') && 
                   belongsToTenant(tenantId);
  
  allow read: if isAuthenticated() && belongsToTenant(tenantId);
  
  allow update: if isAuthenticated() && 
                   hasRole('admin') && 
                   belongsToTenant(tenantId) &&
                   // Only allow cancelling (not modifying other fields)
                   request.resource.data.diff(resource.data).affectedKeys()
                     .hasOnly(['status', 'cancelledAt']);
  
  allow delete: if false;  // Never delete, only soft-delete via status
}
```

#### Usage Examples

**1. Creating an invitation**
```typescript
const invitationData = {
  id: crypto.randomUUID(),
  token: crypto.randomBytes(32).toString('hex'),
  email: 'john@example.com',
  name: 'John Doe',
  phone: '+60123456789',
  role: 'clerk',
  tenantId: 'tenant_abc123',
  tenantName: 'Acme Corp',
  invitedBy: 'user_xyz789',
  invitedByName: 'Admin User',
  invitedByEmail: 'admin@acme.com',
  status: 'pending',
  createdAt: Timestamp.now(),
  expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  emailSent: false,
  emailProvider: 'resend',
};
```

**2. Checking for existing invitation**
```typescript
const existingInvite = await db
  .collection('tenants')
  .doc(tenantId)
  .collection('invitations')
  .where('email', '==', email)
  .where('status', '==', 'pending')
  .where('expiresAt', '>', Timestamp.now())
  .limit(1)
  .get();
```

**3. Accepting invitation**
```typescript
await invitationRef.update({
  status: 'accepted',
  acceptedAt: Timestamp.now(),
  userId: newUserAuthUid,
});
```

---

### 4. `/system_config` Collection

**Purpose**: Global system configuration (admin-only access)

#### Document Schema: `/system_config/emission_factors`

```typescript
interface EmissionFactorsDocument {
  // Malaysia-Specific Emission Factors (2025 Data)
  electricity: {
    peninsular: 0.587;           // kg CO2e/kWh (TNB grid)
    sabah: 0.742;                // kg CO2e/kWh (SESB grid)
    sarawak: 0.851;              // kg CO2e/kWh (SEB grid)
    default: 0.587;              // Fallback to peninsular
  };

  water: {
    treatment: 0.298;            // kg CO2e/m³ (water treatment + distribution)
    desalination: 1.87;          // kg CO2e/m³ (desalination plants)
    default: 0.298;
  };

  fuel: {
    diesel_b10: 2.31;            // kg CO2e/L (B10 blend)
    diesel_b20: 2.18;            // kg CO2e/L (B20 blend)
    petrol_ron95: 2.20;          // kg CO2e/L
    petrol_ron97: 2.23;          // kg CO2e/L
    lng: 2.75;                   // kg CO2e/kg (compressed natural gas)
    default: 2.31;
  };

  // Metadata
  source: string;                // "Malaysia Green Technology Centre (MGTC)"
  version: string;               // "2025.1"
  lastUpdated: FirebaseFirestore.Timestamp;
  validUntil: FirebaseFirestore.Timestamp;
}
```

#### Document Schema: `/system_config/api_limits`

```typescript
interface ApiLimitsDocument {
  rateLimits: {
    billAnalysis: {
      requestsPerMinute: 10;     // Per tenant
      requestsPerHour: 100;
      requestsPerDay: 500;
    };
    reportGeneration: {
      requestsPerMinute: 5;
      requestsPerHour: 50;
    };
    dashboard: {
      requestsPerMinute: 60;     // Higher limit for dashboard queries
    };
  };

  quotas: {
    trial: {
      maxBillUploads: 50;
      maxReports: 5;
      maxStorageGB: 1;
      maxUsers: 3;
    };
    standard: {
      maxBillUploads: 500;
      maxReports: 50;
      maxStorageGB: 10;
      maxUsers: 10;
    };
    premium: {
      maxBillUploads: 2000;
      maxReports: 200;
      maxStorageGB: 50;
      maxUsers: 50;
    };
    enterprise: {
      maxBillUploads: -1;        // Unlimited
      maxReports: -1;
      maxStorageGB: 500;
      maxUsers: -1;
    };
  };

  lastUpdated: FirebaseFirestore.Timestamp;
}
```

#### Document Schema: `/system_config/feature_flags`

```typescript
interface FeatureFlagsDocument {
  global: {
    maintenanceMode: boolean;
    signupEnabled: boolean;
    geminiApiEnabled: boolean;
    bigQuerySyncEnabled: boolean;
  };

  experimental: {
    waterBillExtraction: boolean;    // SAJ/IWK support
    fuelBillExtraction: boolean;     // Petron/Shell support
    carbonOffsetMarketplace: boolean;
    realTimeDashboard: boolean;      // WebSocket updates
  };

  regional: {
    malaysiaOnly: boolean;           // Restrict to MY regions
    multiCurrencyEnabled: boolean;
  };

  lastUpdated: FirebaseFirestore.Timestamp;
}
```

---

## 🏢 MULTI-TENANT SUBCOLLECTIONS

### 4. `/tenants/{tenantId}/entries` Subcollection

**Purpose**: Emission entries (bills) - core data for carbon footprint calculation

#### Document Schema: `/tenants/{tenantId}/entries/{entryId}`

```typescript
interface EntryDocument {
  // Identity
  id: string;                    // Entry ID (auto-generated)
  tenantId: string;              // Parent tenant ID
  userId: string;                // Creator (reference to /users/{userId})
  userName: string;              // Denormalized for display

  // Utility Information
  utilityType: 'electricity' | 'water' | 'fuel' | 'other';
  provider: string;              // e.g., "TNB", "SAJ Energy", "IWK", "Petron"
  region?: 'peninsular' | 'sabah' | 'sarawak'; // For electricity only

  // Usage Data
  usage: number;                 // Consumption amount
  unit: 'kWh' | 'm³' | 'L' | 'kg'; // Unit of measurement
  amount: number;                // Bill amount in MYR (or other currency)
  currency: string;              // Default: "MYR"

  // Carbon Calculation
  co2e: number;                  // kg CO2e (calculated)
  emissionFactor: number;        // kg CO2e per unit (stored for audit trail)
  calculationMethod: string;     // e.g., "MGTC 2025.1 - Peninsular Grid"

  // Billing Period
  billingDate: FirebaseFirestore.Timestamp;      // Invoice date
  billingPeriodStart?: FirebaseFirestore.Timestamp;
  billingPeriodEnd?: FirebaseFirestore.Timestamp;

  // Account Information
  accountNumber?: string;
  meterNumber?: string;
  contractDemand?: number;       // kW (for industrial meters)

  // AI Extraction Metadata
  extractionMethod: 'auto' | 'manual';
  confidence?: number;           // 0.0-1.0 (Gemini confidence score)
  status: 'verified' | 'pending' | 'flagged' | 'rejected';
  
  // Gemini Raw Output (for debugging/reprocessing)
  rawGeminiResponse?: {
    modelVersion: string;        // "gemini-1.5-flash"
    responseJson: Record<string, unknown>;
    tokensUsed: number;
  };

  // Bill Image
  billImageUrl?: string;         // Cloud Storage path
  billImageThumbnailUrl?: string; // Thumbnail (200x200)
  billImageStoragePath?: string; // Full GCS path for deletion

  // Verification & Audit
  verifiedBy?: string;           // User ID who verified
  verifiedAt?: FirebaseFirestore.Timestamp;
  editHistory?: Array<{
    editedBy: string;            // User ID
    editedAt: FirebaseFirestore.Timestamp;
    fieldChanged: string;
    oldValue: unknown;
    newValue: unknown;
  }>;

  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  uploadedAt: FirebaseFirestore.Timestamp;

  // Tags & Notes
  tags?: string[];               // Custom tags for categorization
  notes?: string;                // User notes
  department?: string;           // Cost center / department

  // Validation Flags
  isAnomaly?: boolean;           // Flagged by ML anomaly detection
  anomalyReason?: string;        // "Usage 300% higher than average"
}
```

#### Indexes

```
Composite Indexes:
- (tenantId ASC, billingDate DESC)               ← Dashboard recent entries
- (tenantId ASC, status ASC, createdAt DESC)     ← Pending verification queue
- (tenantId ASC, utilityType ASC, billingDate DESC) ← Filter by utility type
- (tenantId ASC, userId ASC, createdAt DESC)     ← User's entries
- (status ASC, confidence ASC)                   ← Low-confidence entries
```

---

### 5. `/tenants/{tenantId}/audit_logs` Subcollection

**Purpose**: Activity tracking for compliance and security

#### Document Schema: `/tenants/{tenantId}/audit_logs/{logId}`

```typescript
interface AuditLogDocument {
  // Identity
  id: string;                    // Log ID (auto-generated)
  tenantId: string;              // Parent tenant ID

  // Timestamp (indexed)
  timestamp: FirebaseFirestore.Timestamp;

  // User Information
  userId: string | null;         // null for system actions
  userName: string;              // "System" for automated actions
  userEmail?: string;
  userRole?: 'admin' | 'clerk' | 'viewer';

  // Action Details
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'UPLOAD' | 'DOWNLOAD' | 
          'LOGIN' | 'LOGOUT' | 'EXPORT' | 'VERIFY' | 'REJECT' |
          'GENERATE_REPORT' | 'AUTO_BACKUP' | 'SETTINGS_CHANGE';
  
  resource: 'Entry' | 'Bill' | 'Report' | 'User' | 'Tenant' | 
            'Subscription' | 'Database' | 'Settings';
  
  resourceId?: string;           // ID of affected resource
  
  details: string;               // Human-readable description
  // Example: "Uploaded electricity bill for December 2025 (TNB)"

  // Technical Context
  ipAddress: string;             // Client IP (anonymized after 90 days)
  userAgent: string;             // Browser/client info
  requestId?: string;            // Trace ID for debugging

  // Status & Severity
  status: 'success' | 'failure' | 'warning';
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  errorMessage?: string;         // If status = failure
  errorCode?: string;            // Application error code

  // Changes (for UPDATE actions)
  changeLog?: {
    fieldName: string;
    oldValue: unknown;
    newValue: unknown;
  }[];

  // Compliance
  retainUntil: FirebaseFirestore.Timestamp; // Auto-delete after 7 years (PDPA)
}
```

#### Indexes

```
Composite Indexes:
- (tenantId ASC, timestamp DESC)                 ← Recent activity
- (tenantId ASC, userId ASC, timestamp DESC)     ← User activity log
- (tenantId ASC, action ASC, timestamp DESC)     ← Filter by action type
- (severity ASC, timestamp DESC)                 ← Critical events monitoring
```

---

### 6. `/tenants/{tenantId}/notifications` Subcollection

**Purpose**: User notifications (in-app alerts)

#### Document Schema: `/tenants/{tenantId}/notifications/{notificationId}`

```typescript
interface NotificationDocument {
  // Identity
  id: string;                    // Notification ID (auto-generated)
  tenantId: string;              // Parent tenant ID
  userId: string;                // Target user (or "all" for broadcast)

  // Content
  type: 'success' | 'info' | 'warning' | 'error';
  icon: string;                  // Icon identifier (e.g., "CheckCircle", "AlertTriangle")
  title: string;                 // Notification title
  message: string;               // Notification body
  
  // Localization
  titleMs?: string;              // Malay translation
  messageMs?: string;

  // Status
  read: boolean;                 // Default: false
  readAt?: FirebaseFirestore.Timestamp;
  dismissed: boolean;            // User dismissed notification

  // Action (optional)
  actionUrl?: string;            // Deep link (e.g., "/entries/entry_123")
  actionLabel?: string;          // "View Entry", "Download Report"
  actionLabelMs?: string;

  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Auto-dismiss
  expiresAt?: FirebaseFirestore.Timestamp; // Auto-delete after date

  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

#### Indexes

```
Composite Indexes:
- (tenantId ASC, userId ASC, read ASC, createdAt DESC) ← Unread notifications
- (tenantId ASC, userId ASC, priority DESC, createdAt DESC)
```

---

### 7. `/tenants/{tenantId}/reports` Subcollection

**Purpose**: Generated PDF reports metadata

#### Document Schema: `/tenants/{tenantId}/reports/{reportId}`

```typescript
interface ReportDocument {
  // Identity
  id: string;                    // Report ID (auto-generated)
  tenantId: string;              // Parent tenant ID
  userId: string;                // Report creator
  userName: string;              // Denormalized

  // Report Details
  reportType: 'monthly' | 'quarterly' | 'annual' | 'custom';
  title: string;                 // "Monthly ESG Report - December 2025"
  
  // Period Covered
  periodStart: FirebaseFirestore.Timestamp;
  periodEnd: FirebaseFirestore.Timestamp;
  
  // Entries Included
  entriesIncluded: string[];     // Array of entry IDs
  totalEntries: number;
  
  // Summary Metrics (denormalized for quick access)
  totalCo2e: number;             // kg CO2e
  totalElectricity: number;      // kWh
  totalWater?: number;           // m³
  totalFuel?: number;            // L
  totalCost: number;             // MYR
  
  // Benchmarking Data (snapshot at generation time)
  sectorAverage: number;         // kg CO2e
  sectorPercentile: number;      // 0-100
  comparisonText: string;        // "18% less than sector average"
  comparisonTextMs?: string;

  // PDF File
  pdfUrl: string;                // Cloud Storage signed URL
  pdfStoragePath: string;        // gs://sustainchain-reports/{tenantId}/{reportId}.pdf
  fileSize: number;              // Bytes
  
  // Generation Metadata
  status: 'generating' | 'completed' | 'failed';
  generationStartedAt: FirebaseFirestore.Timestamp;
  generationCompletedAt?: FirebaseFirestore.Timestamp;
  generationDuration?: number;   // Seconds
  errorMessage?: string;
  
  // Template
  templateVersion: string;       // "v1.0"
  language: 'en' | 'ms';
  includesBillImages: boolean;
  
  // Access Control
  downloadCount: number;
  lastDownloadedAt?: FirebaseFirestore.Timestamp;
  expiresAt?: FirebaseFirestore.Timestamp; // Auto-delete after 1 year

  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

#### Indexes

```
Composite Indexes:
- (tenantId ASC, createdAt DESC)                 ← Recent reports
- (tenantId ASC, status ASC, createdAt DESC)     ← Filter by status
- (tenantId ASC, reportType ASC, periodEnd DESC) ← Filter by type
```

---

### 8. `/tenants/{tenantId}/subscriptions` Subcollection

**Purpose**: Billing and subscription management

#### Document Schema: `/tenants/{tenantId}/subscriptions/current`

```typescript
interface SubscriptionDocument {
  // Identity (always use "current" as document ID)
  id: 'current';                 // Fixed ID
  tenantId: string;              // Parent tenant ID

  // Plan Details
  plan: 'trial' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused';
  billingCycle: 'monthly' | 'annual';
  
  // Pricing
  monthlyPrice: number;          // MYR per month
  annualPrice?: number;          // MYR per year (if annual)
  currency: 'MYR';
  
  // Current Period
  currentPeriodStart: FirebaseFirestore.Timestamp;
  currentPeriodEnd: FirebaseFirestore.Timestamp;
  nextBillingDate: FirebaseFirestore.Timestamp;
  
  // Usage Tracking (reset each billing cycle)
  usage: {
    billUploads: number;
    billUploadsLimit: number;
    reportsGenerated: number;
    reportsLimit: number;
    storageUsedGB: number;
    storageLimit: number;
    activeUsers: number;
    usersLimit: number;
  };
  
  // Trial Information
  trialStart?: FirebaseFirestore.Timestamp;
  trialEnd?: FirebaseFirestore.Timestamp;
  trialDaysRemaining?: number;
  
  // Payment Method
  paymentMethod?: {
    type: 'credit_card' | 'bank_transfer' | 'fpx';
    last4?: string;              // Last 4 digits of card
    brand?: string;              // "Visa", "Mastercard"
    expiryMonth?: number;
    expiryYear?: number;
  };
  
  // Invoices
  lastInvoiceId?: string;
  lastInvoiceAmount?: number;
  lastInvoiceStatus?: 'paid' | 'pending' | 'overdue';
  
  // Cancellation
  canceledAt?: FirebaseFirestore.Timestamp;
  cancelReason?: string;
  accessEndsAt?: FirebaseFirestore.Timestamp; // Continue access until period end
  
  // Discounts
  discountPercent?: number;      // 0-100
  discountEndsAt?: FirebaseFirestore.Timestamp;
  promoCode?: string;

  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

#### Subcollection: `/tenants/{tenantId}/subscriptions/current/invoices/{invoiceId}`

```typescript
interface InvoiceDocument {
  id: string;                    // Invoice ID (auto-generated)
  tenantId: string;
  subscriptionId: 'current';

  // Invoice Details
  invoiceNumber: string;         // "INV-2026-001234"
  status: 'paid' | 'pending' | 'overdue' | 'void';
  description: string;           // "Premium Plan - January 2026"
  
  // Dates
  issueDate: FirebaseFirestore.Timestamp;
  dueDate: FirebaseFirestore.Timestamp;
  paidAt?: FirebaseFirestore.Timestamp;
  
  // Amount
  subtotal: number;              // MYR
  tax: number;                   // SST (Service tax)
  discount: number;              // Discount amount
  total: number;                 // MYR (after tax and discount)
  currency: 'MYR';
  
  // Line Items
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  
  // PDF
  pdfUrl?: string;               // Cloud Storage URL
  
  // Payment
  paymentMethod?: string;
  transactionId?: string;        // Payment gateway transaction ID
  
  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

---

### 9. `/onboarding_sessions` Collection (Temporary)

**Purpose**: Store onboarding progress (auto-delete after 24 hours)

#### Document Schema: `/onboarding_sessions/{sessionId}`

```typescript
interface OnboardingSessionDocument {
  id: string;                    // Session ID (auto-generated)
  userId: string;                // User completing onboarding
  tenantId: string;              // New tenant being created

  // Progress Tracking
  currentStep: number;           // 1-5
  completedSteps: number[];      // [1, 2, 3]
  
  // Step 1: Company Info
  companyInfo?: {
    name: string;
    uen: string;
    sector: string;
    address: string;
  };
  
  // Step 2: Admin User
  adminInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  
  // Step 3: Sample Bill Upload
  sampleBillUploaded: boolean;
  sampleBillUrl?: string;
  
  // Step 4: Preferences
  preferences?: {
    language: 'en' | 'ms';
    timezone: string;
    fiscalYearStart: string;
  };
  
  // Step 5: PDPA Consent
  pdpaConsent: boolean;
  pdpaConsentDate?: FirebaseFirestore.Timestamp;
  
  // Status
  status: 'in_progress' | 'completed' | 'abandoned';
  
  // Timestamps
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp; // TTL: 24 hours
}
```

---

## 🔐 SECURITY RULES

### Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Get user's tenant ID from custom claims
    function getUserTenantId() {
      return request.auth.token.tenantId;
    }
    
    // Get user's role from custom claims
    function getUserRole() {
      return request.auth.token.role;
    }
    
    // Check if user belongs to the tenant
    function belongsToTenant(tenantId) {
      return isAuthenticated() && getUserTenantId() == tenantId;
    }
    
    // Check if user is admin
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    // Check if user is admin of specific tenant
    function isTenantAdmin(tenantId) {
      return belongsToTenant(tenantId) && isAdmin();
    }
    
    // Check if user can write (admin or clerk)
    function canWrite() {
      return isAuthenticated() && getUserRole() in ['admin', 'clerk'];
    }
    
    // Check if resource belongs to user's tenant
    function resourceBelongsToUserTenant() {
      return resource.data.tenantId == getUserTenantId();
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      // Users can update their own profile (limited fields)
      allow update: if isAuthenticated() 
                    && request.auth.uid == userId
                    && request.resource.data.diff(resource.data).affectedKeys()
                       .hasOnly(['name', 'phone', 'avatar', 'lastLogin', 
                                 'lastActivity', 'onboardingStep', 'updatedAt']);
      
      // Admins can read all users in their tenant
      allow read: if isAuthenticated() 
                  && isAdmin() 
                  && resource.data.tenantId == getUserTenantId();
      
      // Admins can create users in their tenant
      allow create: if isAuthenticated()
                    && isAdmin()
                    && request.resource.data.tenantId == getUserTenantId();
      
      // Admins can update users in their tenant (except role changes require super admin)
      allow update: if isAuthenticated()
                    && isAdmin()
                    && resource.data.tenantId == getUserTenantId()
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'tenantId']));
      
      // Only super admins can delete users (implement via Cloud Functions)
      allow delete: if false;
    }
    
    // ============================================
    // TENANTS COLLECTION
    // ============================================
    
    match /tenants/{tenantId} {
      // Users can read their own tenant
      allow read: if belongsToTenant(tenantId);
      
      // Only admins can update tenant info
      allow update: if isTenantAdmin(tenantId);
      
      // Tenant creation handled via Cloud Functions (during signup)
      allow create: if false;
      allow delete: if false;
      
      // --------------------------------------------
      // ENTRIES SUBCOLLECTION
      // --------------------------------------------
      
      match /entries/{entryId} {
        // All tenant members can read entries
        allow read: if belongsToTenant(tenantId);
        
        // Admins and clerks can create entries
        allow create: if belongsToTenant(tenantId) 
                      && canWrite()
                      && request.resource.data.tenantId == tenantId
                      && request.resource.data.userId == request.auth.uid;
        
        // Admins and clerks can update entries
        // Clerks can only update their own entries
        allow update: if belongsToTenant(tenantId)
                      && canWrite()
                      && (isAdmin() || resource.data.userId == request.auth.uid);
        
        // Only admins can delete entries
        allow delete: if isTenantAdmin(tenantId);
      }
      
      // --------------------------------------------
      // AUDIT LOGS SUBCOLLECTION
      // --------------------------------------------
      
      match /audit_logs/{logId} {
        // Admins can read audit logs
        allow read: if isTenantAdmin(tenantId);
        
        // Audit logs are write-only (created by Cloud Functions)
        allow write: if false;
      }
      
      // --------------------------------------------
      // NOTIFICATIONS SUBCOLLECTION
      // --------------------------------------------
      
      match /notifications/{notificationId} {
        // Users can read their own notifications
        allow read: if belongsToTenant(tenantId) 
                    && (resource.data.userId == request.auth.uid || resource.data.userId == 'all');
        
        // Users can update their own notifications (mark as read)
        allow update: if belongsToTenant(tenantId)
                      && resource.data.userId == request.auth.uid
                      && request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['read', 'readAt', 'dismissed', 'updatedAt']);
        
        // Admins can create notifications
        allow create: if isTenantAdmin(tenantId);
        
        // Users can delete their own notifications
        allow delete: if belongsToTenant(tenantId) 
                      && resource.data.userId == request.auth.uid;
      }
      
      // --------------------------------------------
      // REPORTS SUBCOLLECTION
      // --------------------------------------------
      
      match /reports/{reportId} {
        // All tenant members can read reports
        allow read: if belongsToTenant(tenantId);
        
        // Admins and clerks can create reports
        allow create: if belongsToTenant(tenantId) && canWrite();
        
        // Only admins can delete reports
        allow delete: if isTenantAdmin(tenantId);
        
        // Reports are immutable after creation (except status updates via Cloud Functions)
        allow update: if false;
      }
      
      // --------------------------------------------
      // SUBSCRIPTIONS SUBCOLLECTION
      // --------------------------------------------
      
      match /subscriptions/{subscriptionId} {
        // All tenant members can read subscription info
        allow read: if belongsToTenant(tenantId);
        
        // Only admins can update subscription (via Stripe webhooks)
        allow write: if false; // Managed by Cloud Functions only
        
        // Invoices subcollection
        match /invoices/{invoiceId} {
          // Admins can read invoices
          allow read: if isTenantAdmin(tenantId);
          allow write: if false; // Managed by Cloud Functions only
        }
      }
    }
    
    // ============================================
    // SYSTEM CONFIG COLLECTION (Admin-only)
    // ============================================
    
    match /system_config/{configId} {
      // Anyone can read emission factors (needed for calculations)
      allow read: if isAuthenticated();
      
      // Only super admins can write (via Cloud Functions)
      allow write: if false;
    }
    
    // ============================================
    // ONBOARDING SESSIONS COLLECTION
    // ============================================
    
    match /onboarding_sessions/{sessionId} {
      // Users can read/write their own onboarding session
      allow read, write: if isAuthenticated() 
                         && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📊 INDEXES

### Required Composite Indexes

Create these indexes in Firebase Console or via `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "lastLogin", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "role", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "tenants",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "sector", "order": "ASCENDING" },
        { "fieldPath": "totalEmissions", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "entries",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "billingDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "entries",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "entries",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "utilityType", "order": "ASCENDING" },
        { "fieldPath": "billingDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "entries",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "audit_logs",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "audit_logs",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "read", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reports",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## ☁️ CLOUD STORAGE

### Bucket Structure

```
gs://sustainchain-bills/
  ├── {tenantId}/
  │   ├── {entryId}.jpg              ← Original bill image
  │   ├── {entryId}_thumb.jpg        ← Thumbnail (200x200)
  │   └── {entryId}_metadata.json    ← EXIF/metadata

gs://sustainchain-reports/
  ├── {tenantId}/
  │   └── {reportId}.pdf             ← Generated PDF reports

gs://sustainchain-assets/
  ├── logos/
  │   └── {tenantId}_logo.png        ← Company logos
  ├── avatars/
  │   └── {userId}_avatar.jpg        ← User avatars
```

### Storage Rules (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserTenantId() {
      return request.auth.token.tenantId;
    }
    
    function belongsToTenant(tenantId) {
      return getUserTenantId() == tenantId;
    }
    
    // ============================================
    // BILLS BUCKET
    // ============================================
    
    match /sustainchain-bills/{tenantId}/{fileName} {
      // Users can read bills from their tenant
      allow read: if isAuthenticated() && belongsToTenant(tenantId);
      
      // Admins and clerks can upload bills
      allow write: if isAuthenticated() 
                   && belongsToTenant(tenantId)
                   && request.auth.token.role in ['admin', 'clerk']
                   && request.resource.size < 10 * 1024 * 1024  // 10MB limit
                   && request.resource.contentType.matches('image/.*');
    }
    
    // ============================================
    // REPORTS BUCKET
    // ============================================
    
    match /sustainchain-reports/{tenantId}/{fileName} {
      // Users can read reports from their tenant
      allow read: if isAuthenticated() && belongsToTenant(tenantId);
      
      // Only Cloud Functions can write (controlled generation)
      allow write: if false;
    }
    
    // ============================================
    // ASSETS BUCKET
    // ============================================
    
    match /sustainchain-assets/logos/{tenantId}_logo.{ext} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() 
                   && belongsToTenant(tenantId)
                   && request.auth.token.role == 'admin'
                   && request.resource.size < 2 * 1024 * 1024;  // 2MB limit
    }
    
    match /sustainchain-assets/avatars/{userId}_avatar.{ext} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() 
                   && request.auth.uid == userId
                   && request.resource.size < 1 * 1024 * 1024;  // 1MB limit
    }
  }
}
```

### Lifecycle Management

```yaml
# Cloud Storage Lifecycle Rules

Bills Bucket (sustainchain-bills):
  - Delete images older than 7 years (PDPA compliance)
  - Move to Nearline storage after 1 year (cost optimization)

Reports Bucket (sustainchain-reports):
  - Delete reports older than 1 year (unless flagged for retention)
  - Move to Coldline storage after 90 days

Assets Bucket (sustainchain-assets):
  - No automatic deletion
  - Compress images on upload (Cloud Functions trigger)
```

---

## 🔄 BIGQUERY ETL MAPPING

### Target Schema: `sustainchain.emissions` Table

```sql
CREATE TABLE `sustainchain.emissions` (
  -- Identity
  entry_id STRING NOT NULL,
  tenant_id STRING NOT NULL,
  user_id STRING,
  
  -- Tenant Info (denormalized)
  company_name STRING,
  company_sector STRING,
  company_uen STRING,
  
  -- Utility Data
  utility_type STRING,  -- electricity, water, fuel
  provider STRING,
  region STRING,  -- peninsular, sabah, sarawak
  
  -- Usage & Emissions
  usage FLOAT64,
  unit STRING,
  co2e FLOAT64,  -- kg CO2e
  emission_factor FLOAT64,
  amount FLOAT64,  -- MYR
  
  -- Dates (partitioned by billing_date)
  billing_date DATE NOT NULL,
  billing_month STRING,  -- YYYY-MM
  billing_year INT64,
  upload_date TIMESTAMP,
  
  -- Extraction Metadata
  extraction_method STRING,  -- auto, manual
  confidence FLOAT64,
  status STRING,  -- verified, pending, flagged
  
  -- Aggregation Helpers
  is_verified BOOL,
  is_anomaly BOOL,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  
  -- Sync Metadata
  firestore_doc_path STRING,
  etl_processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY billing_date
CLUSTER BY tenant_id, company_sector, utility_type
OPTIONS(
  description="SustainChain emission entries for sector benchmarking",
  require_partition_filter=true
);
```

### ETL Logic (Cloud Functions Trigger)

```typescript
// Firestore Trigger: /tenants/{tenantId}/entries/{entryId}
// On CREATE or UPDATE → Stream to BigQuery

export const syncEntryToBigQuery = functions.firestore
  .document('/tenants/{tenantId}/entries/{entryId}')
  .onWrite(async (change, context) => {
    const { tenantId, entryId } = context.params;
    
    // Skip if deleted
    if (!change.after.exists) {
      return;
    }
    
    const entry = change.after.data() as EntryDocument;
    const tenant = await getTenantData(tenantId);
    
    // Transform to BigQuery row
    const row = {
      entry_id: entryId,
      tenant_id: tenantId,
      user_id: entry.userId,
      
      company_name: tenant.name,
      company_sector: tenant.sector,
      company_uen: tenant.uen,
      
      utility_type: entry.utilityType,
      provider: entry.provider,
      region: entry.region || null,
      
      usage: entry.usage,
      unit: entry.unit,
      co2e: entry.co2e,
      emission_factor: entry.emissionFactor,
      amount: entry.amount,
      
      billing_date: entry.billingDate.toDate().toISOString().split('T')[0],
      billing_month: entry.billingDate.toDate().toISOString().substring(0, 7),
      billing_year: entry.billingDate.toDate().getFullYear(),
      upload_date: entry.uploadedAt.toDate().toISOString(),
      
      extraction_method: entry.extractionMethod,
      confidence: entry.confidence || null,
      status: entry.status,
      
      is_verified: entry.status === 'verified',
      is_anomaly: entry.isAnomaly || false,
      
      created_at: entry.createdAt.toDate().toISOString(),
      updated_at: entry.updatedAt.toDate().toISOString(),
      
      firestore_doc_path: `/tenants/${tenantId}/entries/${entryId}`,
      etl_processed_at: new Date().toISOString()
    };
    
    // Insert or update BigQuery
    await bigquery
      .dataset('sustainchain')
      .table('emissions')
      .insert([row], { raw: true });
  });
```

### Sector Benchmarking Queries

```sql
-- Monthly Sector Averages
SELECT 
  company_sector AS sector,
  billing_month,
  COUNT(DISTINCT tenant_id) AS company_count,
  AVG(co2e) AS avg_co2e,
  APPROX_QUANTILES(co2e, 100)[OFFSET(25)] AS p25,
  APPROX_QUANTILES(co2e, 100)[OFFSET(50)] AS median,
  APPROX_QUANTILES(co2e, 100)[OFFSET(75)] AS p75
FROM `sustainchain.emissions`
WHERE 
  billing_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
  AND is_verified = TRUE
GROUP BY sector, billing_month
ORDER BY billing_month DESC, sector;

-- Tenant Percentile Ranking
WITH sector_data AS (
  SELECT 
    tenant_id,
    company_sector,
    SUM(co2e) AS total_co2e
  FROM `sustainchain.emissions`
  WHERE 
    billing_month = FORMAT_DATE('%Y-%m', CURRENT_DATE())
    AND is_verified = TRUE
  GROUP BY tenant_id, company_sector
)
SELECT 
  tenant_id,
  total_co2e,
  PERCENT_RANK() OVER (
    PARTITION BY company_sector 
    ORDER BY total_co2e
  ) * 100 AS percentile
FROM sector_data
WHERE tenant_id = @target_tenant_id;
```

---

## 🚀 MIGRATION PLAN

### Phase 1: Initial Setup (Week 1)

1. **Create Firestore Collections**
   ```bash
   # Initialize collections via Cloud Console or Admin SDK
   - Create /users, /tenants, /system_config
   - Set up emission_factors document
   ```

2. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

3. **Create Indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Phase 2: Data Migration (Week 1-2)

1. **Migrate Existing `esg_reports` Collection**
   ```typescript
   // Script: migrate-reports.ts
   async function migrateReports() {
     const reports = await db.collection('esg_reports').get();
     
     for (const doc of reports.docs) {
       const data = doc.data();
       
       // Determine tenant (requires manual mapping or user input)
       const tenantId = await mapUserToTenant(data.userId);
       
       // Create entry in new structure
       await db
         .collection('tenants')
         .doc(tenantId)
         .collection('entries')
         .add({
           ...data,
           tenantId,
           extractionMethod: 'manual',  // Assume manual for old data
           status: 'verified',
           createdAt: data.createdAt || FieldValue.serverTimestamp(),
           updatedAt: FieldValue.serverTimestamp()
         });
     }
     
     // Archive old collection (don't delete yet)
     console.log('Migration complete. Review before deleting esg_reports');
   }
   ```

2. **Set Up Custom Claims**
   ```typescript
   // Script: set-custom-claims.ts
   async function setUserClaims() {
     const users = await admin.auth().listUsers();
     
     for (const user of users.users) {
       // Fetch user doc from Firestore
       const userDoc = await db.collection('users').doc(user.uid).get();
       const { tenantId, role } = userDoc.data();
       
       // Set custom claims
       await admin.auth().setCustomUserClaims(user.uid, {
         tenantId,
         role
       });
     }
   }
   ```

### Phase 3: Cloud Functions Deployment (Week 2)

1. **Entry Creation Triggers**
   - `onEntryCreate`: Update tenant aggregations, create audit log, sync to BigQuery
   - `onEntryUpdate`: Update audit log, re-sync to BigQuery
   - `onEntryDelete`: Update tenant aggregations, create audit log

2. **User Management Triggers**
   - `onUserCreate`: Send welcome email, create onboarding session
   - `onUserUpdate`: Sync custom claims if role/tenant changed

3. **Subscription Triggers**
   - `onSubscriptionUpdate`: Check usage limits, send notifications

### Phase 4: BigQuery Setup (Week 2-3)

1. **Create Dataset & Table**
   ```bash
   bq mk --dataset --location=asia-southeast1 sustainchain
   bq mk --table sustainchain.emissions emissions_schema.json
   ```

2. **Enable Streaming Inserts**
   ```typescript
   // Deploy Cloud Function: syncEntryToBigQuery
   ```

3. **Backfill Historical Data**
   ```typescript
   // Script: backfill-bigquery.ts
   async function backfillBigQuery() {
     const entries = await db.collectionGroup('entries').get();
     
     const rows = entries.docs.map(doc => transformToBigQueryRow(doc));
     
     await bigquery
       .dataset('sustainchain')
       .table('emissions')
       .insert(rows, { skipInvalidRows: true });
   }
   ```

### Phase 5: Testing & Validation (Week 3)

1. **Security Rules Testing**
   ```bash
   firebase emulators:start --only firestore
   # Run test suite: tests/security-rules.test.ts
   ```

2. **Data Integrity Checks**
   - Verify all users have custom claims
   - Confirm all entries belong to valid tenants
   - Check BigQuery row counts match Firestore

3. **Performance Testing**
   - Load test dashboard queries (1000 concurrent users)
   - Benchmark BigQuery sector queries (<5s response time)

---

## 📝 IMPLEMENTATION CHECKLIST

### Firebase Console Setup

- [ ] Create Firebase project: `sustainchain-2026`
- [ ] Enable Firestore Database (asia-southeast1)
- [ ] Enable Cloud Storage buckets:
  - [ ] `sustainchain-bills`
  - [ ] `sustainchain-reports`
  - [ ] `sustainchain-assets`
- [ ] Enable Firebase Authentication (Email, Google OAuth)
- [ ] Set up BigQuery connection
- [ ] Configure billing alerts (budget: $500/month)

### Code Implementation

- [ ] Create TypeScript interfaces (copy from schema above)
- [ ] Implement Firebase Admin SDK initialization
- [ ] Create helper functions:
  - [ ] `createTenant()`
  - [ ] `createEntry()`
  - [ ] `calculateCO2e()`
  - [ ] `generateReport()`
- [ ] Deploy Firestore Security Rules
- [ ] Deploy Cloud Storage Rules
- [ ] Deploy Cloud Functions triggers
- [ ] Create indexes (via `firestore.indexes.json`)

### Testing

- [ ] Unit tests for CO2e calculations
- [ ] Integration tests for multi-tenant isolation
- [ ] Security rules simulation tests
- [ ] Load testing (100 concurrent bill uploads)
- [ ] BigQuery query performance tests

### Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Onboarding guide for new tenants
- [ ] Admin guide for user management
- [ ] Disaster recovery procedures

---

## 🔧 MAINTENANCE & MONITORING

### Daily Tasks

- Monitor Firestore usage (read/write quotas)
- Check Cloud Functions error logs
- Verify BigQuery ETL sync status

### Weekly Tasks

- Review audit logs for suspicious activity
- Update sector benchmarks (Cloud Scheduler job)
- Check storage bucket sizes (cost optimization)

### Monthly Tasks

- Archive old audit logs (>90 days)
- Generate billing reports for tenants
- Update emission factors (if new data available)
- Security audit (cross-tenant access checks)

### Alerts to Configure

```yaml
Firestore Alerts:
  - Read operations > 1M/day
  - Write operations > 100K/day
  - Security rule violations

Cloud Storage Alerts:
  - Bucket size > 100GB
  - Unauthorized access attempts

BigQuery Alerts:
  - Query costs > $50/day
  - ETL sync failures

Authentication Alerts:
  - Failed login attempts > 10/hour
  - New user signups > 50/day (spam detection)
```

---

## 📚 REFERENCES

- [Firebase Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Multi-Tenancy in Firestore](https://firebase.google.com/docs/firestore/solutions/role-based-access)
- [BigQuery Partitioning Guide](https://cloud.google.com/bigquery/docs/partitioned-tables)
- [Malaysia PDPA Compliance](https://www.pdp.gov.my/)
- [MGTC Emission Factors](https://www.mgtc.gov.my/)

---

**END OF SCHEMA DOCUMENT**

*This schema is production-ready and aligned with PDPA compliance requirements. All collection structures support horizontal scaling to 10,000+ SME tenants.*

*For implementation questions, refer to the SustainChain technical team or consult Firebase documentation.*
