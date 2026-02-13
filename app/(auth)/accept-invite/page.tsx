"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  IconLoader2,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconShieldCheck,
  IconUser,
  IconShield,
  IconRefresh,
} from "@tabler/icons-react";

interface InvitationData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'clerk' | 'viewer';
  tenantName: string;
  invitedByName: string;
  expiresAt: string;
  status: string;
}

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch invitation details
  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link. No token provided.");
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/accept-invite?token=${token}`);
      const data = await response.json();

      console.log('Invitation response:', { status: response.status, data });

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to load invitation");
        return;
      }

      setInvitation(data.data);
    } catch (err) {
      console.error("Error fetching invitation:", err);
      setError("Failed to load invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/users/accept-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to accept invitation");
        return;
      }

      // Success! Redirect to sign-in
      router.push("/sign-in?registered=true");
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Failed to complete registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <IconShieldCheck className="w-5 h-5 text-purple-600" />;
      case "clerk":
        return <IconUser className="w-5 h-5 text-gray-600" />;
      case "viewer":
        return <IconShield className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="bg-purple-500">
            Administrator
          </Badge>
        );
      case "clerk":
        return <Badge variant="secondary">Data Entry Clerk</Badge>;
      case "viewer":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Viewer
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && !invitation) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <IconAlertCircle className="w-6 h-6" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            {process.env.NODE_ENV === 'development' && token && (
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                <p className="font-mono break-all">Token: {token}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={fetchInvitation} variant="outline" className="flex-1">
                <IconRefresh className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button onClick={() => router.push("/sign-in")} className="flex-1">
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state with form
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md!">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <IconCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Welcome to SustainChain!</CardTitle>
          <CardDescription>
            Complete your registration to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invitation Info */}
          {invitation && (
            <div className="space-y-4">
              <Alert>
                <IconInfoCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{invitation.invitedByName}</strong> has invited you to join{" "}
                  <strong>{invitation.tenantName}</strong>
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{invitation.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{invitation.email}</p>
                </div>
                {invitation.phone && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="font-medium">{invitation.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Role</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleIcon(invitation.role)}
                    {getRoleBadge(invitation.role)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Expires</Label>
                  <p className="font-medium text-sm">{formatDate(invitation.expiresAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                Create Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4 mr-2" />
                  Accept Invitation & Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
