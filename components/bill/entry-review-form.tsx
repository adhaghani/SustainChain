'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Droplets, 
  Fuel,
  Save,
  RotateCcw
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { calculateCO2e, inferRegionFromProvider, type UtilityType } from '@/lib/carbon-calculator';

export interface ExtractedBillData {
  utilityType: UtilityType;
  provider: string;
  usage: number;
  unit: 'kWh' | 'm³' | 'L' | 'kg';
  billingDate: string;
  amount: number;
  currency: string;
  accountNumber: string;
  meterNumber?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  confidence: number;
  billImageUrl?: string;
  billImageStoragePath?: string;
}

interface EntryReviewFormProps {
  extractedData: ExtractedBillData;
  onSave: (entryId: string) => void;
  onReanalyze: () => void;
  onCancel: () => void;
}

export default function EntryReviewForm({
  extractedData,
  onSave,
  onReanalyze,
  onCancel,
}: EntryReviewFormProps) {
  const [formData, setFormData] = useState<ExtractedBillData>(extractedData);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Calculate CO2e preview
  const region = formData.provider ? inferRegionFromProvider(formData.provider) : 'peninsular';
  const co2eResult = calculateCO2e(formData.usage, formData.unit, formData.utilityType, { region });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const currentUser = auth?.currentUser;
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          notes,
          extractionMethod: 'auto',
          billImageUrl: extractedData.billImageUrl,
          billImageStoragePath: extractedData.billImageStoragePath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save entry');
      }

      onSave(data.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const getUtilityIcon = (type: UtilityType) => {
    switch (type) {
      case 'electricity': return <Zap className="w-4 h-4" />;
      case 'water': return <Droplets className="w-4 h-4" />;
      case 'fuel': return <Fuel className="w-4 h-4" />;
      default: return null;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />High Confidence</Badge>;
    } else if (confidence >= 0.7) {
      return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Medium Confidence</Badge>;
    } else {
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Low Confidence - Review Required</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getUtilityIcon(formData.utilityType)}
              Review Extracted Data
            </CardTitle>
            <CardDescription>
              Verify the AI-extracted data before saving
            </CardDescription>
          </div>
          {getConfidenceBadge(formData.confidence)}
        </div>
      </CardHeader>
      <CardContent>
        {formData.confidence < 0.7 && (
          <Alert className="mb-4 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              The AI confidence is low ({Math.round(formData.confidence * 100)}%). Please review all fields carefully.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Utility Type */}
            <div className="space-y-2">
              <Label htmlFor="utilityType">Utility Type</Label>
              <Select 
                value={formData.utilityType}
                onValueChange={(value: UtilityType) => setFormData({...formData, utilityType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Provider */}
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                placeholder="e.g., TNB, SAJ, IWK"
              />
            </div>

            {/* Usage */}
            <div className="space-y-2">
              <Label htmlFor="usage">Usage</Label>
              <div className="flex gap-2">
                <Input
                  id="usage"
                  type="number"
                  step="0.01"
                  value={formData.usage}
                  onChange={(e) => setFormData({...formData, usage: parseFloat(e.target.value) || 0})}
                  className="flex-1"
                />
                <Select 
                  value={formData.unit}
                  onValueChange={(value: 'kWh' | 'm³' | 'L' | 'kg') => setFormData({...formData, unit: value})}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kWh">kWh</SelectItem>
                    <SelectItem value="m³">m³</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (MYR)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
              />
            </div>

            {/* Billing Date */}
            <div className="space-y-2">
              <Label htmlFor="billingDate">Billing Date</Label>
              <Input
                id="billingDate"
                type="date"
                value={formData.billingDate}
                onChange={(e) => setFormData({...formData, billingDate: e.target.value})}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber || ''}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
              />
            </div>
          </div>

          {/* CO2e Preview */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Calculated CO2 Emissions
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {co2eResult.calculationMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {co2eResult.co2e.toLocaleString()} kg
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  CO2e
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this bill..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={onReanalyze}
              disabled={saving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Re-analyze
            </Button>
            <Button 
              type="button" 
              variant="ghost"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
