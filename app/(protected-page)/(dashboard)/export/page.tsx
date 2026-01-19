import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  IconDownload,
  IconFileText,
  IconFileSpreadsheet,
  IconDatabase,
  IconCalendar,
  IconFilter,
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconArchive,
  IconFileZip
} from "@tabler/icons-react";

const ExportPage = () => {
  const exportHistory = [
    {
      id: 1,
      type: "CSV",
      name: "Bill_Entries_2025_Q1.csv",
      size: "2.4 MB",
      rows: 1247,
      date: "Jan 15, 2026",
      status: "completed"
    },
    {
      id: 2,
      type: "PDF",
      name: "ESG_Report_December_2025.pdf",
      size: "4.8 MB",
      rows: null,
      date: "Jan 10, 2026",
      status: "completed"
    },
    {
      id: 3,
      type: "JSON",
      name: "Full_Database_Export.json",
      size: "18.3 MB",
      rows: 5432,
      date: "Jan 5, 2026",
      status: "completed"
    },
    {
      id: 4,
      type: "ZIP",
      name: "Archive_2025.zip",
      size: "45.2 MB",
      rows: null,
      date: "Dec 31, 2025",
      status: "completed"
    }
  ];

  const exportTemplates = [
    {
      id: 1,
      name: "Bill Entries (CSV)",
      description: "Export all bill entries with consumption, costs, and emission data",
      icon: IconFileSpreadsheet,
      fields: ["Date", "Provider", "Type", "Consumption", "Cost", "CO2e", "Confidence"],
      format: "CSV"
    },
    {
      id: 2,
      name: "Emission Summary (PDF)",
      description: "Visual report with charts showing emission trends and breakdown",
      icon: IconFileText,
      fields: ["Total Emissions", "Trends", "Breakdown", "Sector Comparison"],
      format: "PDF"
    },
    {
      id: 3,
      name: "Complete Database (JSON)",
      description: "Full export of all data in JSON format for backup or migration",
      icon: IconDatabase,
      fields: ["Entries", "Users", "Settings", "Reports", "Audit Logs"],
      format: "JSON"
    },
    {
      id: 4,
      name: "Annual Archive (ZIP)",
      description: "Compressed archive with all bills, reports, and documents",
      icon: IconArchive,
      fields: ["Bills (images)", "Reports (PDFs)", "Metadata (JSON)"],
      format: "ZIP"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Export & Download</h1>
        <p className="text-muted-foreground mt-2">
          Download your data in various formats for backup, analysis, or compliance
        </p>
      </div>

      {/* Quick Export Options */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Quick Export Templates</CardTitle>
          <CardDescription>Pre-configured export formats ready to download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {exportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{template.name}</h4>
                          <Badge variant="outline" className="text-xs">{template.format}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.fields.map((field, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          <IconDownload className="w-4 h-4 mr-2" />
                          Export {template.format}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Export Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="w-5 h-5" />
            Custom Export
          </CardTitle>
          <CardDescription>Build a custom export with specific filters and fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <IconCalendar className="w-4 h-4" />
              Date Range
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">From</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  defaultValue="2025-01-01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">To</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  defaultValue="2026-01-17"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Types */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <IconDatabase className="w-4 h-4" />
              Data to Include
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Bill Entries",
                "Emission Calculations",
                "Reports",
                "User Activity",
                "Audit Logs",
                "System Settings"
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <input type="checkbox" defaultChecked={index < 3} className="w-4 h-4" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Format Selection */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Export Format</h4>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { format: "CSV", desc: "Spreadsheet" },
                { format: "JSON", desc: "Developer" },
                { format: "PDF", desc: "Report" },
                { format: "ZIP", desc: "Archive" }
              ].map((item, index) => (
                <label key={index} className="relative p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="format" 
                    defaultChecked={index === 0}
                    className="absolute top-3 right-3 w-4 h-4"
                  />
                  <div className="font-semibold text-sm">{item.format}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <IconDownload className="w-4 h-4 mr-2" />
              Generate Export
            </Button>
            <Button variant="outline">
              <IconClock className="w-4 h-4 mr-2" />
              Schedule Export
            </Button>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <IconAlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-200">
              Large exports may take several minutes to process. You&apos;ll receive a notification when ready.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Previously generated exports</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <IconArchive className="w-4 h-4 mr-2" />
              View Archive
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        {item.type === "CSV" && <IconFileSpreadsheet className="w-6 h-6 text-green-500" />}
                        {item.type === "PDF" && <IconFileText className="w-6 h-6 text-red-500" />}
                        {item.type === "JSON" && <IconDatabase className="w-6 h-6 text-blue-500" />}
                        {item.type === "ZIP" && <IconFileZip className="w-6 h-6 text-yellow-500" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{item.name}</span>
                          <Badge variant="outline" className="text-xs">{item.type}</Badge>
                          {item.status === "completed" && (
                            <Badge variant="default" className="bg-green-500 text-xs">
                              <IconCheck className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span>{item.size}</span>
                          {item.rows && <span>• {item.rows} rows</span>}
                          <span>• {item.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <IconDownload className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PDPA Compliance Notice */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <IconAlertCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Data Export & PDPA Compliance</h4>
              <p className="text-sm text-muted-foreground mb-3">
                As per Malaysia&apos;s Personal Data Protection Act (PDPA), you have the right to export your data at any time. 
                All exports are encrypted and logged for audit purposes. Exported data remains your property and should be 
                handled securely.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">AES-256 Encrypted</Badge>
                <Badge variant="secondary" className="text-xs">Audit Logged</Badge>
                <Badge variant="secondary" className="text-xs">PDPA Compliant</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;
