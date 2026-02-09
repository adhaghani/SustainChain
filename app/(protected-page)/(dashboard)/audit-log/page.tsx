'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useAuditLogs, useAuditLogStats, formatAuditLogTimestamp } from "@/hooks/use-audit-logs";
import { useState } from "react";
import type { AuditAction, AuditStatus } from "@/types/firestore";

const AuditLogPage = () => {
  const [actionFilter, setActionFilter] = useState<string>('all-actions');
  const [statusFilter, setStatusFilter] = useState<string>('all-status');
  const [searchQuery, setSearchQuery] = useState('');

  // Build filter options
  const filterOptions = {
    action: actionFilter !== 'all-actions' ? actionFilter as AuditAction : undefined,
    status: statusFilter !== 'all-status' ? statusFilter as AuditStatus : undefined,
    limitCount: 50,
  };

  const { logs: auditLogs, loading, error, refetch } = useAuditLogs(filterOptions);
  const { stats, loading: statsLoading } = useAuditLogStats();

  // Filter logs by search query (client-side)
  const filteredLogs = searchQuery
    ? auditLogs.filter((log) =>
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : auditLogs;

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
      case "failure":
        return <Badge variant="destructive"><IconAlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "warning":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Warning</Badge>;
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExport = async () => {
    // TODO: Implement CSV/PDF export
    console.log('Export audit logs');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground mt-1">
              Track all system activities and data modifications for compliance
            </p>
          </div>
        </div>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error Loading Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button onClick={refetch} className="mt-4" variant="outline">
              <IconRefresh className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleExport}>
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
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalLogs}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 100 activities
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.successfulActions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalLogs > 0 ? ((stats.successfulActions / stats.totalLogs) * 100).toFixed(0) : 0}% success rate
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Actions</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failedActions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Changes</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.criticalChanges}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Data modifications
                </p>
              </>
            )}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
                <SelectItem value="UPLOAD">Upload</SelectItem>
                <SelectItem value="DOWNLOAD">Download</SelectItem>
                <SelectItem value="VERIFY">Verify</SelectItem>
                <SelectItem value="REJECT">Reject</SelectItem>
                <SelectItem value="GENERATE_REPORT">Generate Report</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
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
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <IconShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No audit logs found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || actionFilter !== 'all-actions' || statusFilter !== 'all-status'
                  ? 'Try adjusting your filters'
                  : 'Audit logs will appear here as activities occur'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <div key={log.id} className="relative">
                  {/* Timeline Line */}
                  {index !== filteredLogs.length - 1 && (
                    <div className="absolute left-6 top-12 h-[calc(100%+16px)] w-0.5 bg-border" />
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
                                      {log.userName === "System" ? "SYS" : getInitials(log.userName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{log.userName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconClock className="w-3 h-3" />
                                  <span>{formatAuditLogTimestamp(log.timestamp)}</span>
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
                          </div>

                          {/* User Agent - Truncated */}
                          {log.userAgent && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground truncate" title={log.userAgent}>
                                <span className="font-medium">User Agent:</span> {log.userAgent}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredLogs.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {filteredLogs.length} activities
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
          )}
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
            All activities are logged and retained for <strong>7 years</strong> as required by Malaysia&apos;s Personal Data 
            Protection Act (PDPA) and ESG reporting regulations. Audit logs are encrypted and backed up daily to ensure 
            data integrity for compliance audits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
