import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  IconCreditCard,
  IconDownload,
  IconCheck,
  IconX,
  IconRocket,
  IconAlertCircle,
  IconCalendar,
  IconReceipt,
  IconTrendingUp,
  IconSparkles,
  IconShieldCheck,
  IconUsers,
  IconDatabase,
} from "@tabler/icons-react";

const BillingPage = () => {
  const currentPlan = {
    name: "Premium",
    price: 499,
    currency: "MYR",
    billingCycle: "monthly",
    nextBillingDate: "April 15, 2025",
    status: "active"
  };

  const usage = {
    billsUploaded: 147,
    billsLimit: 500,
    reportsGenerated: 23,
    reportsLimit: 100,
    storageUsed: 2.4,
    storageLimit: 10,
    users: 8,
    usersLimit: 25
  };

  const plans = [
    {
      name: "Trial",
      price: 0,
      period: "14 days",
      description: "Perfect for testing",
      features: [
        { text: "25 bill uploads/month", included: true },
        { text: "5 reports/month", included: true },
        { text: "1 user", included: true },
        { text: "Basic AI extraction", included: true },
        { text: "Sector benchmarking", included: false },
        { text: "Team collaboration", included: false },
        { text: "API access", included: false },
        { text: "Priority support", included: false }
      ],
      current: false
    },
    {
      name: "Standard",
      price: 199,
      period: "per month",
      description: "For small businesses",
      features: [
        { text: "100 bill uploads/month", included: true },
        { text: "25 reports/month", included: true },
        { text: "Up to 5 users", included: true },
        { text: "Advanced AI extraction", included: true },
        { text: "Sector benchmarking", included: true },
        { text: "Team collaboration", included: true },
        { text: "API access", included: false },
        { text: "Priority support", included: false }
      ],
      current: false,
      popular: false
    },
    {
      name: "Premium",
      price: 499,
      period: "per month",
      description: "Most popular choice",
      features: [
        { text: "500 bill uploads/month", included: true },
        { text: "100 reports/month", included: true },
        { text: "Up to 25 users", included: true },
        { text: "Advanced AI extraction", included: true },
        { text: "Sector benchmarking", included: true },
        { text: "Team collaboration", included: true },
        { text: "API access", included: true },
        { text: "Priority support", included: true }
      ],
      current: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: null,
      period: "custom",
      description: "For large organizations",
      features: [
        { text: "Unlimited bill uploads", included: true },
        { text: "Unlimited reports", included: true },
        { text: "Unlimited users", included: true },
        { text: "Advanced AI extraction", included: true },
        { text: "Sector benchmarking", included: true },
        { text: "Team collaboration", included: true },
        { text: "API access", included: true },
        { text: "Dedicated support", included: true }
      ],
      current: false
    }
  ];

  const invoices = [
    {
      id: "INV-2025-003",
      date: "March 15, 2025",
      amount: 499,
      status: "paid",
      description: "Premium Plan - March 2025"
    },
    {
      id: "INV-2025-002",
      date: "February 15, 2025",
      amount: 499,
      status: "paid",
      description: "Premium Plan - February 2025"
    },
    {
      id: "INV-2025-001",
      date: "January 15, 2025",
      amount: 499,
      status: "paid",
      description: "Premium Plan - January 2025"
    },
    {
      id: "INV-2024-012",
      date: "December 15, 2024",
      amount: 199,
      status: "paid",
      description: "Standard Plan - December 2024"
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Credit Card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/2027",
      default: true
    },
    {
      id: 2,
      type: "Credit Card",
      last4: "5555",
      brand: "Mastercard",
      expiry: "08/2026",
      default: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, usage, and payment methods
        </p>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Current Plan */}
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your active subscription</CardDescription>
              </div>
              <Badge variant="default" className="bg-green-500">
                {currentPlan.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{currentPlan.name}</span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold">RM {currentPlan.price}</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next billing date</span>
                <span className="font-medium flex items-center gap-1">
                  <IconCalendar className="w-4 h-4" />
                  {currentPlan.nextBillingDate}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing cycle</span>
                <span className="font-medium capitalize">{currentPlan.billingCycle}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <IconTrendingUp className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
              <Button variant="outline" className="flex-1">
                Cancel Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Track your consumption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bills Uploaded */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Bills Uploaded</span>
                <span className="text-muted-foreground">
                  {usage.billsUploaded} / {usage.billsLimit}
                </span>
              </div>
              <Progress value={(usage.billsUploaded / usage.billsLimit) * 100} />
            </div>

            {/* Reports Generated */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Reports Generated</span>
                <span className="text-muted-foreground">
                  {usage.reportsGenerated} / {usage.reportsLimit}
                </span>
              </div>
              <Progress value={(usage.reportsGenerated / usage.reportsLimit) * 100} />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Storage Used</span>
                <span className="text-muted-foreground">
                  {usage.storageUsed} GB / {usage.storageLimit} GB
                </span>
              </div>
              <Progress value={(usage.storageUsed / usage.storageLimit) * 100} />
            </div>

            {/* Users */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Team Members</span>
                <span className="text-muted-foreground">
                  {usage.users} / {usage.usersLimit}
                </span>
              </div>
              <Progress value={(usage.users / usage.usersLimit) * 100} />
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <IconAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                Usage resets on the 15th of each month. Upgrade anytime for higher limits.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${
                  plan.current 
                    ? "border-primary shadow-lg" 
                    : plan.popular 
                    ? "border-primary" 
                    : ""
                }`}
              >
                {plan.popular && !plan.current && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                    Current Plan
                  </Badge>
                )}
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>

                  <div>
                    {plan.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">RM {plan.price}</span>
                        <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold">Contact Sales</div>
                    )}
                  </div>

                  <Separator />

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <IconCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <IconX className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={!feature.included ? "text-muted-foreground" : ""}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : plan.price !== null ? "Upgrade" : "Contact Sales"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button size="sm">
              <IconCreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconCreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{method.brand} •••• {method.last4}</span>
                          {method.default && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.default && (
                        <Button variant="outline" size="sm">
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <IconReceipt className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{invoice.id}</span>
                          <Badge 
                            variant={invoice.status === "paid" ? "default" : "secondary"}
                            className={invoice.status === "paid" ? "bg-green-500" : ""}
                          >
                            {invoice.status === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.description}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg">RM {invoice.amount}</span>
                      <Button variant="outline" size="sm">
                        <IconDownload className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise CTA */}
      <Card className="border-primary bg-linear-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <IconRocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Need a Custom Plan?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our sales team for enterprise pricing, custom features, and dedicated support
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    <IconUsers className="w-3 h-3 mr-1" />
                    Unlimited users
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <IconDatabase className="w-3 h-3 mr-1" />
                    Unlimited storage
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <IconShieldCheck className="w-3 h-3 mr-1" />
                    SLA guarantee
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <IconSparkles className="w-3 h-3 mr-1" />
                    Custom features
                  </Badge>
                </div>
              </div>
            </div>
            <Button size="lg">
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
