/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  IconSettings,
  IconRefresh,
  IconDeviceFloppy,
  IconAlertTriangle,
  IconCheck,
  IconBolt,
  IconDroplet,
  IconGasStation,
  IconToggleLeft,
  IconToggleRight,
  IconClock,
} from "@tabler/icons-react";
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmissionFactors {
  electricity: {
    peninsular: number;
    sabah: number;
    sarawak: number;
    default: number;
  };
  water: {
    treatment: number;
    wastewater: number;
    default: number;
  };
  fuel: {
    diesel_b10: number;
    diesel_b20: number;
    petrol_ron95: number;
    petrol_ron97: number;
    lng: number;
    default: number;
  };
  source: string;
  version: string;
  lastUpdated: any;
  validUntil: any;
}

interface ApiLimits {
  rateLimits: {
    billAnalysis: {
      requestPerMinute: number;
      requestPerHour: number;
      requestPerDay: number;
    };
  };
  quotas: {
    trial: {
      maxUsers: number;
      maxBillUploads: number;
      maxReports: number;
      maxStorageGB: number;
    };
    standard: {
      maxUsers: number;
      maxBillUploads: number;
      maxReports: number;
      maxStorageGB: number;
    };
    premium: {
      maxUsers: number;
      maxBillUploads: number;
      maxReports: number;
      maxStorageGB: number;
    };
    enterprise: {
      maxUsers: number;
      maxBillUploads: number;
      maxReports: number;
      maxStorageGB: number;
    };
  };
  lastUpdated: any;
}

interface FeatureFlags {
  global: {
    maintenanceMode: boolean;
    signupEnabled: boolean;
    geminiApiEnabled: boolean;
    bigQuerySyncEnabled: boolean;
  };
  experimental: {
    carbonOffsetMarketplace: boolean;
    waterBillExtraction: boolean;
    fuelBillExtraction: boolean;
    realTimeDashboard: boolean;
  };
  regional: {
    malaysiaOnly: boolean;
    multiCurrencyEnabled: boolean;
  };
  lastUpdated: any;
}

const GlobalConfigPage = () => {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for each config document
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactors | null>(null);
  const [apiLimits, setApiLimits] = useState<ApiLimits | null>(null);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);

  // Track which section is being edited
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const fetchConfigs = async () => {
    if (!db) {
      setError('Firebase not initialized');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all three config documents
      const [emissionFactorsDoc, apiLimitsDoc, featureFlagsDoc] = await Promise.all([
        getDoc(doc(db, 'system_config', 'emission_factors')),
        getDoc(doc(db, 'system_config', 'api_limits')),
        getDoc(doc(db, 'system_config', 'feature_flags')),
      ]);

      if (emissionFactorsDoc.exists()) {
        setEmissionFactors(emissionFactorsDoc.data() as EmissionFactors);
      }
      if (apiLimitsDoc.exists()) {
        setApiLimits(apiLimitsDoc.data() as ApiLimits);
      }
      if (featureFlagsDoc.exists()) {
        setFeatureFlags(featureFlagsDoc.data() as FeatureFlags);
      }
    } catch (err) {
      console.error('Error fetching configs:', err);
      setError('Failed to load configuration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchConfigs();
    }
  }, [isSuperAdmin]);

  const saveEmissionFactors = async () => {
    if (!db || !emissionFactors) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await setDoc(doc(db, 'system_config', 'emission_factors'), {
        ...emissionFactors,
        lastUpdated: Timestamp.now(),
      });

      setSuccess('Emission factors updated successfully');
      setEditingSection(null);
      await fetchConfigs();
    } catch (err) {
      console.error('Error saving emission factors:', err);
      setError('Failed to save emission factors');
    } finally {
      setSaving(false);
    }
  };

  const saveApiLimits = async () => {
    if (!db || !apiLimits) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await setDoc(doc(db, 'system_config', 'api_limits'), {
        ...apiLimits,
        lastUpdated: Timestamp.now(),
      });

      setSuccess('API limits updated successfully');
      setEditingSection(null);
      await fetchConfigs();
    } catch (err) {
      console.error('Error saving API limits:', err);
      setError('Failed to save API limits');
    } finally {
      setSaving(false);
    }
  };

  const saveFeatureFlags = async () => {
    if (!db || !featureFlags) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await setDoc(doc(db, 'system_config', 'feature_flags'), {
        ...featureFlags,
        lastUpdated: Timestamp.now(),
      });

      setSuccess('Feature flags updated successfully');
      setEditingSection(null);
      await fetchConfigs();
    } catch (err) {
      console.error('Error saving feature flags:', err);
      setError('Failed to save feature flags');
    } finally {
      setSaving(false);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'N/A';
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Configuration</h1>
          <p className="text-muted-foreground mt-1">
            System-wide settings for emission factors, API limits, and feature flags
          </p>
        </div>
        <Button onClick={fetchConfigs} disabled={loading}>
          <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 dark:text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      {/* Warning Banner */}
      <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <IconAlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">Caution: System-Wide Changes</p>
              <p className="text-sm text-muted-foreground">
                Changes made here affect all tenants. Verify carefully before saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Emission Factors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconBolt className="w-5 h-5 text-yellow-500" />
                    Emission Factors
                  </CardTitle>
                  <CardDescription>
                    CO2e conversion factors for calculating carbon emissions
                  </CardDescription>
                  {emissionFactors && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <div>Version: <Badge variant="outline">{emissionFactors.version}</Badge></div>
                      <div>Source: {emissionFactors.source}</div>
                      <div className="flex items-center gap-1">
                        <IconClock className="w-3 h-3" />
                        Last updated: {formatTimestamp(emissionFactors.lastUpdated)}
                      </div>
                    </div>
                  )}
                </div>
                {editingSection === 'emission_factors' ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingSection(null)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button onClick={saveEmissionFactors} disabled={saving}>
                      <IconDeviceFloppy className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setEditingSection('emission_factors')}>
                    <IconSettings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {emissionFactors && (
                <div className="space-y-6">
                  {/* Electricity */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <IconBolt className="w-4 h-4 text-yellow-500" />
                      Electricity (kg CO2e/kWh)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="elec-peninsular">Peninsular Malaysia</Label>
                        <Input
                          id="elec-peninsular"
                          type="number"
                          step="0.001"
                          value={emissionFactors.electricity.peninsular}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            electricity: { ...emissionFactors.electricity, peninsular: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="elec-sabah">Sabah</Label>
                        <Input
                          id="elec-sabah"
                          type="number"
                          step="0.001"
                          value={emissionFactors.electricity.sabah}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            electricity: { ...emissionFactors.electricity, sabah: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="elec-sarawak">Sarawak</Label>
                        <Input
                          id="elec-sarawak"
                          type="number"
                          step="0.001"
                          value={emissionFactors.electricity.sarawak}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            electricity: { ...emissionFactors.electricity, sarawak: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="elec-default">Default</Label>
                        <Input
                          id="elec-default"
                          type="number"
                          step="0.001"
                          value={emissionFactors.electricity.default}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            electricity: { ...emissionFactors.electricity, default: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Water */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <IconDroplet className="w-4 h-4 text-cyan-500" />
                      Water (kg CO2e/m³)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="water-treatment">Treatment</Label>
                        <Input
                          id="water-treatment"
                          type="number"
                          step="0.001"
                          value={emissionFactors.water.treatment}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            water: { ...emissionFactors.water, treatment: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="water-wastewater">Wastewater</Label>
                        <Input
                          id="water-wastewater"
                          type="number"
                          step="0.001"
                          value={emissionFactors.water.wastewater}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            water: { ...emissionFactors.water, wastewater: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="water-default">Default</Label>
                        <Input
                          id="water-default"
                          type="number"
                          step="0.001"
                          value={emissionFactors.water.default}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            water: { ...emissionFactors.water, default: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fuel */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <IconGasStation className="w-4 h-4 text-blue-500" />
                      Fuel (kg CO2e/L)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="fuel-diesel-b10">Diesel B10</Label>
                        <Input
                          id="fuel-diesel-b10"
                          type="number"
                          step="0.001"
                          value={emissionFactors.fuel.diesel_b10}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            fuel: { ...emissionFactors.fuel, diesel_b10: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel-diesel-b20">Diesel B20</Label>
                        <Input
                          id="fuel-diesel-b20"
                          type="number"
                          step="0.001"
                          value={emissionFactors.fuel.diesel_b20}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            fuel: { ...emissionFactors.fuel, diesel_b20: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel-ron95">Petrol RON95</Label>
                        <Input
                          id="fuel-ron95"
                          type="number"
                          step="0.001"
                          value={emissionFactors.fuel.petrol_ron95}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            fuel: { ...emissionFactors.fuel, petrol_ron95: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel-ron97">Petrol RON97</Label>
                        <Input
                          id="fuel-ron97"
                          type="number"
                          step="0.001"
                          value={emissionFactors.fuel.petrol_ron97}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            fuel: { ...emissionFactors.fuel, petrol_ron97: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel-lng">LNG</Label>
                        <Input
                          id="fuel-lng"
                          type="number"
                          step="0.001"
                          value={emissionFactors.fuel.lng}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            fuel: { ...emissionFactors.fuel, lng: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel-default">Default</Label>
                        <Input
                          id="fuel-default"
                          type="number"
                          step="0.001"
                          value={emissionFactors.fuel.default}
                          onChange={(e) => setEmissionFactors({
                            ...emissionFactors,
                            fuel: { ...emissionFactors.fuel, default: parseFloat(e.target.value) }
                          })}
                          disabled={editingSection !== 'emission_factors'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                    <div>
                      <Label htmlFor="ef-source">Source</Label>
                      <Input
                        id="ef-source"
                        value={emissionFactors.source}
                        onChange={(e) => setEmissionFactors({ ...emissionFactors, source: e.target.value })}
                        disabled={editingSection !== 'emission_factors'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ef-version">Version</Label>
                      <Input
                        id="ef-version"
                        value={emissionFactors.version}
                        onChange={(e) => setEmissionFactors({ ...emissionFactors, version: e.target.value })}
                        disabled={editingSection !== 'emission_factors'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Limits */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconSettings className="w-5 h-5 text-blue-500" />
                    API Limits & Quotas
                  </CardTitle>
                  <CardDescription>
                    Rate limits and subscription tier quotas
                  </CardDescription>
                  {apiLimits && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <IconClock className="w-3 h-3" />
                        Last updated: {formatTimestamp(apiLimits.lastUpdated)}
                      </div>
                    </div>
                  )}
                </div>
                {editingSection === 'api_limits' ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingSection(null)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button onClick={saveApiLimits} disabled={saving}>
                      <IconDeviceFloppy className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setEditingSection('api_limits')}>
                    <IconSettings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {apiLimits && (
                <div className="space-y-6">
                  {/* Rate Limits */}
                  <div>
                    <h3 className="font-semibold mb-3">Rate Limits (Bill Analysis)</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="rate-minute">Per Minute</Label>
                        <Input
                          id="rate-minute"
                          type="number"
                          value={apiLimits.rateLimits.billAnalysis.requestPerMinute}
                          onChange={(e) => setApiLimits({
                            ...apiLimits,
                            rateLimits: {
                              billAnalysis: {
                                ...apiLimits.rateLimits.billAnalysis,
                                requestPerMinute: parseInt(e.target.value)
                              }
                            }
                          })}
                          disabled={editingSection !== 'api_limits'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate-hour">Per Hour</Label>
                        <Input
                          id="rate-hour"
                          type="number"
                          value={apiLimits.rateLimits.billAnalysis.requestPerHour}
                          onChange={(e) => setApiLimits({
                            ...apiLimits,
                            rateLimits: {
                              billAnalysis: {
                                ...apiLimits.rateLimits.billAnalysis,
                                requestPerHour: parseInt(e.target.value)
                              }
                            }
                          })}
                          disabled={editingSection !== 'api_limits'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate-day">Per Day</Label>
                        <Input
                          id="rate-day"
                          type="number"
                          value={apiLimits.rateLimits.billAnalysis.requestPerDay}
                          onChange={(e) => setApiLimits({
                            ...apiLimits,
                            rateLimits: {
                              billAnalysis: {
                                ...apiLimits.rateLimits.billAnalysis,
                                requestPerDay: parseInt(e.target.value)
                              }
                            }
                          })}
                          disabled={editingSection !== 'api_limits'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quotas by Tier */}
                  {['trial', 'standard', 'premium', 'enterprise'].map((tier) => (
                    <div key={tier}>
                      <h3 className="font-semibold mb-3 capitalize flex items-center gap-2">
                        {tier} Tier
                        <Badge variant={tier === 'trial' ? 'secondary' : 'default'}>
                          {tier}
                        </Badge>
                      </h3>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <Label htmlFor={`${tier}-users`}>Max Users</Label>
                          <Input
                            id={`${tier}-users`}
                            type="number"
                            value={apiLimits.quotas[tier as keyof typeof apiLimits.quotas].maxUsers}
                            onChange={(e) => setApiLimits({
                              ...apiLimits,
                              quotas: {
                                ...apiLimits.quotas,
                                [tier]: {
                                  ...apiLimits.quotas[tier as keyof typeof apiLimits.quotas],
                                  maxUsers: parseInt(e.target.value)
                                }
                              }
                            })}
                            disabled={editingSection !== 'api_limits'}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${tier}-bills`}>Max Bill Uploads</Label>
                          <Input
                            id={`${tier}-bills`}
                            type="number"
                            value={apiLimits.quotas[tier as keyof typeof apiLimits.quotas].maxBillUploads}
                            onChange={(e) => setApiLimits({
                              ...apiLimits,
                              quotas: {
                                ...apiLimits.quotas,
                                [tier]: {
                                  ...apiLimits.quotas[tier as keyof typeof apiLimits.quotas],
                                  maxBillUploads: parseInt(e.target.value)
                                }
                              }
                            })}
                            disabled={editingSection !== 'api_limits'}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${tier}-reports`}>Max Reports/Month</Label>
                          <Input
                            id={`${tier}-reports`}
                            type="number"
                            value={apiLimits.quotas[tier as keyof typeof apiLimits.quotas].maxReports}
                            onChange={(e) => setApiLimits({
                              ...apiLimits,
                              quotas: {
                                ...apiLimits.quotas,
                                [tier]: {
                                  ...apiLimits.quotas[tier as keyof typeof apiLimits.quotas],
                                  maxReports: parseInt(e.target.value)
                                }
                              }
                            })}
                            disabled={editingSection !== 'api_limits'}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${tier}-storage`}>Max Storage (GB)</Label>
                          <Input
                            id={`${tier}-storage`}
                            type="number"
                            value={apiLimits.quotas[tier as keyof typeof apiLimits.quotas].maxStorageGB}
                            onChange={(e) => setApiLimits({
                              ...apiLimits,
                              quotas: {
                                ...apiLimits.quotas,
                                [tier]: {
                                  ...apiLimits.quotas[tier as keyof typeof apiLimits.quotas],
                                  maxStorageGB: parseInt(e.target.value)
                                }
                              }
                            })}
                            disabled={editingSection !== 'api_limits'}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconToggleRight className="w-5 h-5 text-purple-500" />
                    Feature Flags
                  </CardTitle>
                  <CardDescription>
                    Enable or disable system features globally
                  </CardDescription>
                  {featureFlags && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <IconClock className="w-3 h-3" />
                        Last updated: {formatTimestamp(featureFlags.lastUpdated)}
                      </div>
                    </div>
                  )}
                </div>
                {editingSection === 'feature_flags' ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingSection(null)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button onClick={saveFeatureFlags} disabled={saving}>
                      <IconDeviceFloppy className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setEditingSection('feature_flags')}>
                    <IconSettings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {featureFlags && (
                <div className="space-y-6">
                  {/* Global Flags */}
                  <div>
                    <h3 className="font-semibold mb-3">Global Features</h3>
                    <div className="space-y-3">
                      {Object.entries(featureFlags.global).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label htmlFor={`global-${key}`} className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {key === 'maintenanceMode' && 'Block all user access for maintenance'}
                              {key === 'signupEnabled' && 'Allow new user registrations'}
                              {key === 'geminiApiEnabled' && 'Enable Gemini AI API for bill extraction'}
                              {key === 'bigQuerySyncEnabled' && 'Sync data to BigQuery for analytics'}
                            </p>
                          </div>
                          <Button
                            id={`global-${key}`}
                            variant={value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFeatureFlags({
                              ...featureFlags,
                              global: { ...featureFlags.global, [key]: !value }
                            })}
                            disabled={editingSection !== 'feature_flags'}
                            className={value ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            {value ? (
                              <>
                                <IconToggleRight className="w-4 h-4 mr-1" />
                                Enabled
                              </>
                            ) : (
                              <>
                                <IconToggleLeft className="w-4 h-4 mr-1" />
                                Disabled
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experimental Flags */}
                  <div>
                    <h3 className="font-semibold mb-3">Experimental Features</h3>
                    <div className="space-y-3">
                      {Object.entries(featureFlags.experimental).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label htmlFor={`exp-${key}`} className="capitalize flex items-center gap-2">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                              <Badge variant="outline" className="text-xs">Beta</Badge>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {key === 'carbonOffsetMarketplace' && 'Carbon offset trading marketplace feature'}
                              {key === 'waterBillExtraction' && 'AI extraction for water bills (SAJ/IWK)'}
                              {key === 'fuelBillExtraction' && 'AI extraction for fuel receipts'}
                              {key === 'realTimeDashboard' && 'WebSocket-based real-time updates'}
                            </p>
                          </div>
                          <Button
                            id={`exp-${key}`}
                            variant={value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFeatureFlags({
                              ...featureFlags,
                              experimental: { ...featureFlags.experimental, [key]: !value }
                            })}
                            disabled={editingSection !== 'feature_flags'}
                            className={value ? 'bg-blue-500 hover:bg-blue-600' : ''}
                          >
                            {value ? (
                              <>
                                <IconToggleRight className="w-4 h-4 mr-1" />
                                Enabled
                              </>
                            ) : (
                              <>
                                <IconToggleLeft className="w-4 h-4 mr-1" />
                                Disabled
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Flags */}
                  <div>
                    <h3 className="font-semibold mb-3">Regional Settings</h3>
                    <div className="space-y-3">
                      {Object.entries(featureFlags.regional).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label htmlFor={`reg-${key}`} className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {key === 'malaysiaOnly' && 'Restrict access to Malaysia IP addresses only'}
                              {key === 'multiCurrencyEnabled' && 'Allow currencies other than MYR'}
                            </p>
                          </div>
                          <Button
                            id={`reg-${key}`}
                            variant={value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFeatureFlags({
                              ...featureFlags,
                              regional: { ...featureFlags.regional, [key]: !value }
                            })}
                            disabled={editingSection !== 'feature_flags'}
                            className={value ? 'bg-purple-500 hover:bg-purple-600' : ''}
                          >
                            {value ? (
                              <>
                                <IconToggleRight className="w-4 h-4 mr-1" />
                                Enabled
                              </>
                            ) : (
                              <>
                                <IconToggleLeft className="w-4 h-4 mr-1" />
                                Disabled
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GlobalConfigPage;
