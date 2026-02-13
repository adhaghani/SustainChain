'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconSearch,
  IconRefresh,
  IconDownload,
  IconShieldCheck,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconEdit,
  IconTrash,
  IconFileUpload,
  IconFileDownload,
  IconSettings,
  IconLogin,
  IconLogout,
  IconBuilding,
  IconActivity,
  IconUser,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAuditLogs, AuditLogOverview } from '@/lib/superadmin-helpers';
import { useAuth } from '@/lib/auth-context';

const SystemActivityPage = () => {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLogOverview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all-actions');
  const [statusFilter, setStatusFilter] = useState<string>('all-status');
  const [tenantFilter, setTenantFilter] = useState<string>('all-tenants');
  const [severityFilter, setSeverityFilter] = useState<string>('all-severity');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllAuditLogs(200);
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLogs();
    }
  }, [isSuperAdmin]);

  // Get unique tenants for filter
  const uniqueTenants = Array.from(new Set(logs.map(l => l.tenantId)))
    .map(id => ({ id, count: logs.filter(l => l.tenantId === id).length }));

  // Apply filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tenantId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all-actions' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'all-status' || log.status === statusFilter;
    const matchesTenant = tenantFilter === 'all-tenants' || log.tenantId === tenantFilter;
    const matchesSeverity = severityFilter === 'all-severity' || log.severity === severityFilter;
    
    return matchesSearch && matchesAction && matchesStatus && matchesTenant && matchesSeverity;
  });

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
      case "VERIFY":
        return <IconShieldCheck className="w-4 h-4 text-green-500" />;
      case "REJECT":
        return <IconAlertTriangle className="w-4 h-4 text-red-500" />;
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
      case "critical":
        return <Badge variant="destructive" className="bg-red-600">Critical</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: { toDate?: () => Date } | Date | null | undefined) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString('en-MY', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('en-MY', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
    return 'Invalid date';
  };

  const getInitials = (name: string) => {
    if(!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExport = () => {
    console.log('Export audit logs');
    // TODO: Implement CSV/PDF export
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Activity</h1>
          <p className="text-muted-foreground mt-1">
            Cross-tenant audit logs and system-wide activity monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleExport}>
            <IconDownload className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.status === 'success').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.status === 'failure').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {logs.filter(l => l.severity === 'error' || l.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tenants Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {uniqueTenants.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Chronological record of all system activities across tenants</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-50">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or details..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-37.5">
                <SelectValue placeholder="Action" />
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
                <SelectItem value="GENERATE_REPORT">Report</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32.5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32.5">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-severity">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tenantFilter} onValueChange={setTenantFilter}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tenants">All Tenants</SelectItem>
                {uniqueTenants.map(tenant => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.id} ({tenant.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
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
              <IconActivity className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No activity logs found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || actionFilter !== 'all-actions' || statusFilter !== 'all-status' || tenantFilter !== 'all-tenants' || severityFilter !== 'all-severity'
                  ? 'Try adjusting your filters'
                  : 'Activity logs will appear here as actions occur'}
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
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              {/* Header */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm">{log.action}</h4>
                                {getStatusBadge(log.status)}
                                {getSeverityBadge(log.severity)}
                                <Badge variant="outline" className="text-xs">
                                  <IconBuilding className="w-3 h-3 mr-1" />
                                  {log.tenantId.slice(0, 8)}...
                                </Badge>
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
                                  <span>{formatTimestamp(log.timestamp)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconUser className="w-3 h-3" />
                                  <span>{log.userId ? log.userId.slice(0, 8) + '...' : 'System'}</span>
                                </div>
                                {log.resource && (
                                  <div>
                                    <Badge variant="outline" className="text-xs">
                                      {log.resource}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
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
                Showing {filteredLogs.length} of {logs.length} activities
                {(searchQuery || actionFilter !== 'all-actions' || statusFilter !== 'all-status' || tenantFilter !== 'all-tenants' || severityFilter !== 'all-severity') && ' (filtered)'}
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

      {/* System Info */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <IconShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Cross-Tenant Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            This page aggregates activity logs from all tenants in the system. All actions are retained for{' '}
            <strong>7 years</strong> for compliance with PDPA and ESG reporting regulations. Logs are encrypted 
            and backed up daily.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemActivityPage;
