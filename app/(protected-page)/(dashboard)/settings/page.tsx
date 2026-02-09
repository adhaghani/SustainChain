"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconDeviceFloppy,
  IconCamera,
  IconMail,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSettingsPage = () => {
  const { userData, user, loading, refreshUserData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state - initialized from userData
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    jobTitle: "",
  });

  // Load user data into form when userData is available
  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || "",
        email: userData.email || "",
        phone: (userData as any).phone || "",
        jobTitle: (userData as any).jobTitle || "",
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Get current user token
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      // Call API to update profile
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          phone: formData.phone,
          jobTitle: formData.jobTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Refresh user data to show updated info
      if (refreshUserData) {
        await refreshUserData();
      }

      setSuccess("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={userData?.photoURL || ""}
                alt={userData?.displayName || "User"}
              />
              <AvatarFallback className="text-2xl">
                {userData?.displayName?.charAt(0).toUpperCase() ||
                  userData?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <IconCamera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">
                <IconUser className="w-4 h-4 inline mr-1" />
                Full Name
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <IconMail className="w-4 h-4 inline mr-1" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@example.com"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <IconPhone className="w-4 h-4 inline mr-1" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+60 12-345 6789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                <IconBuilding className="w-4 h-4 inline mr-1" />
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                placeholder="e.g., Sustainability Manager"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  displayName: userData?.displayName || "",
                  email: userData?.email || "",
                  phone: (userData as any).phone || "",
                  jobTitle: (userData as any).jobTitle || "",
                });
                setError(null);
                setSuccess(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <IconDeviceFloppy className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>Your organization details and role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Organization</Label>
              <div className="flex items-center gap-2">
                <IconBuilding className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {userData?.tenantName || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Role</Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {userData?.role || "N/A"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">User ID</Label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {userData?.uid}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Account Created</Label>
              <div className="flex items-center gap-2">
                <IconCalendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {user?.metadata.creationTime || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsPage;
