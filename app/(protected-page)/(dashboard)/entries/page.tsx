import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  IconUpload, 
  IconSearch, 
  IconFilter, 
  IconDownload, 
  IconEdit, 
  IconTrash,
  IconBolt,
  IconDroplet,
  IconGasStation,
  IconCalendar,
  IconCheck,
  IconClock
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EntriesPage = () => {
  // Mock data - will be replaced with Firestore data
  const entries = [
    {
      id: "1",
      utilityType: "electricity",
      provider: "TNB",
      amount: 320.50,
      usage: 850,
      unit: "kWh",
      co2e: 498.95,
      billingDate: "2026-01-15",
      uploadDate: "2026-01-16",
      status: "verified",
      extractionMethod: "auto",
      confidence: 0.94
    },
    {
      id: "2",
      utilityType: "water",
      provider: "SAJ",
      amount: 45.20,
      usage: 28,
      unit: "m³",
      co2e: 8.34,
      billingDate: "2026-01-12",
      uploadDate: "2026-01-13",
      status: "verified",
      extractionMethod: "auto",
      confidence: 0.89
    },
    {
      id: "3",
      utilityType: "fuel",
      provider: "Petron",
      amount: 180.00,
      usage: 72,
      unit: "L",
      co2e: 166.32,
      billingDate: "2026-01-10",
      uploadDate: "2026-01-11",
      status: "pending",
      extractionMethod: "manual",
      confidence: null
    },
    {
      id: "4",
      utilityType: "electricity",
      provider: "TNB",
      amount: 298.80,
      usage: 795,
      unit: "kWh",
      co2e: 466.67,
      billingDate: "2025-12-15",
      uploadDate: "2025-12-16",
      status: "verified",
      extractionMethod: "auto",
      confidence: 0.91
    },
    {
      id: "5",
      utilityType: "water",
      provider: "SAJ",
      amount: 42.10,
      usage: 25,
      unit: "m³",
      co2e: 7.45,
      billingDate: "2025-12-12",
      uploadDate: "2025-12-14",
      status: "verified",
      extractionMethod: "auto",
      confidence: 0.87
    },
  ];

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return <IconBolt className="w-4 h-4 text-yellow-500" />;
      case "water":
        return <IconDroplet className="w-4 h-4 text-cyan-500" />;
      case "fuel":
        return <IconGasStation className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalEmissions = entries.reduce((sum, entry) => sum + entry.co2e, 0);
  const verifiedCount = entries.filter(e => e.status === "verified").length;
  const autoExtractedCount = entries.filter(e => e.extractionMethod === "auto").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emission Entries</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all utility bill entries and carbon calculations
          </p>
        </div>
        <Button>
          <IconUpload className="w-4 h-4 mr-2" />
          Upload New Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {autoExtractedCount} auto-extracted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total CO2e</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              From all entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedCount}/{entries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((verifiedCount / entries.length) * 100).toFixed(0)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 bills</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Entries</CardTitle>
              <CardDescription>View and manage your emission data entries</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <IconDownload className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by provider, date, or amount..." 
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IconFilter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Utility Type</DropdownMenuLabel>
                <DropdownMenuItem>Electricity</DropdownMenuItem>
                <DropdownMenuItem>Water</DropdownMenuItem>
                <DropdownMenuItem>Fuel</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuItem>Verified</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Method</DropdownMenuLabel>
                <DropdownMenuItem>Auto-extracted</DropdownMenuItem>
                <DropdownMenuItem>Manual Entry</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Provider</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usage</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CO2e (kg)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id} className={`border-b ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        {getUtilityIcon(entry.utilityType)}
                        <span className="capitalize text-sm">{entry.utilityType}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-sm">{entry.provider}</td>
                    <td className="p-4 align-middle text-sm font-medium">
                      {entry.usage} {entry.unit}
                    </td>
                    <td className="p-4 align-middle text-sm">RM {entry.amount.toFixed(2)}</td>
                    <td className="p-4 align-middle">
                      <span className="text-sm font-bold">{entry.co2e.toFixed(2)}</span>
                      {entry.confidence && (
                        <div className="text-xs text-muted-foreground">
                          {(entry.confidence * 100).toFixed(0)}% confidence
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1 text-sm">
                        <IconCalendar className="w-3 h-3 text-muted-foreground" />
                        {formatDate(entry.billingDate)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded {formatDate(entry.uploadDate)}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {getStatusBadge(entry.status)}
                      {entry.extractionMethod === "auto" && (
                        <Badge variant="outline" className="ml-1 text-xs">AI</Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <IconEdit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <IconTrash className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {entries.length} of {entries.length} entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntriesPage;