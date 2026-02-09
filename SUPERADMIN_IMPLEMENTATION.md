# Superadmin Implementation Guide

## Overview

The Superadmin role provides system-level administrative access to manage all tenants, users, and system configuration across the entire SustainChain platform. This is designed for developers and system administrators who need to oversee the multi-tenant infrastructure.

---

## Architecture

### 1. **Role Definition**

The `superadmin` role is the highest privilege level in the system:

```typescript
export type UserRole = 'superadmin' | 'admin' | 'clerk' | 'viewer';
```

**Hierarchy:**
- `superadmin` - System administrator (cross-tenant access)
- `admin` - Tenant administrator
- `clerk` - Data entry user  
- `viewer` - Read-only user

### 2. **Custom Claims**

Firebase Authentication custom claims are extended to include superadmin identification:

```typescript
export interface CustomClaims {
  role: UserRole;
  tenantId: string; // 'system' for superadmins
  tenantName: string;
  isSuperAdmin?: boolean; // Flag for cross-tenant access
}
```

**For Superadmins:**
- `role: 'superadmin'`
- `tenantId: 'system'` (or null)
- `isSuperAdmin: true`

### 3. **Auth Context Enhancement**

The `AuthContext` has been updated to track superadmin status:

```typescript
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
  tenantId: string | null;
  role: 'superadmin' | 'admin' | 'clerk' | 'viewer' | null;
  isSuperAdmin: boolean; // New field
}
```

**Usage:**
```tsx
const { isSuperAdmin } = useAuth();

if (isSuperAdmin) {
  // Show superadmin features
}
```

---

## Creating a Superadmin User

### Option 1: Manual Firestore Creation

1. **Create user document** in `/users/{userId}`:

```javascript
{
  id: "user_id_here",
  email: "admin@sustainchain.com",
  name: "System Administrator",
  tenantId: "system",
  tenantName: "System",
  role: "superadmin",
  status: "active",
  entriesCreated: 0,
  reportsGenerated: 0,
  onboardingCompleted: true,
  pdpaConsentGiven: true,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  lastActivity: Timestamp.now(),
  lastLogin: null
}
```

2. **Set Firebase Auth custom claims** (using Firebase Admin SDK):

```typescript
import { auth } from 'firebase-admin';

await auth().setCustomUserClaims(userId, {
  role: 'superadmin',
  tenantId: 'system',
  tenantName: 'System',
  isSuperAdmin: true
});
```

### Option 2: API Endpoint (Recommended)

Create a secure API endpoint for superadmin creation:

```typescript
// /app/api/admin/create-superadmin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  // Verify request is from authorized source (secret key, etc.)
  const { email, name, password } = await request.json();
  
  // Create Firebase Auth user
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });
  
  // Set custom claims
  await adminAuth.setCustomUserClaims(userRecord.uid, {
    role: 'superadmin',
    tenantId: 'system',
    tenantName: 'System',
    isSuperAdmin: true,
  });
  
  // Create Firestore document
  await adminDb.collection('users').doc(userRecord.uid).set({
    id: userRecord.uid,
    email,
    name,
    tenantId: 'system',
    tenantName: 'System',
    role: 'superadmin',
    status: 'active',
    // ... other fields
  });
  
  return NextResponse.json({ success: true });
}
```

---

## System Admin Pages

### 1. **System Overview Dashboard**

**Path:** `/system-admin`

**Features:**
- Total tenants, users, entries, emissions
- Tenant status breakdown (active, trial, inactive)
- Recent activity metrics (24h logins, uploads, reports)
- System health indicators
- Quick action buttons

### 2. **Tenant Management**

**Path:** `/system-admin/tenants`

**Features:**
- View all tenants across the system
- Filter and search tenants
- View tenant details (users, entries, emissions)
- Edit tenant settings
- Suspend/activate tenants
- Delete tenants (with confirmation)

### 3. **User Management** (To be implemented)

**Path:** `/system-admin/users`

**Features:**
- View all users across all tenants
- Filter by tenant, role, status
- Edit user roles and permissions
- Disable/enable user accounts
- View user activity logs

### 4. **System Activity Logs** (To be implemented)

**Path:** `/system-admin/activity`

**Features:**
- Cross-tenant audit logs
- Filter by action, tenant, user
- Search audit trail
- Export logs for compliance

### 5. **Global Configuration** (To be implemented)

**Path:** `/system-admin/config`

**Features:**
- System-wide settings
- Feature flags management
- Emission factor updates
- Backup and maintenance controls

---

## Cross-Tenant Query Helpers

Located in `/lib/superadmin-helpers.ts`, these functions enable querying across all tenants:

### Functions Available:

#### `getAllTenants(limitCount?: number)`
Fetches all tenant documents.

```typescript
const tenants = await getAllTenants(100);
```

#### `getTenantStats()`
Returns aggregated statistics across all tenants.

```typescript
const stats = await getTenantStats();
// { totalTenants, activeTenants, totalUsers, totalEmissions, ... }
```

#### `getAllUsers(limitCount?: number)`
Fetches all user documents across all tenants.

```typescript
const users = await getAllUsers(100);
```

#### `getUsersByTenant(tenantId: string)`
Get all users for a specific tenant.

```typescript
const users = await getUsersByTenant('tenant_123');
```

#### `getAllAuditLogs(limitCount?: number)`
Fetches audit logs from all tenants.

```typescript
const logs = await getAllAuditLogs(100);
```

#### `getAllEntries(limitCount?: number)`
Fetches entries from all tenants.

```typescript
const entries = await getAllEntries(100);
```

#### `getSystemHealth()`
Comprehensive system health metrics.

```typescript
const health = await getSystemHealth();
// {
//   tenantsStatus: { total, active, trial, inactive },
//   usersStatus: { total, active, pending, inactive },
//   dataMetrics: { totalEntries, totalEmissions, ...},
//   activityMetrics: { recentLogins, recentUploads, ...}
// }
```

---

## Navigation & UI

### Sidebar Navigation

Superadmins see an additional "System Administration" section in the sidebar:

```tsx
{isSuperAdmin && (
  <NavSecondary items={data.navSuperAdmin} title="System Administration" />
)}
```

**Menu Items:**
- System Overview
- All Tenants
- All Users
- System Activity
- Global Config

### Route Protection

System admin routes are protected by a layout that checks for superadmin access:

```tsx
// /app/(protected-page)/(system-admin)/layout.tsx
export default function SystemAdminLayout({ children }) {
  const { isSuperAdmin, loading } = useAuth();
  
  if (!loading && !isSuperAdmin) {
    router.push('/dashboard'); // Redirect non-superadmins
  }
  
  if (!isSuperAdmin) return null;
  
  return <>{children}</>;
}
```

---

## Security Considerations

### 1. **Firestore Security Rules**

Update `firestore.rules` to allow superadmin access:

```javascript
match /{document=**} {
  allow read, write: if request.auth.token.isSuperAdmin == true;
}

// For tenants collection
match /tenants/{tenantId} {
  allow read: if request.auth.token.isSuperAdmin == true 
              || request.auth.token.tenantId == tenantId;
  
  allow write: if request.auth.token.isSuperAdmin == true
               || (request.auth.token.tenantId == tenantId 
                   && request.auth.token.role == 'admin');
}
```

### 2. **API Route Protection**

Verify superadmin status in API routes:

```typescript
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const decodedToken = await adminAuth.verifyIdToken(token);
  
  if (decodedToken.isSuperAdmin !== true) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with cross-tenant operation
}
```

### 3. **Audit Logging**

All superadmin actions should be logged:

```typescript
import { createAuditLog } from '@/lib/audit-logger';

await createAuditLog({
  tenantId: 'system',
  userId: superadminId,
  userName: superadminName,
  action: 'UPDATE',
  resource: 'Tenant',
  resourceId: tenantId,
  details: `Superadmin updated tenant ${tenantName}`,
  status: 'success',
  severity: 'warning',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

---

## Best Practices

### 1. **Limited Superadmin Accounts**
- Create only necessary superadmin accounts
- Use strong authentication (2FA recommended)
- Regularly audit superadmin activity

### 2. **Tenant Isolation**
- Superadmins bypass tenant isolation
- Always verify tenant context before operations
- Log all cross-tenant access

### 3. **Data Privacy**
- Respect PDPA compliance even with cross-tenant access
- Mask sensitive data when displaying to superadmins
- Maintain audit trail of all data access

### 4. **Performance**
- Cross-tenant queries can be expensive
- Implement pagination for large datasets
- Cache system-wide statistics when possible

### 5. **Emergency Access**
- Document emergency superadmin credentials
- Store in secure location (password manager, vault)
- Rotate credentials regularly

---

## Testing

### Testing Superadmin Features

1. **Create test superadmin:**
```typescript
// Create via Firebase Console or script
const testSuperadmin = {
  email: 'test-superadmin@example.com',
  password: 'StrongP@ssw0rd',
  role: 'superadmin',
  tenantId: 'system',
};
```

2. **Test cross-tenant access:**
```typescript
// Should see all tenants
const tenants = await getAllTenants();
expect(tenants.length).toBeGreaterThan(0);

// Should access any tenant's data
const tenant1Users = await getUsersByTenant('tenant_1');
const tenant2Users = await getUsersByTenant('tenant_2');
```

3. **Test route protection:**
```typescript
// Non-superadmin should not access /system-admin
// Should redirect to /dashboard
```

4. **Test navigation:**
```typescript
// Superadmin should see "System Administration" sidebar section
// Regular admin should not see it
```

---

## Troubleshooting

### Issue: "User can't access /system-admin"

**Solution:**
1. Verify custom claims in Firebase Auth
2. Check `isSuperAdmin` flag in auth context
3. Ensure Firestore document has `role: 'superadmin'`
4. Refresh ID token: `await user.getIdToken(true)`

### Issue: "Cross-tenant queries return empty"

**Solution:**
1. Check Firestore security rules
2. Verify superadmin has `isSuperAdmin: true` in custom claims
3. Check composite indexes are created for queries

### Issue: "Superadmin can't see system navigation"

**Solution:**
1. Verify `useAuth()` returns `isSuperAdmin: true`
2. Check sidebar conditional rendering
3. Clear cache and reload

---

## Future Enhancements

- [ ] Two-factor authentication for superadmins
- [ ] Bulk operations (suspend multiple tenants, etc.)
- [ ] Advanced analytics and reporting
- [ ] System backup and restore functionality
- [ ] Email notifications for critical system events
- [ ] Automated tenant health checks
- [ ] Superadmin action approval workflow
- [ ] System resource usage monitoring

---

## Related Files

- `/types/firestore.ts` - Type definitions
- `/lib/auth-context.tsx` - Authentication context
- `/lib/superadmin-helpers.ts` - Cross-tenant query functions
- `/app/(protected-page)/(system-admin)/` - System admin pages
- `/components/app-sidebar.tsx` - Navigation sidebar
- `firestore.rules` - Security rules

---

## Support

For questions or issues with superadmin implementation, contact the development team or refer to the project documentation.

**Last Updated:** February 9, 2026
