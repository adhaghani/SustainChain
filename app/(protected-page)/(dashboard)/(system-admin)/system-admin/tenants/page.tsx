/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBuilding,
  IconSearch,
  IconRefresh,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconDatabase,
  IconCheck,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react";
import { getAllTenants, TenantOverview } from '@/lib/superadmin-helpers';
import { useAuth } from '@/lib/auth-context';

const TenantsManagementPage = () => {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<TenantOverview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await getAllTenants();
      setTenants(data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchTenants();
    }
  }, [isSuperAdmin]);

  const filteredTenants = searchQuery
    ? tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.uen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tenants;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />Active</Badge>;
      case 'trial':
        return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><IconAlertTriangle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      return timestamp.toDate().toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return new Date(timestamp).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all tenants in the system
          </p>
        </div>
        <Button onClick={fetchTenants} disabled={loading}>
          <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tenants.filter(t => t.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tenants.filter(t => t.status === 'trial').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive/Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {tenants.filter(t => t.status === 'inactive' || t.status === 'suspended').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>View and manage tenant accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by tenant name, UEN, or sector..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-12">
              <IconBuilding className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tenants found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery ? 'Try adjusting your search' : 'No tenants in the system'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tenant</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">UEN</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sector</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Users</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Entries</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant, index) => (
                    <tr key={tenant.id} className={`border-b ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconBuilding className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{tenant.name}</div>
                            <div className="text-xs text-muted-foreground">{tenant.subscriptionTier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-sm">{tenant.uen}</td>
                      <td className="p-4 align-middle text-sm">{tenant.sector}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <IconUsers className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{tenant.userCount}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <IconDatabase className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{tenant.totalEntries}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{getStatusBadge(tenant.status)}</td>
                      <td className="p-4 align-middle text-sm">{formatDate(tenant.createdAt)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="View details">
                            <IconEye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit tenant">
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Delete tenant">
                            <IconTrash className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredTenants.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTenants.length} of {filteredTenants.length} tenants
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantsManagementPage;
