/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconDeviceFloppy,
  IconPalette,
  IconTextSize,
  IconLanguage,
  IconWorld,
  IconCheck,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";
import { Badge } from "@/components/ui/badge";

const AppearanceSettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // UI Preferences state - will be connected to backend
  const [uiPreferences, setUiPreferences] = useState({
    compactMode: false,
    showAnimations: true,
    reducedMotion: false,
    highContrast: false,
  });

  const [displaySettings, setDisplaySettings] = useState({
    fontSize: "medium",
    density: "comfortable",
    sidebarCollapsed: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to save appearance preferences
    // await fetch('/api/users/preferences/appearance', { method: 'PATCH', body: JSON.stringify({ theme, language, uiPreferences, displaySettings }) })

    setTimeout(() => {
      setIsSaving(false);
      // Show success toast
    }, 1000);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPalette className="w-5 h-5" />
            Theme
          </CardTitle>
          <CardDescription>
            Choose how SustainChain looks to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Light Theme */}
              <label htmlFor="theme-light" className="cursor-pointer">
                <div
                  className={`relative rounded-lg border-2 p-4 hover:border-primary transition-colors ${theme === "light" ? "border-primary" : "border-muted"}`}
                >
                  <RadioGroupItem
                    value="light"
                    id="theme-light"
                    className="sr-only"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                          <IconSun className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Light</span>
                      </div>
                      {theme === "light" && (
                        <Badge variant="default" className="bg-primary">
                          <IconCheck className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="rounded-md overflow-hidden border">
                      <div className="bg-white p-4 space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clean and bright interface
                    </p>
                  </div>
                </div>
              </label>

              {/* Dark Theme */}
              <label htmlFor="theme-dark" className="cursor-pointer">
                <div
                  className={`relative rounded-lg border-2 p-4 hover:border-primary transition-colors ${theme === "dark" ? "border-primary" : "border-muted"}`}
                >
                  <RadioGroupItem
                    value="dark"
                    id="theme-dark"
                    className="sr-only"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-900 border flex items-center justify-center">
                          <IconMoon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Dark</span>
                      </div>
                      {theme === "dark" && (
                        <Badge variant="default" className="bg-primary">
                          <IconCheck className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="rounded-md overflow-hidden border">
                      <div className="bg-gray-900 p-4 space-y-2">
                        <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Easy on the eyes in low light
                    </p>
                  </div>
                </div>
              </label>

              {/* System Theme */}
              <label htmlFor="theme-system" className="cursor-pointer">
                <div
                  className={`relative rounded-lg border-2 p-4 hover:border-primary transition-colors ${theme === "system" ? "border-primary" : "border-muted"}`}
                >
                  <RadioGroupItem
                    value="system"
                    id="theme-system"
                    className="sr-only"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-white to-gray-900 border flex items-center justify-center">
                          <IconDeviceDesktop className="w-4 h-4" />
                        </div>
                        <span className="font-medium">System</span>
                      </div>
                      {theme === "system" && (
                        <Badge variant="default" className="bg-primary">
                          <IconCheck className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="rounded-md overflow-hidden border">
                      <div className="bg-linear-to-br from-white to-gray-900 p-4 space-y-2">
                        <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-400 rounded w-1/2"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Adapts to system settings
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconLanguage className="w-5 h-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Customize your language and regional preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Display Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">🇬🇧 English</div>
                  </SelectItem>
                  <SelectItem value="ms">
                    <div className="flex items-center gap-2">
                      🇲🇾 Bahasa Malaysia
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Language used throughout the application
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="asia-kuala-lumpur">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-kuala-lumpur">
                    <div className="flex items-center gap-2">
                      <IconWorld className="w-4 h-4" />
                      Asia/Kuala Lumpur (GMT+8)
                    </div>
                  </SelectItem>
                  <SelectItem value="asia-singapore">
                    Asia/Singapore (GMT+8)
                  </SelectItem>
                  <SelectItem value="asia-jakarta">
                    Asia/Jakarta (GMT+7)
                  </SelectItem>
                  <SelectItem value="asia-bangkok">
                    Asia/Bangkok (GMT+7)
                  </SelectItem>
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
                  <SelectItem value="dd-mm-yyyy">
                    DD/MM/YYYY (09/02/2026)
                  </SelectItem>
                  <SelectItem value="mm-dd-yyyy">
                    MM/DD/YYYY (02/09/2026)
                  </SelectItem>
                  <SelectItem value="yyyy-mm-dd">
                    YYYY-MM-DD (2026-02-09)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="number-format">Number Format</Label>
              <Select defaultValue="comma">
                <SelectTrigger id="number-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comma">1,234.56 (Comma)</SelectItem>
                  <SelectItem value="period">1.234,56 (Period)</SelectItem>
                  <SelectItem value="space">1 234.56 (Space)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTextSize className="w-5 h-5" />
            Display Settings
          </CardTitle>
          <CardDescription>Adjust how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select
                value={displaySettings.fontSize}
                onValueChange={(value) =>
                  setDisplaySettings({ ...displaySettings, fontSize: value })
                }
              >
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium (Default)</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="density">Content Density</Label>
              <Select
                value={displaySettings.density}
                onValueChange={(value) =>
                  setDisplaySettings({ ...displaySettings, density: value })
                }
              >
                <SelectTrigger id="density">
                  <SelectValue placeholder="Select density" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">
                    Comfortable (Default)
                  </SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce spacing and padding for more content
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={uiPreferences.compactMode}
                onCheckedChange={(checked) =>
                  setUiPreferences({ ...uiPreferences, compactMode: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sidebar-collapsed">
                  Collapse Sidebar by Default
                </Label>
                <p className="text-sm text-muted-foreground">
                  Start with navigation sidebar minimized
                </p>
              </div>
              <Switch
                id="sidebar-collapsed"
                checked={displaySettings.sidebarCollapsed}
                onCheckedChange={(checked) =>
                  setDisplaySettings({
                    ...displaySettings,
                    sidebarCollapsed: checked,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>Options to improve usability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Show Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable transitions and animated effects
              </p>
            </div>
            <Switch
              id="animations"
              checked={uiPreferences.showAnimations}
              onCheckedChange={(checked) =>
                setUiPreferences({ ...uiPreferences, showAnimations: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations for motion sensitivity
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={uiPreferences.reducedMotion}
              onCheckedChange={(checked) =>
                setUiPreferences({ ...uiPreferences, reducedMotion: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={uiPreferences.highContrast}
              onCheckedChange={(checked) =>
                setUiPreferences({ ...uiPreferences, highContrast: checked })
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

export default AppearanceSettingsPage;
