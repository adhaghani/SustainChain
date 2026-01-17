import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  IconDeviceFloppy, 
  IconRefresh, 
  IconWorld,
  IconBell,
  IconShield,
  IconDatabase,
  IconKey,
  IconMail,
  IconBolt,
  IconDroplet,
  IconGasStation,
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

const SystemConfigPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Manage system settings, emission factors, and integrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <IconRefresh className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button>
            <IconDeviceFloppy className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Basic information about your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Your Company Sdn Bhd" defaultValue="Muar Furniture Industries" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uen">UEN / Registration Number</Label>
              <Input id="uen" placeholder="202001012345" defaultValue="202001012345" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sector">Industry Sector</Label>
              <Select defaultValue="manufacturing">
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="fnb">Food & Beverage</SelectItem>
                  <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                  <SelectItem value="retail">Retail & Services</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees</Label>
              <Select defaultValue="50-200">
                <SelectTrigger id="employees">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="50-200">50-200</SelectItem>
                  <SelectItem value="200-500">200-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" placeholder="Enter full address" defaultValue="Lot 123, Jalan Industri Muar, 84000 Muar, Johor" />
          </div>
        </CardContent>
      </Card>

      {/* Emission Factors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Emission Factors (Malaysia)</CardTitle>
              <CardDescription>Carbon emission conversion rates for utilities</CardDescription>
            </div>
            <Badge variant="outline">Last Updated: Jan 2026</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>
              These factors are based on Malaysia Green Technology and Climate Change Centre (MGTC) 2025 standards.
              Modify only if using custom measurement methodologies.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Electricity */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <IconBolt className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 grid gap-2 md:grid-cols-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Electricity (Peninsular)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.001" defaultValue="0.587" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/kWh</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sabah Grid</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.001" defaultValue="0.612" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/kWh</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sarawak Grid</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.001" defaultValue="0.635" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/kWh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Water */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                <IconDroplet className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Water Treatment & Distribution</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.001" defaultValue="0.298" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/m³</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconInfoCircle className="w-4 h-4" />
                  <span>Includes treatment, pumping, and distribution</span>
                </div>
              </div>
            </div>

            {/* Fuel */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <IconGasStation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 grid gap-2 md:grid-cols-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Diesel (B10)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.01" defaultValue="2.31" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/L</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Petrol (RON95)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.01" defaultValue="2.18" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/L</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Natural Gas</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input type="number" step="0.001" defaultValue="1.95" className="w-24" />
                    <span className="text-sm text-muted-foreground">kg CO2e/m³</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconWorld className="w-5 h-5" />
            Localization
          </CardTitle>
          <CardDescription>Language and regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="default-language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="default-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="asia-kuala-lumpur">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-kuala-lumpur">Asia/Kuala Lumpur (GMT+8)</SelectItem>
                  <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="myr">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="myr">Malaysian Ringgit (RM)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="sgd">Singapore Dollar (S$)</SelectItem>
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
                  <SelectItem value="dd-mm-yyyy">DD/MM/YYYY (Malaysian)</SelectItem>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY (US)</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (ISO)</SelectItem>
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
            Notifications
          </CardTitle>
          <CardDescription>Configure email and system alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <IconMail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Bill Upload Confirmation</p>
                  <p className="text-xs text-muted-foreground">Receive email when bills are processed</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <IconMail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Monthly Report Ready</p>
                  <p className="text-xs text-muted-foreground">Alert when new reports are generated</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <IconMail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Emission Threshold Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify when emissions exceed targets</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Disabled</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <IconMail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Benchmarking Updates</p>
                  <p className="text-xs text-muted-foreground">New sector comparison data available</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API & Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconKey className="w-5 h-5" />
            API Keys & Integrations
          </CardTitle>
          <CardDescription>Manage external service connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold text-sm">Google Gemini API</p>
                <p className="text-xs text-muted-foreground mt-1">AI-powered bill extraction</p>
                <Badge variant="default" className="mt-2 bg-green-500">Active</Badge>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold text-sm">BigQuery Analytics</p>
                <p className="text-xs text-muted-foreground mt-1">Sector benchmarking data warehouse</p>
                <Badge variant="default" className="mt-2 bg-green-500">Active</Badge>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold text-sm">Firebase Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">User and tenant management</p>
                <Badge variant="default" className="mt-2 bg-green-500">Active</Badge>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold text-sm">Cloud Storage</p>
                <p className="text-xs text-muted-foreground mt-1">Bill image storage</p>
                <Badge variant="default" className="mt-2 bg-green-500">Active</Badge>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShield className="w-5 h-5" />
            Security & Compliance
          </CardTitle>
          <CardDescription>Data protection and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data Retention Period</Label>
              <Select defaultValue="5-years">
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-years">2 Years</SelectItem>
                  <SelectItem value="5-years">5 Years (Recommended)</SelectItem>
                  <SelectItem value="10-years">10 Years</SelectItem>
                  <SelectItem value="indefinite">Indefinite</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Required for ESG compliance audits</p>
            </div>

            <div className="space-y-2">
              <Label>PDPA Compliance</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <IconShield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Enabled</p>
                  <p className="text-xs text-muted-foreground">Malaysia PDPA compliant</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Backup Schedule</Label>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <IconDatabase className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Automated Daily Backups</p>
                <p className="text-xs text-muted-foreground">Last backup: Today at 02:00 AM (GMT+8)</p>
              </div>
              <Badge variant="default" className="bg-green-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>
          <IconDeviceFloppy className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default SystemConfigPage;