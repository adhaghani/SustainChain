import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconDeviceFloppy, 
  IconUser,
  IconBell,
  IconShield,
  IconPalette,
  IconKey,
  IconMail,
  IconUpload,
  IconCamera,
  IconLock,
  IconLogout,
  IconTrash,
  IconCheck,
  IconX,
  IconMoon,
  IconSun,
  IconInfoCircle
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and application settings
          </p>
        </div>
        <Button>
          <IconDeviceFloppy className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <IconCamera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <Button variant="outline" size="sm">
                  <IconTrash className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 400x400px. Max size: 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Personal Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Ahmad" defaultValue="Ahmad" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Ibrahim" defaultValue="Ibrahim" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input id="display-name" placeholder="How you want to be called" defaultValue="Ahmad bin Ibrahim" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="ahmad@example.com" defaultValue="ahmad@muarfurniture.com" />
              <p className="text-xs text-muted-foreground">
                Your email is verified <IconCheck className="w-3 h-3 inline text-green-500" />
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+60 12-345 6789" defaultValue="+60 12-345 6789" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us about yourself..." 
              defaultValue="ESG Compliance Manager at Muar Furniture Industries"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Brief description for your profile. Maximum 160 characters.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPalette className="w-5 h-5" />
            Appearance & Language
          </CardTitle>
          <CardDescription>Customize how SustainChain looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <IconSun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <IconMoon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    System Default
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="asia-kuala-lumpur">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-kuala-lumpur">Asia/Kuala Lumpur (GMT+8)</SelectItem>
                  <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                  <SelectItem value="asia-jakarta">Asia/Jakarta (GMT+7)</SelectItem>
                  <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select defaultValue="dd-mm-yyyy">
                <SelectTrigger id="date-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">DD/MM/YYYY (17/01/2026)</SelectItem>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY (01/17/2026)</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (2026-01-17)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what updates you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Notifications */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <IconMail className="w-4 h-4" />
              Email Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Bill Upload Confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when your bills are successfully processed
                  </p>
                </div>
                <Button variant="default" size="sm" className="bg-green-500">
                  <IconCheck className="w-4 h-4 mr-1" />
                  Enabled
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Monthly Report Ready</p>
                  <p className="text-xs text-muted-foreground">
                    Alert when new monthly ESG reports are generated
                  </p>
                </div>
                <Button variant="default" size="sm" className="bg-green-500">
                  <IconCheck className="w-4 h-4 mr-1" />
                  Enabled
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Emission Threshold Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Warning when emissions exceed your monthly target
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <IconX className="w-4 h-4 mr-1" />
                  Disabled
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Benchmarking Updates</p>
                  <p className="text-xs text-muted-foreground">
                    New sector comparison data and insights available
                  </p>
                </div>
                <Button variant="default" size="sm" className="bg-green-500">
                  <IconCheck className="w-4 h-4 mr-1" />
                  Enabled
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">System Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Product updates, new features, and maintenance notices
                  </p>
                </div>
                <Button variant="default" size="sm" className="bg-green-500">
                  <IconCheck className="w-4 h-4 mr-1" />
                  Enabled
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Marketing & Tips</p>
                  <p className="text-xs text-muted-foreground">
                    ESG best practices, tips, and promotional content
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <IconX className="w-4 h-4 mr-1" />
                  Disabled
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Frequency */}
          <div className="space-y-2">
            <Label htmlFor="notification-frequency">Email Digest Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="notification-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (Immediate)</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how often you want to receive notification emails
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShield className="w-5 h-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>Manage your account security and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Password</h4>
                <p className="text-xs text-muted-foreground">
                  Last changed: 3 months ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                <IconLock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            <Alert>
              <IconInfoCircle className="h-4 w-4" />
              <AlertDescription>
                Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge variant="outline">Not Enabled</Badge>
            </div>
            <Button variant="outline" size="sm">
              <IconShield className="w-4 h-4 mr-2" />
              Enable 2FA
            </Button>
          </div>

          <Separator />

          {/* Active Sessions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Active Sessions</h4>
                <p className="text-xs text-muted-foreground">
                  Manage devices where you&apos;re currently logged in
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                <div>
                  <p className="text-sm font-medium">MacBook Pro - Chrome</p>
                  <p className="text-xs text-muted-foreground">Kuala Lumpur, Malaysia • Current Session</p>
                  <p className="text-xs text-muted-foreground">Last active: Just now</p>
                </div>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">iPhone 15 Pro - Safari</p>
                  <p className="text-xs text-muted-foreground">Johor Bahru, Malaysia</p>
                  <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">
                  <IconLogout className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button variant="outline" size="sm">
              <IconLogout className="w-4 h-4 mr-2" />
              Sign Out All Other Sessions
            </Button>
          </div>

          <Separator />

          {/* API Keys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">API Access</h4>
                <p className="text-xs text-muted-foreground">
                  Generate API keys for third-party integrations
                </p>
              </div>
              <Button variant="outline" size="sm">
                <IconKey className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </div>
          </div>

          <Separator />

          {/* Data Privacy */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Data & Privacy</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <IconUpload className="w-4 h-4 mr-2" />
                  Download Your Data
                </Button>
                <p className="text-xs text-muted-foreground ml-6">
                  Export all your data in JSON format (PDPA compliance)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
            <div>
              <p className="text-sm font-semibold">Deactivate Account</p>
              <p className="text-xs text-muted-foreground">
                Temporarily disable your account. You can reactivate anytime.
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
              Deactivate
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
            <div>
              <p className="text-sm font-semibold">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <IconTrash className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Changes are saved automatically as you edit
        </p>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>
            <IconDeviceFloppy className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;