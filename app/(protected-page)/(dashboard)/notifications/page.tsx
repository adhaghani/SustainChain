import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  IconBell,
  IconBellOff,
  IconCheck,
  IconCheckbox,
  IconAlertCircle,
  IconInfoCircle,
  IconSparkles,
  IconFileText,
  IconUsers,
  IconSettings,
  IconTrash,
  IconFilter
} from "@tabler/icons-react";

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: "success",
      icon: IconCheck,
      title: "Report Generated Successfully",
      message: "Your ESG Compliance Report (Q4 2025) is ready for download",
      timestamp: "2 minutes ago",
      read: false,
      actionUrl: "/dashboard/reports"
    },
    {
      id: 2,
      type: "info",
      icon: IconSparkles,
      title: "AI Extraction Completed",
      message: "3 new bills have been processed with 95% confidence score",
      timestamp: "1 hour ago",
      read: false,
      actionUrl: "/dashboard/entries"
    },
    {
      id: 3,
      type: "warning",
      icon: IconAlertCircle,
      title: "Approaching Usage Limit",
      message: "You've used 450/500 bill uploads this month. Consider upgrading your plan.",
      timestamp: "3 hours ago",
      read: false,
      actionUrl: "/dashboard/billing"
    },
    {
      id: 4,
      type: "info",
      icon: IconUsers,
      title: "New Team Member Added",
      message: "Sarah Ahmad has been added to your workspace as a Clerk",
      timestamp: "Yesterday",
      read: true,
      actionUrl: "/dashboard/users"
    },
    {
      id: 5,
      type: "success",
      icon: IconCheckbox,
      title: "Sector Ranking Improved",
      message: "Your company moved up to Top 28% in the Manufacturing sector",
      timestamp: "Yesterday",
      read: true,
      actionUrl: "/dashboard/analytics"
    },
    {
      id: 6,
      type: "info",
      icon: IconFileText,
      title: "Monthly Report Reminder",
      message: "Don't forget to generate your monthly ESG report by January 25th",
      timestamp: "2 days ago",
      read: true,
      actionUrl: "/dashboard/reports"
    },
    {
      id: 7,
      type: "info",
      icon: IconSettings,
      title: "System Maintenance Scheduled",
      message: "Planned maintenance on January 20th, 2AM-4AM MYT. No downtime expected.",
      timestamp: "3 days ago",
      read: true
    },
    {
      id: 8,
      type: "success",
      icon: IconCheck,
      title: "Onboarding Completed",
      message: "Welcome to SustainChain! Your account setup is complete.",
      timestamp: "1 week ago",
      read: true
    }
  ];

  const stats = {
    unread: notifications.filter(n => !n.read).length,
    today: notifications.filter(n => n.timestamp.includes('ago') && !n.timestamp.includes('days')).length,
    thisWeek: notifications.filter(n => n.timestamp.includes('days') || n.timestamp.includes('Yesterday')).length
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          icon: "text-green-500",
          badge: "bg-green-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          icon: "text-yellow-500",
          badge: "bg-yellow-500"
        };
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: "text-red-500",
          badge: "bg-red-500"
        };
      default:
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          icon: "text-blue-500",
          badge: "bg-blue-500"
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your ESG activities and system events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconFilter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <IconCheckbox className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm">
            <IconSettings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-3xl font-bold">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IconBell className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-3xl font-bold">{stats.today}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <IconInfoCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold">{stats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <IconCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Chronological list of all your notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              const colors = getNotificationColor(notification.type);
              
              return (
                <Card key={notification.id} className={`${notification.read ? 'opacity-60' : ''}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-4">
                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className={`w-2 h-2 rounded-full ${colors.badge} mt-2 shrink-0`} />
                      )}
                      {notification.read && (
                        <div className="w-2 h-2 mt-2 shrink-0" />
                      )}

                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          )}
                          {!notification.read && (
                            <Button variant="ghost" size="sm">
                              <IconCheck className="w-4 h-4 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <IconTrash className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <Button variant="outline">Load More Notifications</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSettings className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <h4 className="font-medium text-sm">Email Notifications</h4>
              <p className="text-xs text-muted-foreground">Receive notifications via email</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <h4 className="font-medium text-sm">Push Notifications</h4>
              <p className="text-xs text-muted-foreground">Browser and mobile push notifications</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <h4 className="font-medium text-sm">Weekly Digest</h4>
              <p className="text-xs text-muted-foreground">Get a weekly summary every Monday</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
            <div>
              <h4 className="font-medium text-sm">Mute All Notifications</h4>
              <p className="text-xs text-muted-foreground">Temporarily disable all notifications</p>
            </div>
            <Button variant="outline" size="sm">
              <IconBellOff className="w-4 h-4 mr-2" />
              Mute
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
