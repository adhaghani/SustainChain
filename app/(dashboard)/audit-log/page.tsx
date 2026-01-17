import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconSearch,
  IconDownload,
  IconRefresh,
  IconEdit,
  IconTrash,
  IconFileUpload,
  IconFileDownload,
  IconSettings,
  IconLogin,
  IconLogout,
  IconShieldCheck,
  IconClock,
  IconAlertTriangle,
  IconCheck
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuditLogPage = () => {
  // Mock audit log data - will be replaced with Firestore data
  const auditLogs = [
    {
      id: "1",
      timestamp: "2026-01-17T15:45:00",
      user: "Ahmad bin Ibrahim",
      userEmail: "ahmad@muarfurniture.com",
      action: "CREATE",
      resource: "Entry",
      resourceId: "entry-123",
      details: "Created new electricity bill entry (TNB, 850 kWh, 498.95 kg CO2e)",
      ipAddress: "103.20.45.128",
      userAgent: "Chrome 120.0 (macOS)",
      status: "success",
      severity: "info"
    },
    {
      id: "2",
      timestamp: "2026-01-17T15:30:00",
      user: "Ahmad bin Ibrahim",
      userEmail: "ahmad@muarfurniture.com",
      action: "UPLOAD",
      resource: "Bill",
      resourceId: "bill-456",
      details: "Uploaded bill image TNB_Jan2026.jpg (2.3 MB)",
      ipAddress: "103.20.45.128",
      userAgent: "Chrome 120.0 (macOS)",
      status: "success",
      severity: "info"
    },
    {
      id: "3",
      timestamp: "2026-01-17T14:20:00",
      user: "Siti Nurhaliza",
      userEmail: "siti@muarfurniture.com",
      action: "UPDATE",
      resource: "Entry",
      resourceId: "entry-122",
      details: "Modified water bill entry - changed usage from 25 m³ to 28 m³",
      ipAddress: "103.20.45.129",
      userAgent: "Safari 17.1 (iOS)",
      status: "success",
      severity: "warning"
    },
    {
      id: "4",
      timestamp: "2026-01-17T13:15:00",
      user: "Ahmad bin Ibrahim",
      userEmail: "ahmad@muarfurniture.com",
      action: "DOWNLOAD",
      resource: "Report",
      resourceId: "report-jan2026",
      details: "Downloaded ESG Report for January 2026 (PDF)",
      ipAddress: "103.20.45.128",
      userAgent: "Chrome 120.0 (macOS)",
      status: "success",
      severity: "info"
    },
    {
      id: "5",
      timestamp: "2026-01-17T12:00:00",
      user: "System",
      userEmail: "system@sustainchain.app",
      action: "AUTO_BACKUP",
      resource: "Database",
      resourceId: "backup-daily",
      details: "Automated daily backup completed (458 MB)",
      ipAddress: "Internal",
      userAgent: "Cloud Functions",
      status: "success",
      severity: "info"
    },
    {
      id: "6",
      timestamp: "2026-01-17T11:30:00",
      user: "Ahmad bin Ibrahim",
      userEmail: "ahmad@muarfurniture.com",
      action: "DELETE",
      resource: "Entry",
      resourceId: "entry-118",
      details: "Deleted duplicate fuel entry (Petron receipt)",
      ipAddress: "103.20.45.128",
      userAgent: "Chrome 120.0 (macOS)",
      status: "success",
      severity: "warning"
    },
    {
      id: "7",
      timestamp: "2026-01-17T10:45:00",
      user: "System",
      userEmail: "system@sustainchain.app",
      action: "AI_EXTRACTION",
      resource: "Bill",
      resourceId: "bill-455",
      details: "AI extraction failed - image quality too low (confidence: 45%)",
      ipAddress: "Internal",
      userAgent: "Gemini API",
      status: "failed",
      severity: "error"
    },
    {
      id: "8",
      timestamp: "2026-01-17T09:30:00",
      user: "Ahmad bin Ibrahim",
      userEmail: "ahmad@muarfurniture.com",
      action: "LOGIN",
      resource: "Authentication",
      resourceId: "session-789",
      details: "User logged in successfully",
      ipAddress: "103.20.45.128",
      userAgent: "Chrome 120.0 (macOS)",
      status: "success",
      severity: "info"
    },
    {
      id: "9",
      timestamp: "2026-01-16T18:00:00",
      user: "Ahmad bin Ibrahim",
      userEmail: "ahmad@muarfurniture.com",
      action: "UPDATE",
      resource: "Settings",
      resourceId: "settings-company",
      details: "Updated emission factor for electricity (0.587 kg CO2e/kWh)",
      ipAddress: "103.20.45.128",
      userAgent: "Chrome 120.0 (macOS)",
      status: "success",
      severity: "warning"
    },
    {
      id: "10",
      timestamp: "2026-01-16T16:30:00",
      user: "Siti Nurhaliza",
      userEmail: "siti@muarfurniture.com",
      action: "CREATE",
      resource: "User",
      resourceId: "user-004",
      details: "Invited new user: rahman@muarfurniture.com (Role: Clerk)",
      ipAddress: "103.20.45.129",
      userAgent: "Safari 17.1 (iOS)",
      status: "success",
      severity: "info"
    },
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <IconFileUpload className="w-4 h-4 text-green-500" />;
      case "UPDATE":
        return <IconEdit className="w-4 h-4 text-blue-500" />;
      case "DELETE":
        return <IconTrash className="w-4 h-4 text-red-500" />;
      case "LOGIN":
        return <IconLogin className="w-4 h-4 text-purple-500" />;
      case "LOGOUT":
        return <IconLogout className="w-4 h-4 text-gray-500" />;
      case "DOWNLOAD":
        return <IconFileDownload className="w-4 h-4 text-cyan-500" />;
      case "UPLOAD":
        return <IconFileUpload className="w-4 h-4 text-orange-500" />;
      case "AI_EXTRACTION":
        return <IconShieldCheck className="w-4 h-4 text-indigo-500" />;
      case "AUTO_BACKUP":
        return <IconSettings className="w-4 h-4 text-gray-500" />;
      default:
        return <IconSettings className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />Success</Badge>;
      case "failed":
        return <Badge variant="destructive"><IconAlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info":
        return <Badge variant="secondary">Info</Badge>;
      case "warning":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalLogs = auditLogs.length;
  const successfulActions = auditLogs.filter(log => log.status === "success").length;
  const failedActions = auditLogs.filter(log => log.status === "failed").length;
  const criticalChanges = auditLogs.filter(log => log.severity === "warning" || log.severity === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and data modifications for compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconRefresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <IconDownload className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{successfulActions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((successfulActions / totalLogs) * 100).toFixed(0)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{failedActions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{criticalChanges}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Data modifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by user, action, or details..." 
                className="pl-9"
              />
            </div>
            <Select defaultValue="all-actions">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login/Logout</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="download">Download</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="24h">
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Chronological record of all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log, index) => (
              <div key={log.id} className="relative">
                {/* Timeline Line */}
                {index !== auditLogs.length - 1 && (
                  <div className="absolute left-6.25 top-12.5 h-[calc(100%+16px)] w-0.5 bg-border" />
                )}

                {/* Log Entry */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-background relative z-10">
                    {getActionIcon(log.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            {/* Header */}
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{log.action}</h4>
                              {getStatusBadge(log.status)}
                              {getSeverityBadge(log.severity)}
                            </div>

                            {/* Details */}
                            <p className="text-sm text-muted-foreground">{log.details}</p>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src="" />
                                  <AvatarFallback className="text-xs">
                                    {log.user === "System" ? "SYS" : getInitials(log.user)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{log.user}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IconClock className="w-3 h-3" />
                                <span>{formatDateTime(log.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IconShieldCheck className="w-3 h-3" />
                                <span>{log.ipAddress}</span>
                              </div>
                              {log.resourceId && (
                                <div>
                                  <Badge variant="outline" className="text-xs">
                                    {log.resource}: {log.resourceId}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* User Agent (on hover/details) */}
                          <div className="text-xs text-muted-foreground">
                            {log.userAgent}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {auditLogs.length} of {auditLogs.length} activities
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Info */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <IconShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            PDPA Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            All activities are logged and retained for <strong>5 years</strong> as required by Malaysia&apos;s Personal Data 
            Protection Act (PDPA) and ESG reporting regulations. Audit logs are encrypted and backed up daily to ensure 
            data integrity for compliance audits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
