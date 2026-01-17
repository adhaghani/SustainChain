'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type UploadState = 'idle' | 'dragover' | 'uploading' | 'analyzing' | 'success' | 'error';

export default function BillUploader() {
  const [state, setState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

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
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (PNG, JPG)');
      setState('error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setState('error');
      return;
    }

    setFileName(file.name);
    setState('uploading');

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setState('analyzing');

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setState('success');
  };

  const resetUploader = () => {
    setState('idle');
    setFileName('');
    setError('');
  };

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
            Analysis Complete!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Your bill &quot;{fileName}&quot; has been processed successfully.
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
            Gemini AI is analyzing your Malaysian utility bill...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Extracting energy usage, calculating CO2 emissions, and generating ESG insights.
          </p>
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
            accept=".pdf,.png,.jpg,.jpeg"
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
                TNB, Sarawak Energy, SESB bills • PDF or images up to 10MB
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">PDF</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">PNG</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">JPG</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
