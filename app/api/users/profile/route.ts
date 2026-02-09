/**
 * User Profile API
 * PATCH - Update user profile information
 */

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { updateUserProfile, getUserDocument } from "@/lib/firestore-helpers";

// ============================================
// PATCH /api/users/profile
// Update user profile
// ============================================
export async function PATCH(request: NextRequest) {
  try {
    // 1. Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const userId = decodedToken.uid;

    // 2. Parse request body
    const body = await request.json();
    const { displayName, phone, jobTitle, photoURL } = body;

    // 3. Validate input
    if (!displayName || typeof displayName !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Display name is required and must be a string",
        },
        { status: 400 },
      );
    }

    if (displayName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Display name must be at least 2 characters" },
        { status: 400 },
      );
    }

    if (phone && typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone must be a string" },
        { status: 400 },
      );
    }

    if (jobTitle && typeof jobTitle !== "string") {
      return NextResponse.json(
        { success: false, error: "Job title must be a string" },
        { status: 400 },
      );
    }

    // 4. Update Firestore user document using helper
    await updateUserProfile(userId, {
      name: displayName.trim(),
      ...(phone !== undefined && { phone: phone.trim() || null }),
      ...(jobTitle !== undefined && { jobTitle: jobTitle.trim() || null }),
      ...(photoURL !== undefined && { avatar: photoURL || null }),
    });

    // 5. Update Firebase Auth display name if changed
    if (displayName.trim()) {
      await adminAuth.updateUser(userId, {
        displayName: displayName.trim(),
        ...(photoURL !== undefined && { photoURL: photoURL || null }),
      });
    }

    // 6. Fetch updated user document
    const userData = await getUserDocument(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: userId,
          name: userData?.name,
          email: userData?.email,
          phone: userData?.phone,
          jobTitle: userData?.jobTitle,
          avatar: userData?.avatar,
          updatedAt: userData?.updatedAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
