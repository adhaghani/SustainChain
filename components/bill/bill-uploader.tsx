'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { uploadBillImage, validateBillFile } from '@/lib/storage-helpers';
import { auth } from '@/lib/firebase';
import EntryReviewForm, { type ExtractedBillData } from './entry-review-form';
import { useLanguage } from '@/lib/language-context';
import { useTenantQuota } from '@/hooks/use-tenant-quota';
import { toast } from 'sonner';

type UploadState = 'idle' | 'dragover' | 'uploading' | 'analyzing' | 'review' | 'success' | 'error';

interface BillUploaderProps {
  onEntryCreated?: (entryId: string) => void;
}

export default function BillUploader({ onEntryCreated }: BillUploaderProps) {
  const { t } = useLanguage();
  const { data: quotaData, loading: quotaLoading } = useTenantQuota();
  const [state, setState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Check if quota is exceeded
  const quotaExceeded = quotaData && !quotaData.billAnalysis.unlimited && quotaData.billAnalysis.remaining === 0;
  const quotaWarning = quotaData && !quotaData.billAnalysis.unlimited && quotaData.billAnalysis.percentUsed > 80;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('dragover');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('idle');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    // Validate file
    const validation = validateBillFile(file);
    if (!validation.valid) {
      setError(validation.error || t.upload.error.invalidFile);
      setState('error');
      return;
    }

    // Check authentication
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setError(t.upload.error.signInRequired);
      setState('error');
      return;
    }

    // Get tenant ID from token claims
    const tokenResult = await currentUser.getIdTokenResult();
    const tenantId = tokenResult.claims.tenantId as string;
    const role = tokenResult.claims.role as string;
    
    // Debug logging
    console.log('🔍 Auth Debug:', {
      uid: currentUser.uid,
      email: currentUser.email,
      tenantId,
      role,
      allClaims: tokenResult.claims
    });
    
    if (!tenantId) {
      setError(t.upload.error.noTenant);
      setState('error');
      return;
    }
    
    if (!role) {
      setError(t.upload.error.noRole);
      setState('error');
      return;
    }

    setFileName(file.name);
    setCurrentFile(file);
    setState('uploading');

    // Create image preview for image files (not PDFs)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, clear any previous preview
      setImagePreview(null);
    }

    try {
      // Step 1: Upload to Firebase Storage
      console.log('📤 Uploading file:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        tenantId
      });
      
      const uploadResult = await uploadBillImage(file, tenantId);
      
      console.log('📤 Upload result:', uploadResult);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload image');
      }

      setState('analyzing');

      // Step 2: Analyze with Gemini
      const idToken = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tenantId', tenantId);
      formData.append('imageUrl', uploadResult.url || '');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle quota exceeded error specifically
        if (response.status === 429) {
          const resetDate = data.resetTime ? new Date(data.resetTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'next month';
          const errorMsg = data.message || `Monthly quota exceeded. Your quota will reset on ${resetDate}.`;
          
          toast.error('Monthly Quota Exceeded', {
            description: errorMsg,
            duration: 6000,
          });
          
          throw new Error(errorMsg);
        }
        throw new Error(data.error || t.upload.error.analyzeFailed);
      }

      // Step 3: Show review form
      setExtractedData({
        ...data.data,
        billImageUrl: uploadResult.url,
        billImageStoragePath: uploadResult.storagePath,
      });
      setState('review');

    } catch (err) {
      console.error('Error processing bill:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process bill';
      setError(errorMessage);
      setState('error');
      
      // Show toast for errors (excluding quota exceeded which is already shown)
      if (!(err instanceof Error && err.message.includes('quota exceeded'))) {
        toast.error('Upload Failed', {
          description: errorMessage,
          duration: 5000,
        });
      }
    }
  };

  const handleSave = (entryId: string) => {
    setState('success');
    toast.success('Bill Saved Successfully', {
      description: 'Your emissions entry has been recorded.',
      duration: 4000,
    });
    onEntryCreated?.(entryId);
  };

  const handleReanalyze = () => {
    if (currentFile) {
      handleFile(currentFile);
    }
  };

  const resetUploader = () => {
    setState('idle');
    setFileName('');
    setError('');
    setExtractedData(null);
    setImagePreview(null);
    setCurrentFile(null);
  };

  // Review state - show the form
  if (state === 'review' && extractedData) {
    return (
      <div className="w-full space-y-4">
        {imagePreview && (
          <div className="flex justify-center">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <img 
                src={imagePreview} 
                alt="Bill preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <EntryReviewForm
          extractedData={extractedData}
          onSave={handleSave}
          onReanalyze={handleReanalyze}
          onCancel={resetUploader}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Quota Display */}
      {!quotaLoading && quotaData && !quotaData.billAnalysis.unlimited && (
        <Alert variant={quotaExceeded ? "destructive" : quotaWarning ? "default" : "default"} 
               className={quotaExceeded ? "border-red-500 bg-red-50 dark:bg-red-500/10" : quotaWarning ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10" : "border-blue-500 bg-blue-50 dark:bg-blue-500/10"}>
          {quotaExceeded ? (
            <XCircle className="h-4 w-4 text-red-600" />
          ) : quotaWarning ? (
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-blue-600" />
          )}
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="font-semibold mb-1">
                {quotaExceeded ? "Monthly Quota Exceeded" : quotaWarning ? "Approaching Quota Limit" : "Bill Analysis Quota"}
              </p>
              <p className="text-sm">
                {quotaExceeded 
                  ? `You have used all ${quotaData.billAnalysis.limit} bill analyses for this month. Your quota resets on ${new Date(quotaData.billAnalysis.resetTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`
                  : `${quotaData.billAnalysis.current} of ${quotaData.billAnalysis.limit} used this month (${quotaData.billAnalysis.remaining} remaining)`
                }
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-30">
              <Badge variant={quotaExceeded ? "destructive" : quotaWarning ? "default" : "secondary"}>
                {quotaData.billAnalysis.current} / {quotaData.billAnalysis.limit}
              </Badge>
              <Progress 
                value={quotaData.billAnalysis.percentUsed} 
                className="h-2 w-full"
              />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error state */}
      {state === 'error' && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success state */}
      {state === 'success' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {t.upload.success.entrySavedTitle}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t.upload.success.entrySavedDesc.replace('{fileName}', fileName)}
          </p>
          <Button onClick={resetUploader} variant="outline">
            {t.upload.success.uploadAnother}
          </Button>
        </div>
      )}

      {/* Analyzing state */}
      {state === 'analyzing' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-4 animate-pulse">
            <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {t.upload.state.analyzingTitle}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {t.upload.state.analyzingDesc}
          </p>
          {imagePreview ? (
            <div className="mt-4 flex justify-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 opacity-75">
                <img src={imagePreview} alt="Bill preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
              </div>
            </div>
          ) : currentFile?.type === 'application/pdf' ? (
            <div className="mt-4 flex justify-center">
              <div className="relative w-32 h-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-75">
                <FileText className="w-12 h-12 text-slate-400" />
                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Uploading state */}
      {state === 'uploading' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Loader2 className="w-8 h-8 text-slate-600 dark:text-slate-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {t.upload.state.uploadingTitle}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">{fileName}</p>
        </div>
      )}

      {/* Idle and dragover states */}
      {(state === 'idle' || state === 'dragover' || state === 'error') && (
        <div
          onDragOver={quotaExceeded ? undefined : handleDragOver}
          onDragLeave={quotaExceeded ? undefined : handleDragLeave}
          onDrop={quotaExceeded ? undefined : handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            quotaExceeded 
              ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-50 cursor-not-allowed' 
              : state === 'dragover'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 cursor-pointer'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.heic"
            onChange={handleFileInput}
            disabled={quotaExceeded || false}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="space-y-4">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full transition-colors ${
                state === 'dragover'
                  ? 'bg-emerald-100 dark:bg-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              {state === 'dragover' ? (
                <FileText className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Upload className="w-7 h-7 text-slate-500 dark:text-slate-400" />
              )}
            </div>

            <div>
              <p className="text-slate-900 dark:text-white font-medium">
                {quotaExceeded ? (
                  'Monthly quota exceeded'
                ) : state === 'dragover' ? (
                  t.upload.placeholder.dropHere
                ) : (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {t.upload.placeholder.clickToUpload}
                    </span>{' '}
                    or drag and drop
                  </>
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {quotaExceeded 
                  ? `Quota resets on ${quotaData ? new Date(quotaData.billAnalysis.resetTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'next month'}`
                  : t.upload.supportedFormats
                }
              </p>
            </div>

            {!quotaExceeded && (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{t.upload.formats.PDF}</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{t.upload.formats.PNG}</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{t.upload.formats.JPG}</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{t.upload.formats.HEIC}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
