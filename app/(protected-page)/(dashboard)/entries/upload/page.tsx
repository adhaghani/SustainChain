import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconUpload, 
  IconCamera,
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
  IconDeviceFloppy
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadPage = () => {
  // Mock upload state - will be replaced with real state management
  const recentUploads = [
    {
      id: "1",
      fileName: "TNB_Bill_Jan2026.jpg",
      status: "processing",
      progress: 65,
      uploadedAt: "2026-01-17T15:30:00"
    },
    {
      id: "2",
      fileName: "SAJ_Water_Bill.pdf",
      status: "completed",
      extractedData: {
        provider: "SAJ",
        type: "water",
        usage: 28,
        unit: "m³",
        amount: 45.20,
        confidence: 0.89
      },
      uploadedAt: "2026-01-17T14:15:00"
    },
    {
      id: "3",
      fileName: "Fuel_Receipt_Petron.jpg",
      status: "failed",
      error: "Image quality too low. Please upload a clearer photo.",
      uploadedAt: "2026-01-17T13:45:00"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge variant="secondary"><IconLoader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case "failed":
        return <Badge variant="destructive"><IconAlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Bills</h1>
          <p className="text-muted-foreground mt-1">
            Upload utility bills for AI-powered data extraction and carbon calculation
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="w-5 h-5 text-primary" />
            AI-Powered Bill Extraction
          </CardTitle>
          <CardDescription>
            Gemini 1.5 Flash will automatically extract kWh, usage, and dates from your bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Area */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconUpload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Drop your bills here</h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse from your device
                </p>
              </div>
              <div className="flex gap-2">
                <Button>
                  <IconUpload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <Button variant="outline">
                  <IconCamera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <IconFileTypeJpg className="w-4 h-4" />
                  JPG
                </span>
                <span className="flex items-center gap-1">
                  <IconFileTypeJpg className="w-4 h-4" />
                  PNG
                </span>
                <span className="flex items-center gap-1">
                  <IconFileTypePdf className="w-4 h-4" />
                  PDF
                </span>
                <span>• Max 10MB per file</span>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <Alert>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tips for best results:</strong> Ensure the bill is well-lit, in focus, and all text is readable. 
              The AI works best with TNB, SAJ, IWK, and major fuel station receipts.
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
              <Badge variant="secondary">BHP (Electricity - Sarawak)</Badge>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="utility-type">Utility Type</Label>
              <Select>
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
              <Input id="provider" placeholder="e.g., TNB, SAJ, Petron" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="usage">Usage Amount</Label>
              <Input id="usage" type="number" placeholder="850" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kWh">kWh (Electricity)</SelectItem>
                  <SelectItem value="m3">m³ (Water/Gas)</SelectItem>
                  <SelectItem value="L">Liters (Fuel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Bill Amount (RM)</Label>
              <Input id="amount" type="number" placeholder="320.50" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billing-date">Billing Date</Label>
              <Input id="billing-date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number (Optional)</Label>
              <Input id="account-number" placeholder="12345678" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <IconDeviceFloppy className="w-4 h-4 mr-2" />
              Save Manual Entry
            </Button>
            <Button variant="outline">Clear Form</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Track the status of your bill uploads and extractions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUploads.map((upload) => (
              <Card key={upload.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* File Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {upload.fileName.endsWith('.pdf') ? (
                            <IconFileTypePdf className="w-6 h-6 text-red-500" />
                          ) : (
                            <IconFileTypeJpg className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{upload.fileName}</p>
                            {getStatusBadge(upload.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(upload.uploadedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Processing Progress */}
                      {upload.status === "processing" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Extracting data with Gemini AI...</span>
                            <span className="font-medium">{upload.progress}%</span>
                          </div>
                          <Progress value={upload.progress} className="h-1.5" />
                        </div>
                      )}

                      {/* Extracted Data */}
                      {upload.status === "completed" && upload.extractedData && (
                        <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Provider</p>
                              <div className="flex items-center gap-1">
                                {getUtilityIcon(upload.extractedData.type)}
                                <span className="font-medium">{upload.extractedData.provider}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Usage</p>
                              <p className="font-bold">{upload.extractedData.usage} {upload.extractedData.unit}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Amount</p>
                              <p className="font-bold">RM {upload.extractedData.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
                              <p className="font-bold text-green-600 dark:text-green-400">
                                {(upload.extractedData.confidence * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <IconEdit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm">
                              <IconCheck className="w-3 h-3 mr-1" />
                              Confirm & Save
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {upload.status === "failed" && (
                        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                          <div className="flex items-start gap-2">
                            <IconAlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                Extraction Failed
                              </p>
                              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                                {upload.error}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <IconUpload className="w-3 h-3 mr-1" />
                              Re-upload
                            </Button>
                            <Button size="sm" variant="outline">
                              <IconEdit className="w-3 h-3 mr-1" />
                              Manual Entry
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <Button variant="ghost" size="sm">
                      <IconX className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Batch Upload Info */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-sm">💡 Pro Tip: Batch Upload</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            You can upload multiple bills at once! Select up to 10 files and our AI will process them in parallel. 
            Perfect for uploading a month&apos;s worth of utility bills in one go.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
