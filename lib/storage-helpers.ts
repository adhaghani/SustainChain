'use client';

import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  type UploadTask
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

  return new Promise((resolve) => {
    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `sustainchain-bills/${tenantId}/${timestamp}_${sanitizedFileName}`;
      
      console.log('🗄️ Storage upload attempt:', {
        storagePath,
        fileType: file.type,
        fileSize: file.size,
        tenantId
      });
      
      // Create reference and metadata
      const storageRef = ref(storage, storagePath);
      const metadata = {
        contentType: file.type,
        customMetadata: {
          tenantId,
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      };
      
      // Start resumable upload
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      // Listen for state changes, errors, and completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`📊 Upload is ${progress.toFixed(1)}% done`);
          
          switch (snapshot.state) {
            case 'paused':
              console.log('⏸️ Upload is paused');
              break;
            case 'running':
              console.log('🏃 Upload is running');
              break;
          }
        },
        (error) => {
          // Handle errors with detailed messages
          console.error('❌ Upload error:', error);
          
          let errorMessage = 'Failed to upload image';
          
          switch (error.code) {
            case 'storage/unauthorized':
              errorMessage = 'Permission denied. Please sign out and sign back in, then try again.';
              console.error('🔒 Authorization error - Check if custom claims (role, tenantId) are set on your token');
              break;
            case 'storage/canceled':
              errorMessage = 'Upload was canceled';
              break;
            case 'storage/unknown':
              errorMessage = 'Unknown error occurred during upload';
              console.error('Server response:', error);
              break;
            case 'storage/object-not-found':
              errorMessage = 'File not found';
              break;
            case 'storage/quota-exceeded':
              errorMessage = 'Storage quota exceeded';
              break;
            case 'storage/unauthenticated':
              errorMessage = 'User is not authenticated';
              break;
            default:
              errorMessage = error.message;
          }
          
          resolve({
            success: false,
            error: errorMessage,
          });
        },
        async () => {
          // Upload completed successfully
          console.log('✅ Upload completed successfully');
          
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('📎 Download URL obtained:', url);
            
            resolve({
              success: true,
              url,
              storagePath,
            });
          } catch (error) {
            console.error('❌ Error getting download URL:', error);
            resolve({
              success: false,
              error: 'Upload succeeded but failed to get download URL',
            });
          }
        }
      );
    } catch (error) {
      console.error('❌ Error setting up upload:', error);
      resolve({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize upload',
      });
    }
  });
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
