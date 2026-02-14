

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import {
  IconCheck,
  IconAlertTriangle,
  IconLoader2,
  IconDeviceFloppy,
  IconEdit,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManualEntryDialogProps {
  onEntryCreated?: (entryId: string) => void;
}

const ManualEntryDialog = ({ onEntryCreated }: ManualEntryDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Manual entry form state
  const [manualEntry, setManualEntry] = useState({
    utilityType: "",
    provider: "",
    usage: "",
    unit: "",
    amount: "",
    billingDate: "",
    accountNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleManualSubmit = async () => {
    try {
      setIsSubmitting(true);
      setManualError(null);
      setManualSuccess(false);

      // Validate required fields
      if (
        !manualEntry.utilityType ||
        !manualEntry.usage ||
        !manualEntry.unit ||
        !manualEntry.amount ||
        !manualEntry.billingDate
      ) {
        setManualError(t.manualEntry.validation.fillRequired);
        return;
      }

      // Get user token
      if (!user) {
        setManualError(t.manualEntry.validation.loginRequired);
        return;
      }

      const token = await user.getIdToken();

      // Prepare entry data
      const entryData = {
        utilityType: manualEntry.utilityType,
        provider: manualEntry.provider || "Manual Entry",
        usage: parseFloat(manualEntry.usage),
        unit: manualEntry.unit,
        amount: parseFloat(manualEntry.amount),
        currency: "MYR",
        billingDate: new Date(manualEntry.billingDate).toISOString(),
        accountNumber: manualEntry.accountNumber || undefined,
        extractionMethod: "manual",
        notes: "Manually entered data",
      };

      // Call API to create entry
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create entry");
      }

      // Success!
      setManualSuccess(true);

      // Clear form
      setManualEntry({
        utilityType: "",
        provider: "",
        usage: "",
        unit: "",
        amount: "",
        billingDate: "",
        accountNumber: "",
      });

      // Notify parent component
      if (onEntryCreated) {
        onEntryCreated(result.entry.id);
      }

      // Close dialog after 1.5 seconds
      setTimeout(() => {
        setOpen(false);
        setManualSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error creating manual entry:", error);
      setManualError(
        error instanceof Error ? error.message : "Failed to create entry",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setManualEntry({
      utilityType: "",
      provider: "",
      usage: "",
      unit: "",
      amount: "",
      billingDate: "",
      accountNumber: "",
    });
    setManualError(null);
    setManualSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-sm">
          <IconEdit className="w-4 h-4 mr-2" />
          {t.manualEntry.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md! w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.manualEntry.title}</DialogTitle>
          <DialogDescription>
            {t.manualEntry.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Alert */}
          {manualSuccess && (
            <Alert className="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20">
              <IconCheck className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {t.manualEntry.success.saved}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {manualError && (
            <Alert variant="destructive">
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>{manualError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="utility-type">
                {t.manualEntry.labels.utilityType} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={manualEntry.utilityType}
                onValueChange={(value) =>
                  setManualEntry({ ...manualEntry, utilityType: value })
                }
              >
                <SelectTrigger id="utility-type" className="w-full">
                  <SelectValue placeholder={t.manualEntry.placeholders.selectType} />
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
              <Label htmlFor="provider">{t.manualEntry.labels.provider}</Label>
              <Input
                id="provider"
                placeholder={t.manualEntry.placeholders.provider}
                value={manualEntry.provider}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, provider: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="usage">
                {t.manualEntry.labels.usageAmount} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="usage"
                type="number"
                placeholder={t.manualEntry.placeholders.usage}
                value={manualEntry.usage}
                className="w-full"
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, usage: e.target.value })
                }
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                {t.manualEntry.labels.unit} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={manualEntry.unit}
                onValueChange={(value) =>
                  setManualEntry({ ...manualEntry, unit: value })
                }
              >
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder={t.manualEntry.placeholders.unitSelect} className="w-full" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kWh">kWh (Electricity)</SelectItem>
                  <SelectItem value="m³">m³ (Water/Gas)</SelectItem>
                  <SelectItem value="L">Liters (Fuel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {t.manualEntry.labels.billAmount} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder={t.manualEntry.placeholders.amount}
                value={manualEntry.amount}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, amount: e.target.value })
                }
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billing-date">
                {t.manualEntry.labels.billingDate} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="billing-date"
                type="date"
                value={manualEntry.billingDate}
                onChange={(e) =>
                  setManualEntry({
                    ...manualEntry,
                    billingDate: e.target.value,
                  })
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">{t.manualEntry.labels.accountNumberOptional}</Label>
              <Input
                id="account-number"
                placeholder={t.manualEntry.placeholders.accountNumber}
                value={manualEntry.accountNumber}
                onChange={(e) =>
                  setManualEntry({
                    ...manualEntry,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.manualEntry.actions.saving}
                </>
              ) : (
                <>
                  <IconDeviceFloppy className="w-4 h-4 mr-2" />
                  {t.manualEntry.actions.saveEntry}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearForm}
              disabled={isSubmitting}
            >
              {t.manualEntry.actions.clear}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualEntryDialog;