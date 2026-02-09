/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces permissions based on user roles
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { getUserDocument } from "./firestore-helpers";
import type { UserRole, CustomClaims } from "@/types/firestore";

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export const PERMISSIONS = {
  // User Management
  VIEW_USERS: ["superadmin", "admin"],
  CREATE_USERS: ["superadmin", "admin"],
  UPDATE_USERS: ["superadmin", "admin"],
  DELETE_USERS: ["superadmin", "admin"],

  // Entry Management
  VIEW_ENTRIES: ["superadmin", "admin", "clerk", "viewer"],
  CREATE_ENTRIES: ["superadmin", "admin", "clerk"],
  UPDATE_OWN_ENTRIES: ["superadmin", "admin", "clerk"],
  UPDATE_ANY_ENTRIES: ["superadmin", "admin"],
  DELETE_ENTRIES: ["superadmin", "admin"],
  VERIFY_ENTRIES: ["superadmin", "admin"],

  // Report Management
  VIEW_REPORTS: ["superadmin", "admin", "clerk", "viewer"],
  GENERATE_REPORTS: ["superadmin", "admin", "clerk"],
  DELETE_REPORTS: ["superadmin", "admin"],

  // Tenant Management
  VIEW_TENANT: ["superadmin", "admin", "clerk", "viewer"],
  UPDATE_TENANT: ["superadmin", "admin"],
  VIEW_ANALYTICS: ["superadmin", "admin", "clerk", "viewer"],

  // Audit Logs
  VIEW_AUDIT_LOGS: ["superadmin", "admin"],

  // System Configuration (Superadmin only)
  VIEW_SYSTEM_CONFIG: ["superadmin"],
  UPDATE_SYSTEM_CONFIG: ["superadmin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] as readonly UserRole[];
  return (allowedRoles as UserRole[]).includes(role);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

// ============================================
// AUTH TOKEN VERIFICATION
// ============================================

/**
 * Verify Firebase ID token and extract custom claims
 */
export async function verifyAuthToken(
  request: NextRequest,
): Promise<{ uid: string; claims: CustomClaims } | null> {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify the ID token
    const decodedToken = await auth().verifyIdToken(idToken);

    // Extract custom claims
    const claims: CustomClaims = {
      role: decodedToken.role as UserRole,
      tenantId: decodedToken.tenantId as string,
      tenantName: decodedToken.tenantName as string,
    };

    // Validate custom claims exist
    if (!claims.role || !claims.tenantId) {
      console.error("Missing custom claims for user:", decodedToken.uid);
      return null;
    }

    return {
      uid: decodedToken.uid,
      claims,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Get current user with role from request
 */
export async function getCurrentUser(
  request: NextRequest,
): Promise<{ uid: string; role: UserRole; tenantId: string } | null> {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return null;
  }

  return {
    uid: auth.uid,
    role: auth.claims.role,
    tenantId: auth.claims.tenantId,
  };
}

// ============================================
// MIDDLEWARE FUNCTIONS
// ============================================

/**
 * Require authentication middleware
 */
export async function requireAuth(
  request: NextRequest,
): Promise<
  | {
      authenticated: true;
      user: { uid: string; role: UserRole; tenantId: string };
    }
  | { authenticated: false; response: NextResponse }
> {
  const user = await getCurrentUser(request);

  if (!user) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      ),
    };
  }

  return {
    authenticated: true,
    user,
  };
}

/**
 * Require specific permission middleware
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission,
): Promise<
  | {
      authorized: true;
      user: { uid: string; role: UserRole; tenantId: string };
    }
  | { authorized: false; response: NextResponse }
> {
  const authResult = await requireAuth(request);

  if (!authResult.authenticated) {
    return {
      authorized: false,
      response: authResult.response,
    };
  }

  const { user } = authResult;

  if (!hasPermission(user.role, permission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Forbidden - Insufficient permissions",
          code: "FORBIDDEN",
        },
        { status: 403 },
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}

/**
 * Require admin role middleware
 */
export async function requireAdmin(
  request: NextRequest,
): Promise<
  | {
      authorized: true;
      user: { uid: string; role: UserRole; tenantId: string };
    }
  | { authorized: false; response: NextResponse }
> {
  return requirePermission(request, "UPDATE_SYSTEM_CONFIG");
}

/**
 * Verify user belongs to tenant
 */
export async function verifyTenantAccess(
  userId: string,
  tenantId: string,
): Promise<boolean> {
  const userDoc = await getUserDocument(userId);
  if (!userDoc) {
    return false;
  }

  return userDoc.tenantId === tenantId;
}

// ============================================
// CUSTOM CLAIMS MANAGEMENT
// ============================================

/**
 * Set custom claims for a user
 */
export async function setUserCustomClaims(
  userId: string,
  claims: CustomClaims,
): Promise<void> {
  await auth().setCustomUserClaims(userId, claims);
}

/**
 * Update user role and refresh custom claims
 */
export async function updateUserRoleWithClaims(
  userId: string,
  newRole: UserRole,
): Promise<void> {
  // Get current custom claims
  const userRecord = await auth().getUser(userId);
  const currentClaims = userRecord.customClaims as CustomClaims;

  if (!currentClaims || !currentClaims.tenantId) {
    throw new Error("User does not have valid custom claims");
  }

  // Update custom claims with new role
  await auth().setCustomUserClaims(userId, {
    ...currentClaims,
    role: newRole,
  });
}

/**
 * Revoke user sessions (force re-authentication)
 */
export async function revokeUserSessions(userId: string): Promise<void> {
  await auth().revokeRefreshTokens(userId);
}
