'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconUsers,
  IconBuilding,
  IconDatabase,
  IconChartBar,
  IconRefresh,
  IconAlertTriangle,
  IconBolt,
} from "@tabler/icons-react";
import { getSystemHealth, SystemHealth } from '@/lib/superadmin-helpers';
import { useAuth } from '@/lib/auth-context';

const SystemAdminDashboard = () => {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const health = await getSystemHealth();
      setSystemHealth(health);
    } catch (err) {
      console.error('Error fetching system health:', err);
      setError('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchData();
    }
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground mt-1">
            Cross-tenant overview and system management
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Status Banner */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <p className="font-semibold">System Status: Operational</p>
              <p className="text-sm text-muted-foreground">All services running normally</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tenant Overview</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconBuilding className="w-4 h-4" />
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{systemHealth?.tenantsStatus.total || 0}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="default" className="bg-green-500 text-xs">
                      {systemHealth?.tenantsStatus.active || 0} Active
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {systemHealth?.tenantsStatus.trial || 0} Trial
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconUsers className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{systemHealth?.usersStatus.total || 0}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {systemHealth?.usersStatus.active || 0} active, {systemHealth?.usersStatus.pending || 0} pending
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconDatabase className="w-4 h-4" />
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{systemHealth?.dataMetrics.totalEntries || 0}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {systemHealth?.dataMetrics.entriesThisMonth || 0} this month
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconChartBar className="w-4 h-4" />
                Total Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {systemHealth?.dataMetrics.totalEmissions.toFixed(0) || 0} kg
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    CO2e tracked
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity (24h)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconBolt className="w-4 h-4 text-green-500" />
                Recent Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {systemHealth?.activityMetrics.recentLogins || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconDatabase className="w-4 h-4 text-blue-500" />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {systemHealth?.activityMetrics.recentUploads || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconChartBar className="w-4 h-4 text-purple-500" />
                Reports Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {systemHealth?.activityMetrics.recentReports || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>Quick access to system administration tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Manage Tenants</div>
                <div className="text-xs text-muted-foreground">View and edit all tenants</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Manage Users</div>
                <div className="text-xs text-muted-foreground">Cross-tenant user management</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Audit Logs</div>
                <div className="text-xs text-muted-foreground">System-wide activity logs</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">System Config</div>
                <div className="text-xs text-muted-foreground">Global settings & features</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <IconAlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
