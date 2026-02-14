/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IconClock,
  IconRefresh,
  IconDeviceFloppy,
  IconAlertTriangle,
  IconCheck,
  IconShieldCheck,
  IconGauge,
} from "@tabler/icons-react";
import { useAuth } from '@/lib/auth-context';

interface RateLimitConfig {
  billAnalysis: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  reportGeneration: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  lastUpdated?: Date;
}

interface QuotaConfig {
  trial: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
  standard: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
  premium: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
  enterprise: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
}

const RateLimitsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [rateLimits, setRateLimits] = useState<RateLimitConfig>({
    billAnalysis: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
      requestsPerDay: 500,
    },
    reportGeneration: {
      requestsPerMinute: 5,
      requestsPerHour: 50,
      requestsPerDay: 200,
    },
  });

  const [quotas, setQuotas] = useState<QuotaConfig>({
    trial: {
      maxUsers: 1,
      maxBillsPerMonth: 2,
      maxReportsPerMonth: 0,
    },
    standard: {
      maxUsers: 10,
      maxBillsPerMonth: 50,
      maxReportsPerMonth: 50,
    },
    premium: {
      maxUsers: 50,
      maxBillsPerMonth: 2000,
      maxReportsPerMonth: 200,
    },
    enterprise: {
      maxUsers: -1,
      maxBillsPerMonth: -1,
      maxReportsPerMonth: -1,
    },
  });

  useEffect(() => {
    fetchRateLimits();
  }, []);

  const fetchRateLimits = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/system-admin/rate-limits', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rate limits');
      }

      const result = await response.json();

      if (result.success) {
        setRateLimits(result.data.rateLimits);
        setQuotas(result.data.quotas);
      }
    } catch (err) {
      console.error('Error fetching rate limits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rate limits');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/system-admin/rate-limits', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rateLimits,
          quotas,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update rate limits');
      }

      const result = await response.json();

      if (result.success) {
        setSuccess('Rate limits updated successfully');
        setRateLimits(result.data.rateLimits);
        setQuotas(result.data.quotas);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error updating rate limits:', err);
      setError(err instanceof Error ? err.message : 'Failed to update rate limits');
    } finally {
      setSaving(false);
    }
  };

  const updateRateLimit = (operation: 'billAnalysis' | 'reportGeneration', field: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setRateLimits(prev => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        [field]: numValue,
      },
    }));
  };

  const updateQuota = (tier: keyof QuotaConfig, field: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setQuotas(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: numValue,
      },
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <IconGauge className="w-8 h-8" />
            Rate Limits & Quotas
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure system-wide rate limits and subscription tier quotas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRateLimits} disabled={loading}>
            <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <IconDeviceFloppy className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <IconCheck className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Info Banner */}
      <Alert>
        <IconShieldCheck className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Rate limits are tracked per tenant for expensive operations (Bill Analysis, Report Generation).
          Changes take effect within 5 minutes due to caching. Admins bypass rate limits automatically.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rate Limits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="w-5 h-5" />
              Rate Limits (Per Tenant)
            </CardTitle>
            <CardDescription>
              Control how many requests tenants can make for expensive operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bill Analysis */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Bill Analysis (Gemini API)</Label>
                <Badge variant="secondary">Expensive Operation</Badge>
              </div>
              <div className="grid gap-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label htmlFor="bill-minute">Requests per Minute</Label>
                  <Input
                    id="bill-minute"
                    type="number"
                    min="1"
                    value={rateLimits.billAnalysis.requestsPerMinute}
                    onChange={(e) => updateRateLimit('billAnalysis', 'requestsPerMinute', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bill-hour">Requests per Hour</Label>
                  <Input
                    id="bill-hour"
                    type="number"
                    min="1"
                    value={rateLimits.billAnalysis.requestsPerHour}
                    onChange={(e) => updateRateLimit('billAnalysis', 'requestsPerHour', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bill-day">Requests per Day</Label>
                  <Input
                    id="bill-day"
                    type="number"
                    min="1"
                    value={rateLimits.billAnalysis.requestsPerDay}
                    onChange={(e) => updateRateLimit('billAnalysis', 'requestsPerDay', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Report Generation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Report Generation (PDF)</Label>
                <Badge variant="secondary">Expensive Operation</Badge>
              </div>
              <div className="grid gap-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label htmlFor="report-minute">Requests per Minute</Label>
                  <Input
                    id="report-minute"
                    type="number"
                    min="1"
                    value={rateLimits.reportGeneration.requestsPerMinute}
                    onChange={(e) => updateRateLimit('reportGeneration', 'requestsPerMinute', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-hour">Requests per Hour</Label>
                  <Input
                    id="report-hour"
                    type="number"
                    min="1"
                    value={rateLimits.reportGeneration.requestsPerHour}
                    onChange={(e) => updateRateLimit('reportGeneration', 'requestsPerHour', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-day">Requests per Day</Label>
                  <Input
                    id="report-day"
                    type="number"
                    min="1"
                    value={rateLimits.reportGeneration.requestsPerDay}
                    onChange={(e) => updateRateLimit('reportGeneration', 'requestsPerDay', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotas Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Tier Quotas</CardTitle>
            <CardDescription>
              Set maximum limits for each subscription tier (-1 for unlimited)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(['trial', 'standard', 'premium', 'enterprise'] as const).map((tier) => (
              <div key={tier} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold capitalize">{tier}</Label>
                  <Badge variant={tier === 'trial' ? 'outline' : tier === 'enterprise' ? 'default' : 'secondary'}>
                    {tier}
                  </Badge>
                </div>
                <div className="grid gap-3 pl-4 border-l-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor={`${tier}-users`} className="text-sm">Max Users</Label>
                      <Input
                        id={`${tier}-users`}
                        type="number"
                        min="-1"
                        value={quotas[tier].maxUsers}
                        onChange={(e) => updateQuota(tier, 'maxUsers', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`${tier}-bills`} className="text-sm">Bills/Month</Label>
                      <Input
                        id={`${tier}-bills`}
                        type="number"
                        min="-1"
                        value={quotas[tier].maxBillsPerMonth}
                        onChange={(e) => updateQuota(tier, 'maxBillsPerMonth', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${tier}-reports`} className="text-sm">Reports/Month</Label>
                    <Input
                      id={`${tier}-reports`}
                      type="number"
                      min="-1"
                      value={quotas[tier].maxReportsPerMonth}
                      onChange={(e) => updateQuota(tier, 'maxReportsPerMonth', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RateLimitsPage;
