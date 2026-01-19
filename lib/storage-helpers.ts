'use client';

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  type UploadResult 
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface UploadBillResult {
  success: boolean;
  url?: string;
  storagePath?: string;
  error?: string;
}

/**
 * Upload a bill image to Firebase Storage
 * @param file - The image file to upload
 * @param tenantId - The tenant's ID for path isolation
 * @returns Upload result with download URL and storage path
 */
export async function uploadBillImage(
  file: File, 
  tenantId: string
): Promise<UploadBillResult> {
  if (!storage) {
    return { success: false, error: 'Firebase Storage is not configured' };
  }

  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `bills/${tenantId}/${timestamp}_${sanitizedFileName}`;
    
    // Create reference and upload
    const storageRef = ref(storage, storagePath);
    const result: UploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        tenantId,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get download URL
    const url = await getDownloadURL(result.ref);

    return {
      success: true,
      url,
      storagePath,
    };
  } catch (error) {
    console.error('Error uploading bill image:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to upload image' 
    };
  }
}

/**
 * Get a download URL for a bill image
 * @param storagePath - The path in Firebase Storage
 * @returns The download URL or null if failed
 */
export async function getBillImageUrl(storagePath: string): Promise<string | null> {
  if (!storage) {
    console.error('Firebase Storage is not configured');
    return null;
  }

  try {
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting bill image URL:', error);
    return null;
  }
}

/**
 * Delete a bill image from Firebase Storage
 * @param storagePath - The path in Firebase Storage
 * @returns true if deleted successfully, false otherwise
 */
export async function deleteBillImage(storagePath: string): Promise<boolean> {
  if (!storage) {
    console.error('Firebase Storage is not configured');
    return false;
  }

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting bill image:', error);
    return false;
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateBillFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a PDF or image file (PNG, JPG, HEIC)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  return { valid: true };
}
