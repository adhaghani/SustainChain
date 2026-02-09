/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import BillUploader from "@/components/bill/bill-uploader";
import { useRecentEntries } from "@/hooks/use-entries";
import { useAuth } from "@/lib/auth-context";
import {
  IconUpload,
  IconFileTypePdf,
  IconFileTypeJpg,
  IconX,
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconBolt,
  IconDroplet,
  IconGasStation,
  IconLoader2,
  IconSparkles,
  IconEdit,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [recentEntryId, setRecentEntryId] = useState<string | null>(null);
  const {
    entries: recentEntries,
    loading: entriesLoading,
    error: entriesError,
    refetch,
  } = useRecentEntries();

  // Manual entry form state
  const [manualEntry, setManualEntry] = useState({
    utilityType: "",
    provider: "",
    usage: "",
    unit: "",
    amount: "",
    billingDate: "",
    accountNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleManualSubmit = async () => {
    try {
      setIsSubmitting(true);
      setManualError(null);
      setManualSuccess(false);

      // Validate required fields
      if (
        !manualEntry.utilityType ||
        !manualEntry.usage ||
        !manualEntry.unit ||
        !manualEntry.amount ||
        !manualEntry.billingDate
      ) {
        setManualError("Please fill in all required fields");
        return;
      }

      // Get user token
      if (!user) {
        setManualError("You must be logged in to create entries");
        return;
      }

      const token = await user.getIdToken();

      // Prepare entry data
      const entryData = {
        utilityType: manualEntry.utilityType,
        provider: manualEntry.provider || "Manual Entry",
        usage: parseFloat(manualEntry.usage),
        unit: manualEntry.unit,
        amount: parseFloat(manualEntry.amount),
        currency: "MYR",
        billingDate: new Date(manualEntry.billingDate).toISOString(),
        accountNumber: manualEntry.accountNumber || undefined,
        extractionMethod: "manual",
        notes: "Manually entered data",
      };

      // Call API to create entry
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create entry");
      }

      // Success!
      setManualSuccess(true);
      setRecentEntryId(result.entry.id);

      // Clear form
      setManualEntry({
        utilityType: "",
        provider: "",
        usage: "",
        unit: "",
        amount: "",
        billingDate: "",
        accountNumber: "",
      });

      // Refetch entries
      refetch();

      // Clear success message after 5 seconds
      setTimeout(() => setManualSuccess(false), 5000);
    } catch (error) {
      console.error("Error creating manual entry:", error);
      setManualError(
        error instanceof Error ? error.message : "Failed to create entry",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setManualEntry({
      utilityType: "",
      provider: "",
      usage: "",
      unit: "",
      amount: "",
      billingDate: "",
      accountNumber: "",
    });
    setManualError(null);
    setManualSuccess(false);
  };

  const handleEntryCreated = (entryId: string) => {
    setRecentEntryId(entryId);
    // Refetch entries to show the new one
    refetch();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-green-500">
            <IconCheck className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <IconLoader2 className="w-3 h-3 mr-1 animate-spin" />
            Pending
          </Badge>
        );
      case "flagged":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600"
          >
            <IconAlertTriangle className="w-3 h-3 mr-1" />
            Flagged
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <IconX className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return <IconBolt className="w-4 h-4 text-yellow-500" />;
      case "water":
        return <IconDroplet className="w-4 h-4 text-cyan-500" />;
      case "fuel":
        return <IconGasStation className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return "N/A";
    // Handle both Firebase Admin and Client SDK Timestamp types
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString("en-MY", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    // Fallback for regular Date objects
    return new Date(timestamp).toLocaleString("en-MY", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileName = (billImageUrl?: string) => {
    if (!billImageUrl) return "Bill Upload";
    const parts = billImageUrl.split("/");
    return parts[parts.length - 1] || "Bill Upload";
  };

  const getFileExtension = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ext || "jpg";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Bills</h1>
          <p className="text-muted-foreground mt-1">
            Upload utility bills for AI-powered data extraction and carbon
            calculation
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/entries")}>
          View All Entries
        </Button>
      </div>

      {/* Success Alert for Recent Entry */}
      {recentEntryId && (
        <Alert className="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Entry saved successfully!{" "}
            <a href={`/entries`} className="underline font-medium">
              View in entries list
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
        </CardContent>
      </Card>

      {/* Manual Entry Option */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Data Entry</CardTitle>
          <CardDescription>
            If AI extraction fails or for custom entries, enter data manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Alert */}
          {manualSuccess && (
            <Alert className="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20">
              <IconCheck className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Manual entry saved successfully! Your data has been recorded.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {manualError && (
            <Alert variant="destructive">
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>{manualError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="utility-type">
                Utility Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={manualEntry.utilityType}
                onValueChange={(value) =>
                  setManualEntry({ ...manualEntry, utilityType: value })
                }
              >
                <SelectTrigger id="utility-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="fuel">Fuel/Diesel</SelectItem>
                  <SelectItem value="gas">Natural Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                placeholder="e.g., TNB, SAJ, Petron"
                value={manualEntry.provider}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, provider: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="usage">
                Usage Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="usage"
                type="number"
                placeholder="850"
                value={manualEntry.usage}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, usage: e.target.value })
                }
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <Select
                value={manualEntry.unit}
                onValueChange={(value) =>
                  setManualEntry({ ...manualEntry, unit: value })
                }
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kWh">kWh (Electricity)</SelectItem>
                  <SelectItem value="m³">m³ (Water/Gas)</SelectItem>
                  <SelectItem value="L">Liters (Fuel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Bill Amount (RM) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="320.50"
                value={manualEntry.amount}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, amount: e.target.value })
                }
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billing-date">
                Billing Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="billing-date"
                type="date"
                value={manualEntry.billingDate}
                onChange={(e) =>
                  setManualEntry({
                    ...manualEntry,
                    billingDate: e.target.value,
                  })
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number (Optional)</Label>
              <Input
                id="account-number"
                placeholder="12345678"
                value={manualEntry.accountNumber}
                onChange={(e) =>
                  setManualEntry({
                    ...manualEntry,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleManualSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <IconDeviceFloppy className="w-4 h-4 mr-2" />
                  Save Manual Entry
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearForm}
              disabled={isSubmitting}
            >
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>
            Track the status of your bill uploads and extractions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entriesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : entriesError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load recent entries. Please try again.
              </AlertDescription>
            </Alert>
          ) : recentEntries.length === 0 ? (
            <div className="text-center py-12">
              <IconUpload className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No entries yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Upload your first bill to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => {
                const fileName = getFileName(entry.billImageUrl || "");
                const fileExt = getFileExtension(fileName);

                return (
                  <Card key={entry.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* File Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              {fileExt === "pdf" ? (
                                <IconFileTypePdf className="w-6 h-6 text-red-500" />
                              ) : (
                                <IconFileTypeJpg className="w-6 h-6 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">
                                  {fileName}
                                </p>
                                {getStatusBadge(entry.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(entry.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Processing State */}
                          {entry.status === "pending" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Extracting data with Gemini AI...
                                </span>
                              </div>
                              <Progress value={50} className="h-1.5" />
                            </div>
                          )}

                          {/* Extracted Data */}
                          {(entry.status === "verified" ||
                            entry.extractionMethod === "auto") && (
                            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Provider
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {getUtilityIcon(entry.utilityType)}
                                    <span className="font-medium">
                                      {entry.provider}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Usage
                                  </p>
                                  <p className="font-bold">
                                    {entry.usage} {entry.unit}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Amount
                                  </p>
                                  <p className="font-bold">
                                    {entry.currency} {entry.amount.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    CO2e
                                  </p>
                                  <p className="font-bold text-green-600 dark:text-green-400">
                                    {entry.co2e.toFixed(2)} kg
                                  </p>
                                </div>
                                {entry.confidence && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      AI Confidence
                                    </p>
                                    <p className="font-bold text-green-600 dark:text-green-400">
                                      {(entry.confidence * 100).toFixed(0)}%
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/entries`)}
                                >
                                  <IconEdit className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Flagged/Rejected Status */}
                          {(entry.status === "flagged" ||
                            entry.status === "rejected") && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                              <div className="flex items-start gap-2">
                                <IconAlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                    {entry.status === "flagged"
                                      ? "Needs Review"
                                      : "Entry Rejected"}
                                  </p>
                                  <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                                    {entry.notes ||
                                      "This entry requires manual verification"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/entries`)}
                                >
                                  <IconEdit className="w-3 h-3 mr-1" />
                                  Review Entry
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push("/entries")}
                        >
                          <IconCheck className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
