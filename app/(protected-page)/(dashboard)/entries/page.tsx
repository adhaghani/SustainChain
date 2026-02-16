'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEntries } from "@/hooks/use-entries";
import { useLanguage } from "@/lib/language-context";
import { 
  IconUpload, 
  IconSearch, 
  IconFilter, 
  IconDownload, 
  IconEdit, 
  IconTrash,
  IconBolt,
  IconDroplet,
  IconGasStation,
  IconCalendar,
  IconCheck,
  IconClock
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EntriesPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityFilter, setUtilityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Fetch entries from Firestore
  const { entries: allEntries, loading, error, refetch } = useEntries({ limitCount: 100 });
  
  // Apply client-side filtering
  const entries = allEntries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.amount.toString().includes(searchQuery) ||
      entry.utilityType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUtility = utilityFilter === '' || entry.utilityType === utilityFilter;
    const matchesStatus = statusFilter === '' || entry.status === statusFilter;
    
    return matchesSearch && matchesUtility && matchesStatus;
  });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />{t('dashboard.pages.entries.status.verified')}</Badge>;
      case "pending":
        return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />{t('dashboard.pages.entries.status.pending')}</Badge>;
      case "flagged":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('dashboard.pages.entries.status.flagged')}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t('dashboard.pages.entries.status.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: { toDate?: () => Date } | Date | string | number | null | undefined) => {
    if (!timestamp) return 'N/A';
    // Handle both Firebase Admin and Client SDK Timestamp types
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    // Fallback for regular Date objects and strings
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    // String or number timestamps
    return new Date(timestamp as string | number).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalEmissions = allEntries.reduce((sum, entry) => sum + entry.co2e, 0);
  const verifiedCount = allEntries.filter(e => e.status === "verified").length;
  const autoExtractedCount = allEntries.filter(e => e.extractionMethod === "auto").length;
  
  // Calculate current month entries
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthEntries = allEntries.filter(entry => {
    if (!entry.billingDate) return false;
    let date: Date;
    if (typeof entry.billingDate === 'object' && 'toDate' in entry.billingDate && entry.billingDate.toDate) {
      date = entry.billingDate.toDate();
    } else if (entry.billingDate instanceof Date) {
      date = entry.billingDate;
    } else {
      return false;
    }
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.pages.entries.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.pages.entries.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            {t('common.retry')}
          </Button>
          <Button onClick={() => router.push('/entries/upload')}>
            <IconUpload className="w-4 h-4 mr-2" />
            {t('dashboard.pages.uploadBills.title')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.pages.entries.totalEntries')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{allEntries.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {autoExtractedCount} {t('dashboard.pages.dashboard.autoExtracted')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.pages.entries.totalCO2e')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalEmissions.toFixed(2)} {t('dashboard.pages.entries.kg')}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('dashboard.pages.entries.fromAllEntries')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.pages.entries.status.verified')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{verifiedCount}/{allEntries.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {allEntries.length > 0 ? ((verifiedCount / allEntries.length) * 100).toFixed(0) : 0}% {t('dashboard.pages.entries.completion')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.pages.dashboard.thisMonth')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{currentMonthEntries} {currentMonthEntries === 1 ? t('dashboard.pages.entries.billSingular') : t('dashboard.pages.entries.billPlural')}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date().toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.pages.entries.title')}</CardTitle>
              <CardDescription>{t('dashboard.pages.entries.subtitle')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <IconDownload className="w-4 h-4 mr-2" />
                {t('dashboard.common.export')} CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t('dashboard.pages.entries.searchPlaceholder')}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IconFilter className="w-4 h-4 mr-2" />
                {t('dashboard.common.filter')}{(utilityFilter || statusFilter) && ' (Active)'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t('dashboard.pages.entries.filters.status')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setUtilityFilter('')}>{t('dashboard.pages.entries.filters.allTypes')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUtilityFilter('electricity')}>{t('dashboard.pages.entries.filters.electricity')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUtilityFilter('water')}>{t('dashboard.pages.entries.filters.water')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUtilityFilter('fuel')}>{t('dashboard.pages.entries.filters.fuel')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{t('dashboard.pages.entries.filters.status')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter('')}>{t('dashboard.pages.entries.filters.allStatus')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('verified')}>{t('dashboard.pages.entries.status.verified')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>{t('dashboard.pages.entries.status.pending')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('flagged')}>{t('dashboard.pages.entries.status.flagged')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>{t('dashboard.pages.entries.status.rejected')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 flex-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{t('dashboard.common.error')}</AlertDescription>
            </Alert>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <IconUpload className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t('dashboard.pages.entries.noEntriesFound')}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || utilityFilter || statusFilter
                  ? t('dashboard.pages.entries.tryAdjustingFilters')
                  : t('dashboard.pages.dashboard.uploadFirstBill')}
              </p>
              {!searchQuery && !utilityFilter && !statusFilter && (
                <Button onClick={() => router.push('/entries/upload')} className="mt-4">
                  <IconUpload className="w-4 h-4 mr-2" />
                  {t('dashboard.common.uploadBill')}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.type')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.provider')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.usage')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.amount')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CO2e ({t('dashboard.pages.entries.kg')})</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.date')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.status')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('dashboard.pages.entries.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={entry.id} className={`border-b ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {getUtilityIcon(entry.utilityType)}
                          <span className="capitalize text-sm">{entry.utilityType}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-sm">{entry.provider}</td>
                      <td className="p-4 align-middle text-sm font-medium">
                        {entry.usage} {entry.unit}
                      </td>
                      <td className="p-4 align-middle text-sm">{entry.currency} {entry.amount.toFixed(2)}</td>
                      <td className="p-4 align-middle">
                        <span className="text-sm font-bold">{entry.co2e.toFixed(2)}</span>
                        {entry.confidence && (
                          <div className="text-xs text-muted-foreground">
                            {(entry.confidence * 100).toFixed(0)}% confidence
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1 text-sm">
                          <IconCalendar className="w-3 h-3 text-muted-foreground" />
                          {formatDate(entry.billingDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Uploaded {formatDate(entry.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(entry.status)}
                        {entry.extractionMethod === "auto" && (
                          <Badge variant="outline" className="ml-1 text-xs">AI</Badge>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title={t('common.edit')}>
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title={t('common.delete')}>
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
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {t('dashboard.pages.entries.showingEntries', { count: entries.length, total: entries.length })}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                {t('dashboard.common.previous')}
              </Button>
              <Button variant="outline" size="sm" disabled>
                {t('dashboard.common.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntriesPage;