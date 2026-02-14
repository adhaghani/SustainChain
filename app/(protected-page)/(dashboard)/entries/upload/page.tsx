"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BillUploader from "@/components/bill/bill-uploader";
import ManualEntryDialog from "@/components/bill/manual-entry-dialog";
import {
  IconCheck,
  IconInfoCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { useLanguage } from "@/lib/language-context";
import { useTenantQuota } from "@/hooks/use-tenant-quota";
import { toast } from "sonner";

const UploadPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [recentEntryId, setRecentEntryId] = useState<string | null>(null);
  const { data: quotaData, loading: quotaLoading } = useTenantQuota();

  // Redirect if quota exceeded
  useEffect(() => {
    if (!quotaLoading && quotaData) {
      const quotaExceeded = !quotaData.billAnalysis.unlimited && quotaData.billAnalysis.remaining === 0;
      
      if (quotaExceeded) {
        const resetDate = new Date(quotaData.billAnalysis.resetTime).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        
        toast.error("Monthly Quota Exceeded", {
          description: `You have used all ${quotaData.billAnalysis.limit} bill analyses for this month. Your quota resets on ${resetDate}.`,
          duration: 5000,
        });
        
        // Redirect to entries page
        router.push('/entries');
      }
    }
  }, [quotaData, quotaLoading, router]);

  // Show loading state while checking quota
  if (quotaLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking quota...</p>
        </div>
      </div>
    );
  }

  const handleEntryCreated = (entryId: string) => {
    setRecentEntryId(entryId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.pages.uploadBills.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.pages.uploadBills.subtitle}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/entries")}>
          {t.dashboard.pages.dashboard.viewAllEntries}
        </Button>
      </div>

      {/* Success Alert for Recent Entry */}
      {recentEntryId && (
        <Alert className="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t.manualEntry.success.saved}{" "}
            <a href={`/entries`} className="underline font-medium">
              {t.manualEntry.success.viewEntries}
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Zone - Using Real BillUploader Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="w-5 h-5 text-primary" />
            AI-Powered Bill Extraction
          </CardTitle>
          <CardDescription>
            Gemini 1.5 Flash will automatically extract kWh, usage, and dates
            from your bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Real Bill Uploader Component */}
          <BillUploader onEntryCreated={handleEntryCreated} />

          {/* Info Alert */}
          <Alert>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tips for best results:</strong> Ensure the bill is
              well-lit, in focus, and all text is readable. The AI works best
              with TNB, SAJ, IWK, and major fuel station receipts.
            </AlertDescription>
          </Alert>

          {/* Supported Providers */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Supported Providers</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">TNB (Electricity)</Badge>
              <Badge variant="secondary">SAJ (Water)</Badge>
              <Badge variant="secondary">IWK (Sewerage)</Badge>
              <Badge variant="secondary">Petron (Fuel)</Badge>
              <Badge variant="secondary">Shell (Fuel)</Badge>
              <Badge variant="secondary">Petronas (Fuel)</Badge>
              <Badge variant="secondary">SEB (Electricity - Sarawak)</Badge>
              <Badge variant="secondary">SESB (Electricity - Sabah)</Badge>
            </div>
          </div>

          {/* Manual Entry Dialog */}
          <div className="pt-2 border-t flex justify-center">
            <ManualEntryDialog onEntryCreated={handleEntryCreated} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
