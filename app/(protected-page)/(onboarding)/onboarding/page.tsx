"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconBuildingFactory,
  IconSparkles,
  IconRocket
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const steps = [
    { number: 1, title: "Company Setup", description: "Tell us about your business" },
    { number: 2, title: "Configure Settings", description: "Set up emission factors" },
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to SustainChain! 🌱</h1>
          <p className="text-muted-foreground text-lg">
            Let&apos;s get you set up in just 3 simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep > step.number ? 'bg-green-500 text-white' :
                        currentStep === step.number ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {currentStep > step.number ? (
                          <IconCheck className="w-5 h-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <p className="text-xs font-medium mt-2 text-center">{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="min-h-125">
          <CardHeader>
            <CardTitle className="text-2xl">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-base">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Company Setup */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <IconBuildingFactory className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Company Information</h4>
                    <p className="text-sm text-muted-foreground">
                      This helps us personalize your experience and benchmarking
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input id="company-name" placeholder="Muar Furniture Industries Sdn Bhd" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uen">UEN / Registration Number *</Label>
                    <Input id="uen" placeholder="202001012345" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Industry Sector *</Label>
                    <Select>
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="Select your sector" />
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
                    <Select>
                      <SelectTrigger id="employees">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Business Location *</Label>
                  <Select>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="johor">Johor</SelectItem>
                      <SelectItem value="selangor">Selangor</SelectItem>
                      <SelectItem value="penang">Penang</SelectItem>
                      <SelectItem value="kl">Kuala Lumpur</SelectItem>
                      <SelectItem value="sabah">Sabah</SelectItem>
                      <SelectItem value="sarawak">Sarawak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">Administrator Email *</Label>
                  <Input id="admin-email" type="email" placeholder="admin@yourcompany.com" />
                  <p className="text-xs text-muted-foreground">
                    This will be your primary account for managing users and settings
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Configure Settings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <IconSparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Emission Factors Configuration</h4>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ve pre-configured Malaysia emission factors. You can adjust them later.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm">Electricity Grid Selection</h4>
                  <div className="space-y-2">
                    <Label htmlFor="grid">Your Electricity Grid *</Label>
                    <Select defaultValue="peninsular">
                      <SelectTrigger id="grid">
                        <SelectValue placeholder="Select grid" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peninsular">Peninsular Malaysia (0.587 kg CO2e/kWh)</SelectItem>
                        <SelectItem value="sabah">Sabah Grid (0.612 kg CO2e/kWh)</SelectItem>
                        <SelectItem value="sarawak">Sarawak Grid (0.635 kg CO2e/kWh)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Based on your location, we recommend Peninsular Malaysia grid factor
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Pre-configured Emission Factors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Water Treatment & Distribution</p>
                        <p className="text-xs text-muted-foreground">Standard Malaysia factor</p>
                      </div>
                      <Badge variant="outline">0.298 kg CO2e/m³</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Diesel Fuel (B10)</p>
                        <p className="text-xs text-muted-foreground">Standard Malaysia factor</p>
                      </div>
                      <Badge variant="outline">2.31 kg CO2e/L</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Petrol (RON95)</p>
                        <p className="text-xs text-muted-foreground">Standard Malaysia factor</p>
                      </div>
                      <Badge variant="outline">2.18 kg CO2e/L</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-semibold text-sm">Language & Regional Settings</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
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
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                Next
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/dashboard'}>
                <IconRocket className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Check out our{" "}
            <a href="#" className="text-primary hover:underline">
              Quick Start Guide
            </a>{" "}
            or{" "}
            <a href="#" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
