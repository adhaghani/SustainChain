/**
 * Superadmin Helper Functions
 * Cross-tenant operations for system administrators
 */

import { collection, query, getDocs, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// TENANT MANAGEMENT
// ============================================

export interface TenantOverview {
  id: string;
  name: string;
  uen: string;
  sector: string;
  status: string;
  subscriptionTier: string;
  userCount: number;
  totalEntries: number;
  totalEmissions: number;
  createdAt: Timestamp;
  lastActivity: Timestamp;
}

/**
 * Fetch all tenants in the system
 */
export async function getAllTenants(limitCount?: number): Promise<TenantOverview[]> {
  if (!db) throw new Error('Firebase not initialized');

  const tenantsRef = collection(db, 'tenants');
  let q = query(tenantsRef, orderBy('createdAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as TenantOverview));
}

/**
 * Get tenant statistics
 */
export async function getTenantStats() {
  if (!db) throw new Error('Firebase not initialized');

  const tenants = await getAllTenants();

  return {
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.status === 'active').length,
    trialTenants: tenants.filter(t => t.status === 'trial').length,
    inactiveTenants: tenants.filter(t => t.status === 'inactive' || t.status === 'suspended').length,
    totalUsers: tenants.reduce((sum, t) => sum + t.userCount, 0),
    totalEntries: tenants.reduce((sum, t) => sum + t.totalEntries, 0),
    totalEmissions: tenants.reduce((sum, t) => sum + t.totalEmissions, 0),
  };
}

// ============================================
// USER MANAGEMENT
// ============================================

export interface UserOverview {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenantName: string;
  role: string;
  status: string;
  lastLogin: Timestamp | null;
  createdAt: Timestamp;
}

/**
 * Fetch all users across all tenants
 */
export async function getAllUsers(limitCount?: number): Promise<UserOverview[]> {
  if (!db) throw new Error('Firebase not initialized');

  const usersRef = collection(db, 'users');
  let q = query(usersRef, orderBy('createdAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as UserOverview));
}

/**
 * Get users for a specific tenant
 */
export async function getUsersByTenant(tenantId: string): Promise<UserOverview[]> {
  if (!db) throw new Error('Firebase not initialized');

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('tenantId', '==', tenantId), orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as UserOverview));
}

// ============================================
// AUDIT LOGS (CROSS-TENANT)
// ============================================

export interface AuditLogOverview {
  id: string;
  tenantId: string;
  timestamp: Timestamp;
  userId: string | null;
  userName: string;
  action: string;
  resource: string;
  status: string;
  severity: string;
  details: string;
}

/**
 * Fetch recent audit logs across all tenants
 */
export async function getAllAuditLogs(limitCount: number = 100): Promise<AuditLogOverview[]> {
  if (!db) throw new Error('Firebase not initialized');

  // Note: This requires a composite index on collection group
  // Alternatively, we can query each tenant's audit logs individually
  
  const tenants = await getAllTenants();
  const allLogs: AuditLogOverview[] = [];

  // Fetch logs from each tenant (parallel)
  const logPromises = tenants.map(async (tenant) => {
    if (!db) return [];
    const logsRef = collection(db, 'tenants', tenant.id, 'audit_logs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(20));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      tenantId: tenant.id,
      ...doc.data(),
    } as AuditLogOverview));
  });

  const results = await Promise.all(logPromises);
  results.forEach(logs => allLogs.push(...logs));

  // Sort by timestamp and limit
  allLogs.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
  return allLogs.slice(0, limitCount);
}

// ============================================
// ENTRIES (CROSS-TENANT)
// ============================================

export interface EntryOverview {
  id: string;
  tenantId: string;
  utilityType: string;
  provider: string;
  usage: number;
  amount: number;
  co2e: number;
  status: string;
  extractionMethod: string;
  createdAt: Timestamp;
}

/**
 * Get recent entries across all tenants
 */
export async function getAllEntries(limitCount: number = 100): Promise<EntryOverview[]> {
  if (!db) throw new Error('Firebase not initialized');

  const tenants = await getAllTenants();
  const allEntries: EntryOverview[] = [];

  // Fetch entries from each tenant (parallel)
  const entryPromises = tenants.map(async (tenant) => {
    if (!db) return [];
    const entriesRef = collection(db, 'tenants', tenant.id, 'entries');
    const q = query(entriesRef, orderBy('createdAt', 'desc'), limit(20));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      tenantId: tenant.id,
      ...doc.data(),
    } as EntryOverview));
  });

  const results = await Promise.all(entryPromises);
  results.forEach(entries => allEntries.push(...entries));

  // Sort by timestamp and limit
  allEntries.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return allEntries.slice(0, limitCount);
}

// ============================================
// SYSTEM HEALTH
// ============================================

export interface SystemHealth {
  tenantsStatus: {
    total: number;
    active: number;
    trial: number;
    inactive: number;
  };
  usersStatus: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
  };
  dataMetrics: {
    totalEntries: number;
    totalEmissions: number;
    entriesThisMonth: number;
    emissionsThisMonth: number;
  };
  activityMetrics: {
    recentLogins: number;
    recentUploads: number;
    recentReports: number;
  };
}

/**
 * Get system-wide health metrics
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  if (!db) throw new Error('Firebase not initialized');

  const [tenants, users, entries] = await Promise.all([
    getAllTenants(),
    getAllUsers(),
    getAllEntries(1000),
  ]);

  // Calculate date ranges
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const entriesThisMonth = entries.filter(e => 
    e.createdAt.toDate() >= firstDayOfMonth
  );

  return {
    tenantsStatus: {
      total: tenants.length,
      active: tenants.filter(t => t.status === 'active').length,
      trial: tenants.filter(t => t.status === 'trial').length,
      inactive: tenants.filter(t => t.status === 'inactive' || t.status === 'suspended').length,
    },
    usersStatus: {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      inactive: users.filter(u => u.status === 'inactive').length,
    },
    dataMetrics: {
      totalEntries: entries.length,
      totalEmissions: entries.reduce((sum, e) => sum + e.co2e, 0),
      entriesThisMonth: entriesThisMonth.length,
      emissionsThisMonth: entriesThisMonth.reduce((sum, e) => sum + e.co2e, 0),
    },
    activityMetrics: {
      recentLogins: users.filter(u => 
        u.lastLogin && u.lastLogin.toDate() >= new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      recentUploads: entriesThisMonth.length,
      recentReports: 0, // TODO: Implement when reports collection exists
    },
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is superadmin
 */
export function isSuperAdmin(role: string, tenantId: string): boolean {
  return role === 'superadmin' || tenantId === 'system';
}
