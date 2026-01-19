'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uploadBillImage, validateBillFile } from '@/lib/storage-helpers';
import { auth } from '@/lib/firebase';
import EntryReviewForm, { type ExtractedBillData } from './entry-review-form';

type UploadState = 'idle' | 'dragover' | 'uploading' | 'analyzing' | 'review' | 'success' | 'error';

interface BillUploaderProps {
  onEntryCreated?: (entryId: string) => void;
}

export default function BillUploader({ onEntryCreated }: BillUploaderProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

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
      setError(validation.error || 'Invalid file');
      setState('error');
      return;
    }

    // Check authentication
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setError('Please sign in to upload bills');
      setState('error');
      return;
    }

    // Get tenant ID from token claims
    const tokenResult = await currentUser.getIdTokenResult();
    const tenantId = tokenResult.claims.tenantId as string;
    
    if (!tenantId) {
      setError('No tenant associated with your account');
      setState('error');
      return;
    }

    setFileName(file.name);
    setCurrentFile(file);
    setState('uploading');

    // Create image preview for non-PDF files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      // Step 1: Upload to Firebase Storage
      const uploadResult = await uploadBillImage(file, tenantId);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload image');
      }

      setState('analyzing');

      // Step 2: Analyze with Gemini
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tenantId', tenantId);
      formData.append('imageUrl', uploadResult.url || '');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze bill');
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
      setError(err instanceof Error ? err.message : 'Failed to process bill');
      setState('error');
    }
  };

  const handleSave = (entryId: string) => {
    setState('success');
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
    <div className="w-full">
      {/* Error state */}
      {state === 'error' && (
        <Alert variant="destructive" className="mb-4 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20">
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
            Entry Saved Successfully!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Your bill &quot;{fileName}&quot; has been processed and saved.
          </p>
          <Button onClick={resetUploader} variant="outline">
            Upload Another Bill
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
            Gemini AI is analyzing your bill...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Extracting energy usage, calculating CO2 emissions, and generating insights.
          </p>
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 opacity-75">
                <img src={imagePreview} alt="Bill preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploading state */}
      {state === 'uploading' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Loader2 className="w-8 h-8 text-slate-600 dark:text-slate-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Uploading...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">{fileName}</p>
        </div>
      )}

      {/* Idle and dragover states */}
      {(state === 'idle' || state === 'dragover' || state === 'error') && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            state === 'dragover'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/30'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.heic"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                {state === 'dragover' ? (
                  'Drop your bill here'
                ) : (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </>
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                TNB, SAJ, IWK, SESB, SEB bills • PDF or images up to 10MB
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">PDF</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">PNG</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">JPG</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">HEIC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
