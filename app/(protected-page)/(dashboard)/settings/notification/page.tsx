"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  IconMail,
  IconBell,
  IconDeviceFloppy,
  IconBellRinging,
  IconChartBar,
  IconFileText,
  IconAlertTriangle,
  IconSparkles,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NotificationSettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);

  // Notification preferences state - will be connected to backend
  const [emailNotifications, setEmailNotifications] = useState({
    billUpload: true,
    monthlyReport: true,
    emissionAlert: false,
    benchmarkUpdate: true,
    systemUpdates: true,
    marketing: false,
    teamActivity: true,
    weeklyDigest: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    billProcessed: true,
    thresholdExceeded: true,
    reportReady: true,
    systemAlert: true,
  });

  const [frequency, setFrequency] = useState("daily");

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to save notification preferences
    // await fetch('/api/users/preferences/notifications', { method: 'PATCH', body: JSON.stringify({ emailNotifications, pushNotifications, frequency }) })

    setTimeout(() => {
      setIsSaving(false);
      // Show success toast
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Manage what emails you receive from SustainChain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bills & Entries */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Bills & Entries</h4>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconFileText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="bill-upload" className="font-medium">
                    Bill Upload Confirmation
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get notified when your bills are successfully processed
                </p>
              </div>
              <Switch
                id="bill-upload"
                checked={emailNotifications.billUpload}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    billUpload: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconAlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="emission-alert" className="font-medium">
                    Emission Threshold Alerts
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Warning when emissions exceed your monthly target
                </p>
              </div>
              <Switch
                id="emission-alert"
                checked={emailNotifications.emissionAlert}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    emissionAlert: checked,
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Reports & Analytics */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Reports & Analytics</h4>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconChartBar className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="monthly-report" className="font-medium">
                    Monthly Report Ready
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alert when new monthly ESG reports are generated
                </p>
              </div>
              <Switch
                id="monthly-report"
                checked={emailNotifications.monthlyReport}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    monthlyReport: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconTrendingUp className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="benchmark-update" className="font-medium">
                    Benchmarking Updates
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  New sector comparison data and insights available
                </p>
              </div>
              <Switch
                id="benchmark-update"
                checked={emailNotifications.benchmarkUpdate}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    benchmarkUpdate: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="weekly-digest" className="font-medium">
                    Weekly Performance Digest
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Summary of your carbon footprint and improvements
                </p>
              </div>
              <Switch
                id="weekly-digest"
                checked={emailNotifications.weeklyDigest}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    weeklyDigest: checked,
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Team & System */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Team & System</h4>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconUsers className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="team-activity" className="font-medium">
                    Team Activity
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Updates when team members upload bills or generate reports
                </p>
              </div>
              <Switch
                id="team-activity"
                checked={emailNotifications.teamActivity}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    teamActivity: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconBell className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="system-updates" className="font-medium">
                    System Updates & Announcements
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Product updates, new features, and maintenance notices
                </p>
              </div>
              <Switch
                id="system-updates"
                checked={emailNotifications.systemUpdates}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    systemUpdates: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <IconSparkles className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="marketing" className="font-medium">
                    Marketing & Tips
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  ESG best practices, tips, and promotional content
                </p>
              </div>
              <Switch
                id="marketing"
                checked={emailNotifications.marketing}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    marketing: checked,
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Email Frequency */}
          <div className="space-y-2">
            <Label htmlFor="email-frequency">Email Digest Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="email-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (Immediate)</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="never">
                  Never (Disable all emails)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how often you want to receive notification emails
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications (In-App) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBellRinging className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Real-time alerts within the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <IconBell className="w-4 h-4" />
            <AlertDescription>
              Push notifications appear as desktop notifications when
              you&apos;re using SustainChain.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="push-bill" className="font-medium">
                Bill Processed Successfully
              </Label>
              <p className="text-sm text-muted-foreground">
                Instant notification when AI extraction completes
              </p>
            </div>
            <Switch
              id="push-bill"
              checked={pushNotifications.billProcessed}
              onCheckedChange={(checked) =>
                setPushNotifications({
                  ...pushNotifications,
                  billProcessed: checked,
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="push-threshold" className="font-medium">
                Threshold Exceeded
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert when emissions pass your set limits
              </p>
            </div>
            <Switch
              id="push-threshold"
              checked={pushNotifications.thresholdExceeded}
              onCheckedChange={(checked) =>
                setPushNotifications({
                  ...pushNotifications,
                  thresholdExceeded: checked,
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="push-report" className="font-medium">
                Report Generated
              </Label>
              <p className="text-sm text-muted-foreground">
                Notify when PDF reports are ready for download
              </p>
            </div>
            <Switch
              id="push-report"
              checked={pushNotifications.reportReady}
              onCheckedChange={(checked) =>
                setPushNotifications({
                  ...pushNotifications,
                  reportReady: checked,
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="push-system" className="font-medium">
                System Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Critical system notifications and maintenance
              </p>
            </div>
            <Switch
              id="push-system"
              checked={pushNotifications.systemAlert}
              onCheckedChange={(checked) =>
                setPushNotifications({
                  ...pushNotifications,
                  systemAlert: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <IconDeviceFloppy className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
