/**
 * Audit Logger Helper
 * Creates audit log entries for compliance and security
 */

import { db } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type {
  AuditLogDocument,
  AuditAction,
  AuditResource,
  AuditStatus,
  AuditSeverity,
  UserRole,
} from '@/types/firestore';

interface CreateAuditLogParams {
  tenantId: string;
  userId: string | null;
  userName: string;
  userEmail?: string;
  userRole?: UserRole;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  requestId?: string;
  status: AuditStatus;
  severity: AuditSeverity;
  errorMessage?: string;
  errorCode?: string;
  changeLog?: Array<{
    fieldName: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(params: CreateAuditLogParams): Promise<void> {
  const logRef = db
    .collection('tenants')
    .doc(params.tenantId)
    .collection('audit_logs')
    .doc();

  // Calculate retention period (7 years for PDPA compliance)
  const retainUntil = Timestamp.fromDate(
    new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
  );

  const auditLog: Partial<AuditLogDocument> = {
    id: logRef.id,
    tenantId: params.tenantId,
    timestamp: Timestamp.now(),
    userId: params.userId,
    userName: params.userName,
    action: params.action,
    resource: params.resource,
    details: params.details,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: params.status,
    severity: params.severity,
    retainUntil,
  };

  // Only add optional fields if they are defined
  if (params.userEmail !== undefined) auditLog.userEmail = params.userEmail;
  if (params.userRole !== undefined) auditLog.userRole = params.userRole;
  if (params.resourceId !== undefined) auditLog.resourceId = params.resourceId;
  if (params.requestId !== undefined) auditLog.requestId = params.requestId;
  if (params.errorMessage !== undefined) auditLog.errorMessage = params.errorMessage;
  if (params.errorCode !== undefined) auditLog.errorCode = params.errorCode;
  if (params.changeLog !== undefined) auditLog.changeLog = params.changeLog;

  await logRef.set(auditLog as AuditLogDocument);
}

/**
 * Create audit log for user login
 */
export async function logUserLogin(
  tenantId: string,
  userId: string,
  userName: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  await createAuditLog({
    tenantId,
    userId,
    userName,
    userEmail,
    action: 'LOGIN',
    resource: 'User',
    resourceId: userId,
    details: `User "${userName}" logged in`,
    ipAddress,
    userAgent,
    status: 'success',
    severity: 'info',
  });
}

/**
 * Create audit log for failed login attempt
 */
export async function logFailedLogin(
  email: string,
  ipAddress: string,
  userAgent: string,
  reason: string
): Promise<void> {
  // For failed logins, we don't have a tenant ID, so we could:
  // 1. Create a global audit log collection
  // 2. Skip logging (less secure)
  // 3. Try to find tenant by email and log there

  // For now, we'll log to console and implement global logging later
  console.warn('Failed login attempt:', {
    email,
    ipAddress,
    reason,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Create audit log for user logout
 */
export async function logUserLogout(
  tenantId: string,
  userId: string,
  userName: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  await createAuditLog({
    tenantId,
    userId,
    userName,
    action: 'LOGOUT',
    resource: 'User',
    resourceId: userId,
    details: `User "${userName}" logged out`,
    ipAddress,
    userAgent,
    status: 'success',
    severity: 'info',
  });
}
