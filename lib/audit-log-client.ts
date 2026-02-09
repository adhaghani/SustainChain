/**
 * Client-side Audit Logger Helper
 * Creates audit log entries via API endpoint
 */

import { authenticatedFetch } from './auth-helpers';
import type {
  AuditAction,
  AuditResource,
  AuditStatus,
  AuditSeverity,
} from '@/types/firestore';

interface CreateAuditLogParams {
  tenantId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details: string;
  status?: AuditStatus;
  severity?: AuditSeverity;
  errorMessage?: string;
  errorCode?: string;
  changeLog?: Array<{
    fieldName: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
}

/**
 * Create an audit log entry via API
 */
export async function createAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    const response = await authenticatedFetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        status: params.status || 'success',
        severity: params.severity || 'info',
      }),
    });

    if (!response.ok) {
      console.error('Failed to create audit log:', await response.text());
    }
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

/**
 * Helper functions for common audit log actions
 */
export const auditLog = {
  // Entry operations
  entryCreated: (tenantId: string, entryId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'CREATE',
      resource: 'Entry',
      resourceId: entryId,
      details,
      severity: 'info',
    }),

  entryUpdated: (
    tenantId: string,
    entryId: string,
    details: string,
    changeLog?: CreateAuditLogParams['changeLog']
  ) =>
    createAuditLog({
      tenantId,
      action: 'UPDATE',
      resource: 'Entry',
      resourceId: entryId,
      details,
      severity: 'warning',
      changeLog,
    }),

  entryDeleted: (tenantId: string, entryId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'DELETE',
      resource: 'Entry',
      resourceId: entryId,
      details,
      severity: 'warning',
    }),

  entryVerified: (tenantId: string, entryId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'VERIFY',
      resource: 'Entry',
      resourceId: entryId,
      details,
      severity: 'info',
    }),

  // Bill operations
  billUploaded: (tenantId: string, billId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'UPLOAD',
      resource: 'Bill',
      resourceId: billId,
      details,
      severity: 'info',
    }),

  // Report operations
  reportGenerated: (tenantId: string, reportId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'GENERATE_REPORT',
      resource: 'Report',
      resourceId: reportId,
      details,
      severity: 'info',
    }),

  reportDownloaded: (tenantId: string, reportId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'DOWNLOAD',
      resource: 'Report',
      resourceId: reportId,
      details,
      severity: 'info',
    }),

  // User operations
  userLogin: (tenantId: string) =>
    createAuditLog({
      tenantId,
      action: 'LOGIN',
      resource: 'User',
      details: 'User logged in successfully',
      severity: 'info',
    }),

  userLogout: (tenantId: string) =>
    createAuditLog({
      tenantId,
      action: 'LOGOUT',
      resource: 'User',
      details: 'User logged out',
      severity: 'info',
    }),

  // Settings operations
  settingsChanged: (
    tenantId: string,
    details: string,
    changeLog?: CreateAuditLogParams['changeLog']
  ) =>
    createAuditLog({
      tenantId,
      action: 'SETTINGS_CHANGE',
      resource: 'Settings',
      details,
      severity: 'warning',
      changeLog,
    }),

  // Export operations
  dataExported: (tenantId: string, details: string) =>
    createAuditLog({
      tenantId,
      action: 'EXPORT',
      resource: 'Entry',
      details,
      severity: 'info',
    }),
};
