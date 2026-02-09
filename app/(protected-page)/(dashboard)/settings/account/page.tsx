"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IconKey,
  IconLock,
  IconShield,
  IconAlertTriangle,
  IconTrash,
  IconDeviceMobile,
  IconFingerprint,
  IconClock,
  IconCheck,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AccountSettingsPage = () => {
  const { userData, user, signOut } = useAuth();
  const router = useRouter();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    // TODO: Implement password change API
    // await fetch('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })
    setTimeout(() => {
      setIsChangingPassword(false);
      // Show success toast
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion API
    // await fetch('/api/users/delete-account', { method: 'DELETE' })
    await signOut();
    router.push("/");
  };

  return (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>
            Manage your password and login security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconKey className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">Password</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last changed: {user?.metadata.lastSignInTime || "Never"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <IconLock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            <Alert>
              <IconShield className="w-4 h-4" />
              <AlertDescription>
                Choose a strong password with at least 8 characters, including
                uppercase, lowercase, numbers, and symbols.
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconFingerprint className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">Two-Factor Authentication (2FA)</p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                <IconShield className="w-4 h-4 mr-2" />
                Enable 2FA
              </Button>
            </div>

            <div className="rounded-lg border p-4 space-y-2 opacity-50">
              <div className="flex items-center gap-2">
                <IconDeviceMobile className="w-4 h-4" />
                <p className="text-sm font-medium">Authenticator App</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Use an authenticator app like Google Authenticator or Authy
              </p>
            </div>
          </div>

          <Separator />

          {/* Email Verification */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">Email Verification</p>
                {user?.emailVerified ? (
                  <Badge variant="default" className="bg-green-500">
                    <IconCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">Unverified</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{userData?.email}</p>
            </div>
            {!user?.emailVerified && (
              <Button variant="outline" size="sm">
                Send Verification Email
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage devices and locations where you&apos;re signed in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconDeviceMobile className="w-4 h-4" />
                  <p className="font-medium">Current Session</p>
                  <Badge variant="secondary">Active Now</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <IconClock className="w-3 h-3" />
                    <span>Last activity: Just now</span>
                  </div>
                  <p>Windows 11 • Chrome 131</p>
                  <p>IP: 192.168.1.x • Kuala Lumpur, Malaysia</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <IconLogout className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <Alert>
            <IconShield className="w-4 h-4" />
            <AlertDescription>
              If you see any suspicious activity, sign out of all sessions and
              change your password immediately.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Control how your data is used and stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Download My Data
              <span className="ml-auto text-xs text-muted-foreground">
                Export all your data
              </span>
            </Button>

            <Button variant="outline" className="w-full justify-start">
              Privacy Policy
              <span className="ml-auto text-xs text-muted-foreground">
                Review our policies
              </span>
            </Button>

            <Button variant="outline" className="w-full justify-start">
              Data Retention
              <span className="ml-auto text-xs text-muted-foreground">
                7 years (PDPA compliant)
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <IconAlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <IconAlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Warning:</strong> These actions cannot be undone. Proceed
              with caution.
            </AlertDescription>
          </Alert>

          {!showDangerConfirm ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-destructive p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDangerConfirm(true)}
                  >
                    <IconTrash className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deactivate Account</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Temporarily disable your account (can be reactivated)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500"
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-destructive p-6 space-y-4">
              <div className="space-y-2">
                <p className="font-semibold text-destructive">
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-muted-foreground">
                  This action will permanently delete your account, including:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-4">
                  <li>All your uploaded bills and entries</li>
                  <li>Generated reports and analytics data</li>
                  <li>Account preferences and settings</li>
                  <li>Access to {userData?.tenantName} organization</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-delete">
                  Type <strong>DELETE</strong> to confirm:
                </Label>
                <Input
                  id="confirm-delete"
                  placeholder="Type DELETE to confirm"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDangerConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteAccount}
                >
                  <IconTrash className="w-4 h-4 mr-2" />
                  Permanently Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;
