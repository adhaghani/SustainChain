'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  TrendingDown,
  TrendingUp,
  Leaf,
  Target,
  BarChart3,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BillUploader from '@/components/dashboard/bill-uploader';

export default function DashboardPage() {
  // Mock data - in production, fetch from Firestore
  const emissionsData = {
    current: 2450,
    previous: 2680,
    unit: 'kg CO2e',
    percentChange: -8.6,
  };

  const complianceData = {
    completed: 12,
    total: 35,
    level: 'Basic SEDG Disclosure',
  };

  const benchmarkData = {
    userScore: 72,
    industryAvg: 58,
    topPerformers: 85,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            ESG Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track your environmental, social, and governance performance
          </p>
        </div>
        <Link href="/dashboard/bill-analysis">
          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload New Bill
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total CO2 Emissions Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Total CO2 Emissions
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              {emissionsData.current.toLocaleString()}
              <span className="text-lg font-normal text-slate-500 ml-1">
                {emissionsData.unit}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${
                  emissionsData.percentChange < 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                }`}
              >
                {emissionsData.percentChange < 0 ? (
                  <TrendingDown className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingUp className="w-3 h-3 mr-1" />
                )}
                {Math.abs(emissionsData.percentChange)}%
              </Badge>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                vs last month
              </span>
            </div>
            {/* Mini trend line visualization */}
            <div className="mt-4 flex items-end gap-1 h-12">
              {[40, 55, 45, 60, 35, 50, 30].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-200 dark:bg-emerald-500/30 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Progress Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Target className="w-4 h-4 text-blue-500" />
              Compliance Progress
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              {complianceData.completed}
              <span className="text-lg font-normal text-slate-500">
                /{complianceData.total}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {complianceData.level}
            </p>
            <Progress
              value={(complianceData.completed / complianceData.total) * 100}
              className="h-2 bg-slate-200 dark:bg-slate-700"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>
                {Math.round(
                  (complianceData.completed / complianceData.total) * 100
                )}
                % complete
              </span>
              <span>{complianceData.total - complianceData.completed} remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmark Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Industry Benchmark
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              {benchmarkData.userScore}
              <span className="text-lg font-normal text-slate-500">/100</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">
              Above Malaysian SME average
            </p>
            {/* Benchmark visualization */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-20">You</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${benchmarkData.userScore}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8">
                  {benchmarkData.userScore}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-20">Avg SME</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{ width: `${benchmarkData.industryAvg}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8">
                  {benchmarkData.industryAvg}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-20">Top 10%</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${benchmarkData.topPerformers}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8">
                  {benchmarkData.topPerformers}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bill Uploader Section */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">
            Quick Bill Analysis
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Upload your Malaysian utility bill for instant AI-powered ESG analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillUploader />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Generate ESG Report
                </h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Create a comprehensive SEDG-compliant report
                </p>
              </div>
              <Link href="/dashboard/reports">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  View All Analytics
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  Deep dive into your sustainability metrics
                </p>
              </div>
              <Link href="/dashboard/reports">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
