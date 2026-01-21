'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { debugTokenClaims } from '@/lib/refresh-token';
import { Bug } from 'lucide-react';

export function DebugTokenButton() {
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleDebug = async () => {
    await debugTokenClaims();
    setDebugInfo('Check browser console for detailed token information');
    setTimeout(() => setDebugInfo(''), 5000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDebug}
        className="gap-2"
      >
        <Bug className="h-4 w-4" />
        Debug Token
      </Button>
      {debugInfo && (
        <Alert className="mt-2 max-w-sm">
          <AlertDescription>{debugInfo}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
