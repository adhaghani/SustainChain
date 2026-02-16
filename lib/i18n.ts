export const translations = {
  en: {
    nav: {
      features: "Features",
      impact: "Impact",
      howItWorks: "How it Works",
      getStarted: "Get Started",
    },
    auth: {
      signIn: {
        title: "Login to your account",
        description: "Enter your email below to login to your account",
        emailLabel: "Email",
        emailPlaceholder: "m@example.com",
        passwordLabel: "Password",
        loginButton: "Login",
        loggingIn: "Logging in...",
        googleButton: "Login with Google",
        noAccount: "Don't have an account?",
        signUpLink: "Sign up"
      },
      signUp: {
        title: "Create your account",
        stepIndicator: "Step {currentStep} of {totalSteps}:",
        steps: {
          company: "Company Information",
          admin: "Admin Account",
          password: "Password & Agreement"
        },
        companyInfo: {
          title: "Company Information",
          companyName: "Company Name *",
          companyPlaceholder: "ABC Company Sdn Bhd",
          uen: "UEN / ROC Number *",
          uenPlaceholder: "ROC123456",
          sector: "Industry Sector *",
          sectorPlaceholder: "Select your industry",
          address: "Business Address *",
          addressPlaceholder: "123 Example Street",
          city: "City",
          cityPlaceholder: "Kuala Lumpur",
          state: "State",
          statePlaceholder: "Selangor",
          postcode: "Postcode",
          postcodePlaceholder: "50000"
        },
        adminAccount: {
          title: "Admin Account",
          fullName: "Full Name *",
          namePlaceholder: "John Doe",
          workEmail: "Work Email *",
          emailPlaceholder: "you@company.com",
          phone: "Phone Number",
          phonePlaceholder: "+60123456789"
        },
        password: {
          title: "Secure Your Account",
          password: "Password *",
          confirmPassword: "Confirm Password *",
          passwordHint: "Must be at least 6 characters",
          agreeTo: "I agree to the",
          termsOfService: "Terms of Service",
          and: "and",
          privacyPolicy: "Privacy Policy"
        },
        buttons: {
          back: "Back",
          next: "Next",
          createAccount: "Create account",
          creating: "Creating account..."
        },
        haveAccount: "Already have an account?",
        signInLink: "Sign in"
      },
      errors: {
        firebaseNotConfigured: "Firebase is not configured. Please set up environment variables.",
        signInFailed: "Failed to sign in. Please try again.",
        googleSignInFailed: "Failed to sign in with Google.",
        linkedinComingSoon: "LinkedIn SSO integration coming soon",
        fillRequired: "Please fill in all required fields",
        validEmail: "Please enter a valid email address",
        passwordMismatch: "Passwords do not match",
        passwordLength: "Password must be at least 6 characters",
        agreeTerms: "Please agree to the Terms of Service and Privacy Policy",
        registrationFailed: "Registration failed"
      },
      sectors: {
        manufacturing: "Manufacturing",
        technology: "Technology",
        foodBeverage: "Food & Beverage",
        logistics: "Logistics",
        retail: "Retail",
        agriculture: "Agriculture",
        construction: "Construction",
        healthcare: "Healthcare",
        education: "Education",
        hospitality: "Hospitality",
        other: "Other"
      }
    },
    hero: {
      badge: "Ready for MITI & Bursa ESG Mandates 2027",
      title: "Business Survival,",
      subtitle: "Not Just Reporting.",
      description: "Empowering 1.2M Malaysian SMEs to secure their future. Turn messy bills into audit-ready ESG reports with Gemini AI.",
      ctaStart: "Start Reporting Free",
      ctaDemo: "View Demo",
      alignedWith: "Aligned with",
    },
    problem: {
      title: "The Reality: Panic Mode",
      complianceTitle: "Compliance is Mandatory",
      complianceDesc: "Using spreadsheets is no longer enough. Large corps are dropping non-compliant suppliers.",
      costTitle: "Consultants are Expensive",
      costDesc: "Traditional ESG audits cost RM 20k-50k. SMEs cannot afford this.",
      solutionTitle: "The SustainChain Solution",
      solutionFeatures: [
        "AI-Powered Data Analyst (Gemini 1.5)",
        "Instant Photo-to-Report Conversion",
        "Zero Cost Barrier for basic reporting",
        "Bilingual (Malay & English) Native"
      ]
    },
    features: {
      title: "Technical \"Wow\" Factor",
      description: "Built with Gemini 1.5 Pro to process messy real-world data into structured insights.",
      cards: [
        {
          title: "Multimodal Input",
          desc: "Don't type. Just snap a photo of your TNB bill or fuel receipt. Gemini extracts kWh and CO2e automatically.",
          highlight: "Powered by Gemini 1.5 Flash"
        },
        {
          title: "Localized for Malaysia",
          desc: "Fully bilingual interface and AI processing in Malay and English. Designed for the local SME workforce.",
          highlight: "Native Language Support"
        },
        {
          title: "Automated Benchmarking",
          desc: "See how your carbon footprint compares to other manufacturers in Muar or Klang Valley.",
          highlight: "BigQuery Analytics"
        }
      ]
    },
    howItWorks: {
      title: "From Receipt to Report in Seconds",
      steps: [
        { title: "Snap", desc: "Upload a photo of your utility bill." },
        { title: "Extract", desc: "Gemini identifies usage data." },
        { title: "Calculate", desc: "Auto-conversion to CO2e." },
        { title: "Report", desc: "Download compliant PDF." }
      ]
    },
    impact: {
      title: "United Nations SDG Alignment",
      sdgs: [
        { title: "Decent Work & Economic Growth" },
        { title: "Industry, Innovation & Infrastructure" },
        { title: "Responsible Consumption & Production" }
      ]
    },
    cta: {
      title: "Don't Get Left Behind.",
      description: "Join the revolution of sustainable Malaysian businesses accurately tracking their impact.",
      button: "Start Your Free Assessment"
    },
    footer: {
      builtFor: "Built for KitaHack.",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact"
    },
    dashboard: {
      header: {
        title: "ESG Reporting Dashboard",
        helpCenter: "Help Center"
      },
      sidebar: {
        uploadBills: "Upload Bills",
        billEntries: "Bill Entries",
        analytics: "Analytics",
        reports: "Reports",
        impact: "Impact",
        users: "Users",
        tenants: "Tenants",
        systemConfig: "System Config",
        auditLog: "Audit Log",
        settings: "Settings",
        changelog: "Changelog",
        notifications: "Notifications",
        export: "Export Data",
        management: "Management"
      },
      common: {
        search: "Search",
        filter: "Filter",
        download: "Download",
        export: "Export",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        loading: "Loading...",
        noData: "No data available",
        error: "An error occurred",
        success: "Success",
        confirm: "Confirm",
        back: "Back",
        next: "Next",
        previous: "Previous",
        uploadBill: "Upload Bill",
        exportReport: "Export Report",
        totalEmissions: "Total Emissions",
        sectorRanking: "Sector Ranking",
        electricityUsage: "Electricity Usage",
        fuelConsumption: "Fuel Consumption",
        waterUsage: "Water Usage",
        fromLastMonth: "from last month",
        betterThanPeers: "Better than {percent}% of peers",
        ofTotal: "of total"
      },
      userMenu: {
        account: "Account",
        billing: "Billing",
        notifications: "Notifications",
        logout: "Log out"
      },
      pages: {
        dashboard: {
          title: "Dashboard",
          subtitle: "Overview of your carbon footprint and ESG metrics",
          readOnlyAccess: "(Read-only access)",
          viewerBanner: "👁️ You have view-only access. Contact your administrator to request additional permissions.",
          emissionBreakdown: "Emission Breakdown",
          emissionBreakdownDesc: "Carbon footprint by utility type (Current Month)",
          monthlyTrend: "Monthly Trend",
          monthlyTrendDesc: "Carbon emissions over time (kg CO2e)",
          topEmitters: "Top Emitters",
          recentActivity: "Recent Activity",
          insights: "AI Insights",
          electricity: "Electricity",
          fuel: "Fuel",
          water: "Water",
          dataEntries: "Data Entries",
          thisMonth: "This Month",
          bills: "Bills",
          autoExtracted: "auto-extracted",
          manual: "manual",
          noEmissionData: "No emission data available yet.",
          uploadFirstBill: "Upload Your First Bill",
          sectorAvg: "Sector avg",
          noTrendData: "No trend data available yet.",
          uploadForTrends: "Upload bills for at least 2 months to see trends.",
          failedToLoad: "Failed to Load Dashboard",
          retry: "Retry",
          needMoreAccess: "Need More Access?",
          contactAdmin: "Contact your administrator for additional permissions",
          viewerMessage: "As a viewer, you can see emission data and reports but cannot upload bills or make changes. If you need to contribute data or generate reports, please contact {tenantName} administrator.",
          viewReports: "View Reports",
          viewAllEntries: "View All Entries"
        },
        uploadBills: {
          title: "Upload Bills",
          subtitle: "Upload utility bills for automated ESG data extraction",
          dragDrop: "Drag and drop files here, or click to select",
          supportedFormats: "Supported formats",
          maxSize: "Max size",
          orTakePhoto: "Or take a photo",
          recentUploads: "Recent Uploads",
          processing: "Processing",
          completed: "Completed",
          failed: "Failed",
          retry: "Retry",
          viewDetails: "View Details"
        },
        entries: {
          title: "Bill Entries",
          subtitle: "Manage and review all uploaded utility bills",
          filters: {
            all: "All",
            allTypes: "All Types",
            allStatus: "All Status",
            electricity: "Electricity",
            fuel: "Fuel",
            water: "Water",
            status: "Status",
            dateRange: "Date Range"
          },
          table: {
            date: "Date",
            type: "Type",
            provider: "Provider",
            amount: "Amount",
            usage: "Usage",
            emissions: "Emissions",
            status: "Status",
            actions: "Actions"
          },
          uploaded: "Uploaded {date}",
          confidence: "{percent}% confidence",
          status: {
            verified: "Verified",
            pending: "Pending",
            flagged: "Flagged",
            rejected: "Rejected"
          },
          noEntriesFound: "No entries found",
          tryAdjustingFilters: "Try adjusting your filters",
          uploadFirstBill: "Upload Your First Bill",
          uploadBill: "Upload Bill",
          showingEntries: "Showing {count} of {total} entries",
          billSingular: "bill",
          billPlural: "bills",
          fromAllEntries: "From all entries",
          completion: "completion",
          searchPlaceholder: "Search by provider, date, or amount...",
          totalEntries: "Total Entries",
          totalCO2e: "Total CO2e",
          kg: "kg"
        },
        analytics: {
          title: "Analytics & Benchmarking",
          subtitle: "Benchmark your performance against industry peers",
          sectorComparison: "Sector Comparison",
          emissionsTrend: "Emissions Trend",
          topPerformers: "Top Performers",
          recommendations: "Recommendations",
          yourCompany: "Your Company",
          industryAverage: "Industry Average",
          topQuartile: "Top 25%",
          yourRanking: "Your Ranking",
          rank: "Rank #{rank} of {total} companies",
          notEnoughData: "Not enough data",
          vsSectorAverage: "vs Sector Average",
          belowSectorAvg: "below sector average",
          aboveSectorAvg: "above sector average",
          betterThanAvg: "Better than average",
          aboveAvg: "Above average",
          monthlyImprovement: "Monthly Improvement",
          fromTo: "From {from} to {to} kg",
          onTrackToTarget: "On track to target",
          increasing: "Increasing",
          sector: "Sector",
          companiesTracked: "{count} companies tracked",
          sme: "SME",
          noAnalyticsData: "No Analytics Data Available Yet",
          analyticsDataDesc: "The system either does not have enough data to generate analytics or your sector is not represented sufficiently for benchmarking. Do not worry, it will be available the more company/entries you uploaded.",
          refreshData: "Refresh Data",
          exportReport: "Export Report",
          timePeriod: "Time Period",
          selectPeriod: "Select period",
          monthly: "Monthly",
          quarterly: "Quarterly",
          yearly: "Yearly",
          sectorLabel: "Sector",
          yourSector: "Your Sector",
          keyMetrics: "Key Metrics",
          performanceHighlight: "Performance Highlight",
          excellentPerformance: "Excellent Performance!",
          keepUpGreatWork: "Keep up the great work to maintain your competitive advantage.",
          sectorBenchmarking: "Sector Benchmarking - {sector}",
          positionRelative: "Your position relative to industry peers (kg CO2e/month)",
          emissionTrends: "Emission Trends",
          yourEmissionsVsSector: "Your emissions vs sector average over time",
          regionalComparison: "Regional Comparison",
          avgEmissionsByRegion: "Average emissions by state/region",
          topPerformersTitle: "Top Performers - {sector}",
          bestEmissionReduction: "Companies with the best emission reduction rates",
          aiGeneratedInsights: "AI-Generated Insights",
          personalizedRecommendations: "Personalized recommendations based on benchmarking data",
          competitiveAdvantage: "Competitive Advantage",
          advantageDesc: "Your low carbon footprint is a strong selling point for ESG-conscious buyers. Highlight your top {percent}% ranking in proposals to showcase your sustainability commitment.",
          targetTop25: "Target for Top 25%",
          targetDesc: "You're close to breaking into the top 25% of {sector} companies. Focus on optimizing electricity usage during peak hours to reach this milestone.",
          consistentImprovement: "Consistent Improvement",
          improvementDesc: "You've reduced emissions by {percent}% this month. This trend puts you on track to achieve sustainability targets faster.",
          emissionsIncrease: "Emissions Increase Detected",
          increaseDesc: "Your emissions increased by {percent}% this month. Review recent activities and consider implementing energy-saving measures."
        },
        reports: {
          title: "ESG Reports",
          subtitle: "Generate comprehensive sustainability reports",
          generateReport: "Generate New Report",
          generateDownload: "Generate & Download Report",
          reportHistory: "Report History",
          downloadPDF: "Download PDF",
          shareReport: "Share Report",
          view: "View",
          preview: "Preview",
          previousReports: "Previous Reports",
          accessPrevious: "Access previously generated ESG reports",
          loadingReports: "Loading reports...",
          noReportsYet: "No Reports Yet",
          firstReportDesc: "Generate your first ESG report to see it here. Reports help you track your emissions progress over time.",
          executiveSummary: "Executive Summary",
          totalEmissions: "Total Emissions",
          trend: "Trend",
          sectorBenchmarking: "Sector Benchmarking",
          yourPerformance: "Your Performance",
          vsSector: "vs. {sector}",
          belowAvg: "below avg",
          unSdgAlignment: "UN SDG Alignment",
          contribution: "Your contribution to Sustainable Development Goals",
          includedSections: "Included Sections",
          emissionBreakdown: "Emission Breakdown (Scope 1 & 2)",
          monthlyTrendCharts: "Monthly Trend Charts",
          sectorComparison: "Sector Comparison Analysis",
          billEvidence: "Bill Evidence Appendix",
          complianceStatement: "Compliance Statement",
          recommendations: "Recommendations",
          monthlyQuotaExceeded: "Monthly Report Quota Exceeded",
          lowQuota: "Low Report Quota",
          remainingReports: "Only {count} report generation{plural} remaining this month.",
          usedAllQuota: "You have used all {limit} report generations. Quota resets on {date}.",
          cannotGenerate: "Cannot Generate Report",
          quotaExceededDesc: "You have exceeded your monthly report generation quota.",
          reportingPeriod: "Reporting Period",
          selectPeriod: "Select period",
          reportLanguage: "Report Language",
          selectLanguage: "Select language",
          reportFormat: "Report Format",
          selectFormat: "Select format",
          reportTypes: {
            monthly: "Monthly Summary",
            quarterly: "Quarterly Report",
            annual: "Annual Report",
            custom: "Custom Report"
          },
          status: {
            generating: "Generating",
            ready: "Ready",
            expired: "Expired"
          }
        },
        impact: {
          title: "Impact Dashboard",
          subtitle: "Track your contribution to sustainability goals",
          sdgAlignment: "SDG Alignment",
          carbonSaved: "Carbon Saved",
          treeEquivalent: "Tree Equivalent",
          successStories: "Success Stories",
          milestones: "Milestones Achieved",
          communityImpact: "Community Impact"
        },
        users: {
          title: "User Management",
          subtitle: "Manage team members and permissions",
          addUser: "Add User",
          inviteUser: "Invite User",
          roles: {
            admin: "Admin",
            editor: "Editor",
            viewer: "Viewer",
            clerk: "Clerk"
          },
          table: {
            name: "Name",
            email: "Email",
            role: "Role",
            lastActive: "Last Active",
            status: "Status",
            phone: "Phone",
            actions: "Actions",
            tenant: "Organization"
          },
          status: {
            active: "Active",
            inactive: "Inactive",
            suspended: "Suspended",
            pending: "Pending"
          },
          filters: {
            allRoles: "All Roles",
            allStatus: "All Status"
          },
          searchPlaceholder: "Search users...",
          loadingUsers: "Loading users...",
          noUsersFound: "No users found",
          inviteSent: "Invitation sent successfully",
          userAdded: "User added successfully",
          userUpdated: "User updated successfully",
          userDeleted: "User deleted successfully",
          confirmDelete: "Are you sure you want to delete this user?",
          editUser: "Edit User",
          deleteUser: "Delete User",
          resendInvite: "Resend Invitation",
          cancelInvite: "Cancel Invitation",
          summaryCards: {
            totalUsers: "Total Users",
            inYourOrganization: "In your organization",
            activeUsers: "Active Users",
            ofTotal: "of total",
            administrators: "Administrators",
            withFullAccess: "With full access",
            pendingInvites: "Pending Invites",
            awaitingActivation: "Awaiting activation"
          },
          header: {
            manageAccounts: "Manage user accounts, roles, and permissions"
          },
          tableHeaders: {
            name: "Name",
            email: "Email",
            role: "Role",
            status: "Status",
            lastActive: "Last Active",
            actions: "Actions"
          },
          roleBadges: {
            admin: "Admin",
            clerk: "Clerk",
            viewer: "Viewer"
          },
          statusBadges: {
            active: "Active",
            pending: "Pending",
            inactive: "Inactive"
          },
          actions: {
            edit: "Edit",
            delete: "Delete",
            resendInvite: "Resend Invite",
            cancelInvite: "Cancel Invite"
          },
          errorPrefix: "Error:",
          notAuthenticated: "Not authenticated"
        },
        tenants: {
          title: "Tenant Management",
          subtitle: "Manage organizations and subsidiaries",
          addTenant: "Add Tenant",
          table: {
            name: "Name",
            industry: "Industry",
            users: "Users",
            emissions: "Total Emissions",
            status: "Status",
            createdAt: "Created",
            actions: "Actions"
          },
          status: {
            active: "Active",
            inactive: "Inactive",
            suspended: "Suspended",
            trial: "Trial"
          },
          searchPlaceholder: "Search tenants...",
          loadingTenants: "Loading tenants...",
          noTenantsFound: "No tenants found",
          tenantAdded: "Tenant added successfully",
          tenantUpdated: "Tenant updated successfully",
          tenantDeleted: "Tenant deleted successfully",
          confirmDelete: "Are you sure you want to delete this tenant?",
          editTenant: "Edit Tenant",
          deleteTenant: "Delete Tenant",
          viewDetails: "View Details"
        },
        systemConfig: {
          title: "System Configuration",
          subtitle: "Configure platform settings and integrations",
          general: "General Settings",
          apiKeys: "API Keys",
          integrations: "Integrations",
          notifications: "Notification Settings",
          security: "Security",
          backup: "Backup & Recovery"
        },
        auditLog: {
          title: "Audit Log",
          subtitle: "Track all system activities for PDPA compliance",
          table: {
            timestamp: "Timestamp",
            user: "User",
            action: "Action",
            resource: "Resource",
            ipAddress: "IP Address",
            details: "Details",
            status: "Status"
          },
          actions: {
            created: "Created",
            updated: "Updated",
            deleted: "Deleted",
            viewed: "Viewed",
            exported: "Exported",
            login: "Login",
            logout: "Logout",
            upload: "Upload",
            download: "Download",
            aiExtraction: "AI Extraction",
            autoBackup: "Auto Backup"
          },
          status: {
            success: "Success",
            failure: "Failed",
            warning: "Warning"
          },
          filters: {
            allActions: "All Actions",
            allStatus: "All Status"
          },
          searchPlaceholder: "Search audit logs...",
          loadingLogs: "Loading audit logs...",
          noLogsFound: "No audit logs found",
          stats: {
            totalActivities: "Total Activities",
            uniqueUsers: "Unique Users",
            failedAttempts: "Failed Attempts"
          }
        },
        settings: {
          title: "Settings",
          subtitle: "Manage your personal preferences",
          profile: "Profile",
          account: "Account",
          preferences: "Preferences",
          notifications: "Notifications",
          security: "Security",
          language: "Language",
          timezone: "Timezone",
          saveChanges: "Save Changes"
        },
        help: {
          title: "Help Center",
          subtitle: "Find answers and get support",
          searchPlaceholder: "Search for help...",
          categories: {
            gettingStarted: "Getting Started",
            uploadingData: "Uploading Data",
            reports: "Reports & Analytics",
            account: "Account & Billing",
            compliance: "Compliance & Standards"
          },
          videoTutorials: "Video Tutorials",
          faq: "Frequently Asked Questions",
          contactSupport: "Contact Support",
          popularArticles: "Popular Articles",
          articleViews: "{count} views",
          helpful: "Helpful",
          getStartedGuide: "New to SustainChain? Start here",
          aiFeatures: "Learn about AI-powered extraction",
          understandingConfidence: "Understanding AI extraction confidence scores",
          confidenceDesc: "Learn what confidence scores mean and when to manually verify data",
          generatingReports: "Generating ESG-compliant PDF reports",
          reportsDesc: "Create professional reports for stakeholders and corporate buyers",
          benchmarking: "How sector benchmarking works",
          benchmarkingDesc: "Compare your emissions against industry peers and improve rankings",
          userManagement: "Adding team members and setting roles",
          userManagementDesc: "Invite users and assign Admin, Clerk, or Viewer permissions",
          complianceInfo: "PDPA compliance and data privacy",
          complianceDesc: "How SustainChain protects your data under Malaysian law"
        },
        changelog: {
          title: "Changelog",
          subtitle: "What's new in SustainChain",
          latest: "Latest Updates",
          upcoming: "Upcoming Features",
          version: "Version",
          releaseDate: "Release Date",
          features: "Features",
          improvements: "Improvements",
          bugFixes: "Bug Fixes",
          security: "Security",
          status: {
            latest: "Latest",
            upcoming: "Upcoming",
            released: "Released"
          }
        },
        billing: {
          title: "Billing & Subscription",
          subtitle: "Manage your subscription and payment methods",
          currentPlan: "Current Plan",
          usage: "Usage",
          paymentMethod: "Payment Method",
          billingHistory: "Billing History",
          upgradePlan: "Upgrade Plan",
          plans: {
            free: "Free",
            starter: "Starter",
            professional: "Professional",
            enterprise: "Enterprise"
          },
          planDetails: {
            price: "Price",
            period: "per month",
            description: "Description",
            features: "Features",
            included: "Included",
            notIncluded: "Not Included",
            current: "Current Plan",
            popular: "Most Popular"
          },
          usageStats: {
            billsUploaded: "Bills Uploaded",
            billsLimit: "Bills Limit",
            reportsGenerated: "Reports Generated",
            reportsLimit: "Reports Limit",
            storageUsed: "Storage Used",
            storageLimit: "Storage Limit",
            users: "Users",
            usersLimit: "Users Limit"
          },
          billingCycle: "Billing Cycle",
          nextBillingDate: "Next Billing Date",
          status: "Status",
          active: "Active",
          trial: "Trial",
          expired: "Expired",
          downloadInvoice: "Download Invoice",
          paymentMethods: "Payment Methods",
          addPaymentMethod: "Add Payment Method",
          billingHistoryTitle: "Billing History",
          date: "Date",
          amount: "Amount",
          download: "Download",
          receipt: "Receipt"
        },
        notifications: {
          title: "Notifications",
          subtitle: "Stay updated with important alerts",
          markAllRead: "Mark All as Read",
          filters: {
            all: "All",
            unread: "Unread",
            system: "System",
            reports: "Reports",
            team: "Team"
          },
          empty: "No notifications",
          types: {
            success: "Success",
            info: "Info",
            warning: "Warning",
            error: "Error"
          },
          sampleNotifications: {
            reportGenerated: "Report Generated Successfully",
            reportGeneratedDesc: "Your ESG Compliance Report (Q4 2025) is ready for download",
            aiExtraction: "AI Extraction Completed",
            aiExtractionDesc: "3 new bills have been processed with 95% confidence score",
            usageLimit: "Approaching Usage Limit",
            usageLimitDesc: "You've used 450/500 bill uploads this month. Consider upgrading your plan.",
            teamMemberAdded: "New Team Member Added",
            teamMemberAddedDesc: "Sarah Ahmad has been added to your workspace as a Clerk",
            rankingImproved: "Sector Ranking Improved",
            rankingImprovedDesc: "Your company moved up to Top 28% in the Manufacturing sector",
            monthlyReminder: "Monthly Report Reminder",
            monthlyReminderDesc: "Don't forget to generate your monthly ESG report by January 25th",
            maintenance: "System Maintenance Scheduled",
            maintenanceDesc: "Planned maintenance on January 20th, 2AM-4AM MYT. No downtime expected.",
            onboardingComplete: "Onboarding Completed",
            onboardingDesc: "Welcome to SustainChain! Your account setup is complete."
          }
        },
        export: {
          title: "Export Data",
          subtitle: "Download your data in various formats",
          selectDataType: "Select Data Type",
          selectFormat: "Select Format",
          dateRange: "Date Range",
          generateExport: "Generate Export",
          exportHistory: "Export History",
          templates: "Export Templates",
          customBuilder: "Custom Export Builder",
          exportTypes: {
            allData: "All Data",
            billsOnly: "Bills Only",
            reportsOnly: "Reports Only",
            usersOnly: "Users Only",
            auditLogsOnly: "Audit Logs Only"
          },
          formats: {
            csv: "CSV",
            excel: "Excel",
            pdf: "PDF",
            json: "JSON",
            zip: "ZIP Archive"
          },
          dateRangePresets: {
            last30Days: "Last 30 days",
            last90Days: "Last 90 days",
            thisYear: "This Year",
            lastYear: "Last Year",
            custom: "Custom Range"
          },
          generating: "Generating export...",
          exportReady: "Export ready for download",
          exportFailed: "Export failed",
          downloadExport: "Download Export",
          deleteExport: "Delete Export",
          confirmDelete: "Are you sure you want to delete this export?",
          noExportsFound: "No exports found",
          exportSize: "Size",
          rows: "rows",
          exportCreated: "Export created",
          exportDeleted: "Export deleted"
        }
      }
    },
      common: {
    retry: "Retry",
    yes: "Yes",
    no: "No",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    system: "System",
  },
  header: {
    search: {
      placeholder: "Search...",
    },
    command: {
      placeholder: "Type a command or search...",
      empty: "No results found.",
      suggestions: {
        heading: "Suggestions",
        items: {
          calendar: "Calendar",
          searchEmoji: "Search Emoji",
          calculator: "Calculator",
        },
      },
    },
    langToggle: "Toggle language",
  },
  notifications: {
    title: "Notifications",
    viewAll: "View All Notifications",
    sample: {
      first: "First notification",
      second: "Second notification",
    },
  },
  upload: {
    error: {
      invalidFile: "Invalid file",
      signInRequired: "Please sign in to upload bills",
      noTenant: "No tenant associated with your account. Please sign out and sign back in.",
      noRole: "No role assigned. Please sign out and sign back in.",
      analyzeFailed: "Failed to analyze bill",
    },
    success: {
      entrySavedTitle: "Entry Saved Successfully!",
      entrySavedDesc: "Your bill \"{fileName}\" has been processed and saved.",
      uploadAnother: "Upload Another Bill",
    },
    state: {
      analyzingTitle: "Gemini AI is analyzing your bill...",
      analyzingDesc: "Extracting energy usage, calculating CO2 emissions, and generating insights.",
      uploadingTitle: "Uploading...",
    },
    placeholder: {
      dropHere: "Drop your bill here",
      clickToUpload: "Click to upload",
    },
    supportedFormats: "TNB, SAJ, IWK, SESB, SEB bills • PDF or images up to 10MB",
    formats: {
      PDF: "PDF",
      PNG: "PNG",
      JPG: "JPG",
      HEIC: "HEIC",
    },
  },
  entryReview: {
    title: "Review Extracted Data",
    description: "Verify the AI-extracted data before saving",
    confidence: {
      high: "High Confidence",
      medium: "Medium Confidence",
      low: "Low Confidence - Review Required",
      lowDesc: "The AI confidence is low ({percent}%). Please review all fields carefully.",
    },
    labels: {
      utilityType: "Utility Type",
      provider: "Provider",
      usage: "Usage",
      unit: "Unit",
      amount: "Amount (MYR)",
      billingDate: "Billing Date",
      accountNumber: "Account Number",
      notes: "Notes (Optional)",
    },
    co2e: {
      title: "Calculated CO2 Emissions",
      unit: "CO2e",
    },
    actions: {
      saving: "Saving...",
      saveEntry: "Save Entry",
      reanalyze: "Re-analyze",
      cancel: "Cancel",
    },
    units: {
      kWh: "kWh",
      m3: "m³",
      L: "L",
      kg: "kg",
    },
  },
  manualEntry: {
    trigger: "Input data manually instead",
    title: "Manual Data Entry",
    description: "Enter your utility bill data manually. All fields marked with * are required.",
    validation: {
      fillRequired: "Please fill in all required fields",
      loginRequired: "You must be logged in to create entries",
    },
    placeholders: {
      selectType: "Select type",
      provider: "e.g., TNB, SAJ, Petron",
      usage: "850",
      unitSelect: "Select unit",
      amount: "320.50",
      accountNumber: "12345678",
    },
    labels: {
      utilityType: "Utility Type",
      provider: "Provider",
      usageAmount: "Usage Amount",
      unit: "Unit",
      billAmount: "Bill Amount (RM)",
      billingDate: "Billing Date",
      accountNumberOptional: "Account Number (Optional)",
    },
    actions: {
      saving: "Saving...",
      saveEntry: "Save Entry",
      clear: "Clear",
    },
    success: {
      saved: "Manual entry saved successfully!",
      viewEntries: "View in entries list",
    },
  },
  sidebar: {
    superadmin: {
      systemOverview: "System Overview",
      allTenants: "All Tenants",
      allUsers: "All Users",
      systemActivity: "System Activity",
      globalConfig: "Global Config",
      systemAdministration: "System Administration",
    },
    brandName: "SustainChain",
  },
  landing: {
    stats: {
      enterprises: "Enterprises",
      billsAnalyzed: "Bills Analyzed",
      accuracy: "Accuracy",
    },
    badges: {
      features: "Platform Features",
      simpleProcess: "Simple Process",
      currentChallenges: "Current Challenges",
      ourSolution: "Our Solution",
      unSdgAligned: "UN SDG Aligned",
    },
    buttons: {
      signIn: "Sign In",
      viewDemo: "View Demo",
    },
  },
  },

  bm: {
    nav: {
      features: "Ciri-ciri",
      impact: "Impak",
      howItWorks: "Cara Berfungsi",
      getStarted: "Mula Sekarang",
    },
    auth: {
      signIn: {
        title: "Log masuk ke akaun anda",
      description: "Masukkan e-mel anda di bawah untuk log masuk ke akaun anda",
      emailLabel: "E-mel",
      emailPlaceholder: "anda@syarikat.com",
      passwordLabel: "Kata Laluan",
      loginButton: "Log Masuk",
      loggingIn: "Sedang log masuk...",
      googleButton: "Log Masuk dengan Google",
        noAccount: "Tiada akaun?",
        signUpLink: "Daftar"
      },
      signUp: {
        title: "Cipta akaun anda",
        stepIndicator: "Langkah {currentStep} daripada {totalSteps}:",
        steps: {
          company: "Maklumat Syarikat",
          admin: "Akaun Pentadbir",
          password: "Kata Laluan & Perjanjian"
        },
        companyInfo: {
          title: "Maklumat Syarikat",
          companyName: "Nama Syarikat *",
          companyPlaceholder: "Syarikat ABC Sdn Bhd",
          uen: "Nombor UEN / ROC *",
          uenPlaceholder: "ROC123456",
          sector: "Sektor Industri *",
          sectorPlaceholder: "Pilih industri anda",
          address: "Alamat Perniagaan *",
          addressPlaceholder: "123 Jalan Contoh",
          city: "Bandar",
          cityPlaceholder: "Kuala Lumpur",
          state: "Negeri",
          statePlaceholder: "Selangor",
          postcode: "Poskod",
          postcodePlaceholder: "50000"
        },
        adminAccount: {
          title: "Akaun Pentadbir",
          fullName: "Nama Penuh *",
          namePlaceholder: "Ahmad Rahman",
          workEmail: "E-mel Kerja *",
          emailPlaceholder: "anda@syarikat.com",
          phone: "Nombor Telefon",
          phonePlaceholder: "+60123456789"
        },
        password: {
          title: "Lindungi Akaun Anda",
          password: "Kata Laluan *",
          confirmPassword: "Sahkan Kata Laluan *",
          passwordHint: "Mesti sekurang-kurangnya 6 aksara",
          agreeTo: "Saya bersetuju dengan",
          termsOfService: "Terma Perkhidmatan",
          and: "dan",
          privacyPolicy: "Dasar Privasi"
        },
        buttons: {
          back: "Kembali",
          next: "Seterusnya",
          createAccount: "Cipta Akaun",
          creating: "Sedang mencipta akaun..."
        },
        haveAccount: "Sudah mempunyai akaun?",
        signInLink: "Log masuk"
      },
      errors: {
        firebaseNotConfigured: "Firebase tidak dikonfigurasi. Sila tetapkan pemboleh ubah persekitaran.",
        signInFailed: "Gagal log masuk. Sila cuba lagi.",
        googleSignInFailed: "Gagal log masuk dengan Google.",
        linkedinComingSoon: "Integrasi SSO LinkedIn akan datang tidak lama lagi",
        fillRequired: "Sila isi semua medan yang diperlukan",
        validEmail: "Sila masukkan alamat e-mel yang sah",
        passwordMismatch: "Kata laluan tidak sepadan",
        passwordLength: "Kata laluan mesti sekurang-kurangnya 6 aksara",
        agreeTerms: "Sila bersetuju dengan Terma Perkhidmatan dan Dasar Privasi",
        registrationFailed: "Pendaftaran gagal"
      },
      sectors: {
        manufacturing: "Pengilangan",
        technology: "Teknologi",
        foodBeverage: "Makanan & Minuman",
        logistics: "Logistik",
        retail: "Peruncitan",
        agriculture: "Pertanian",
        construction: "Pembinaan",
        healthcare: "Penjagaan Kesihatan",
        education: "Pendidikan",
        hospitality: "Hosptaliti",
        other: "Lain-lain"
      }
    },
    hero: {
      badge: "Sedia untuk Mandat ESG MITI & Bursa 2027",
      title: "Kelangsungan Bisnes,",
      subtitle: "Bukan Sekadar Laporan.",
      description: "Memperkasakan 1.2J PKS Malaysia demi masa depan. Tukar bil berselerak kepada laporan ESG sedia-audit dengan Gemini AI.",
      ctaStart: "Mula Lapor Percuma",
      ctaDemo: "Lihat Demo",
      alignedWith: "Selaras dengan",
    },
    problem: {
      title: "Realiti Semasa: Mod Panik",
      complianceTitle: "Pematuhan Adalah Wajib",
      complianceDesc: "Spreadsheet tidak lagi memadai. Syarikat besar mula menggugurkan pembekal yang tidak patuh.",
      costTitle: "Konsultan Mahal",
      costDesc: "Audit ESG tradisional menelan kos RM 20k-50k. PKS tidak mampu menanggungnya.",
      solutionTitle: "Penyelesaian SustainChain",
      solutionFeatures: [
        "Analisis Data AI (Gemini 1.5)",
        "Tukar Foto-kepada-Laporan Segera",
        "Tiada Kos Halangan untuk pelaporan asas",
        "Dwikabahasa (Melayu & Inggeris) Asli"
      ]
    },
    features: {
      title: "Faktor \"Wow\" Teknikal",
      description: "Dibina dengan Gemini 1.5 Pro untuk memproses data dunia sebenar kepada wawasan berstruktur.",
      cards: [
        {
          title: "Input Multimodal",
          desc: "Tak perlu taip. Hanya ambil gambar bil TNB atau resit minyak. Gemini ekstrak kWh dan CO2e secara automatik.",
          highlight: "Dikuasakan oleh Gemini 1.5 Flash"
        },
        {
          title: "Dilokalisasi untuk Malaysia",
          desc: "Antaramuka dan pemprosesan AI dwibahasa sepenuhnya. Direka untuk tenaga kerja PKS tempatan.",
          highlight: "Sokongan Bahasa Asli"
        },
        {
          title: "Penanda Aras Automatik",
          desc: "Lihat perbandingan jejak karbon anda dengan pengilang lain di Muar atau Lembah Klang.",
          highlight: "Analisis BigQuery"
        }
      ]
    },
    howItWorks: {
      title: "Dari Resit ke Laporan dalam Saat",
      steps: [
        { title: "Tangkap", desc: "Muat naik foto bil utiliti anda." },
        { title: "Ekstrak", desc: "Gemini mengenal pasti data penggunaan." },
        { title: "Kira", desc: "Penukaran auto kepada CO2e." },
        { title: "Lapor", desc: "Muat turun PDF patuh piawaian." }
      ]
    },
    impact: {
      title: "Penyelarasan SDG PBB",
      sdgs: [
        { title: "Pekerjaan Layak & Pertumbuhan Ekonomi" },
        { title: "Industri, Inovasi & Infrastruktur" },
        { title: "Penggunaan & Pengeluaran Bertanggungjawab" }
      ]
    },
    cta: {
      title: "Jangan Ketinggalan.",
      description: "Sertai revolusi perniagaan Malaysia yang mampan menjejak impak mereka dengan tepat.",
      button: "Mula Penilaian Percuma"
    },
    footer: {
      builtFor: "Dibina untuk KitaHack.",
      privacy: "Privasi",
      terms: "Terma",
      contact: "Hubungi"
    },
    dashboard: {
      header: {
        title: "Papan Pemuka Pelaporan ESG",
        helpCenter: "Pusat Bantuan"
      },
      sidebar: {
        uploadBills: "Muat Naik Bil",
        billEntries: "Senarai Bil",
        analytics: "Analitik",
        reports: "Laporan",
        impact: "Impak",
        users: "Pengguna",
        tenants: "Syarikat",
        systemConfig: "Konfigurasi Sistem",
        auditLog: "Log Audit",
        settings: "Tetapan",
        changelog: "Log Perubahan",
        notifications: "Pemberitahuan",
        export: "Eksport Data",
        management: "Pengurusan"
      },
      common: {
        search: "Cari",
        filter: "Tapis",
        download: "Muat Turun",
        export: "Eksport",
        save: "Simpan",
        cancel: "Batal",
        delete: "Padam",
        edit: "Ubah",
        view: "Lihat",
        loading: "Memuatkan...",
        noData: "Tiada data tersedia",
        error: "Ralat berlaku",
        success: "Berjaya",
        confirm: "Sahkan",
        back: "Kembali",
        next: "Seterusnya",
        previous: "Sebelum",
        uploadBill: "Muat Naik Bil",
        exportReport: "Eksport Laporan",
        totalEmissions: "Jumlah Pelepasan",
        sectorRanking: "Kedudukan Sektor",
        electricityUsage: "Penggunaan Elektrik",
        fuelConsumption: "Penggunaan Bahan Api",
        waterUsage: "Penggunaan Air",
        fromLastMonth: "dari bulan lepas",
        betterThanPeers: "Lebih baik daripada {percent}% rakan sejawat",
        ofTotal: "daripada jumlah"
      },
      userMenu: {
        account: "Akaun",
        billing: "Bil",
        notifications: "Pemberitahuan",
        logout: "Log keluar"
      },
      pages: {
        dashboard: {
          title: "Papan Pemuka",
          subtitle: "Gambaran keseluruhan jejak karbon dan metrik ESG anda",
          readOnlyAccess: "(Akses baca sahaja)",
          viewerBanner: "👁️ Anda mempunyai akses lihat sahaja. Hubungi pentadbir anda untuk meminta kebenaran tambahan.",
          emissionBreakdown: "Pecahan Pelepasan",
          emissionBreakdownDesc: "Jejak karbon mengikut jenis utiliti (Bulan Semasa)",
          monthlyTrend: "Trend Bulanan",
          monthlyTrendDesc: "Pelepasan karbon sepanjang masa (kg CO2e)",
          topEmitters: "Pelepas Tertinggi",
          recentActivity: "Aktiviti Terkini",
          insights: "Wawasan AI",
          electricity: "Elektrik",
          fuel: "Bahan Api",
          water: "Air",
          dataEntries: "Catatan Data",
          thisMonth: "Bulan Ini",
          bills: "Bil",
          autoExtracted: "diekstrak automatik",
          manual: "manual",
          noEmissionData: "Tiada data pelepasan tersedia lagi.",
          uploadFirstBill: "Muat Naik Bil Pertama Anda",
          sectorAvg: "Purata sektor",
          noTrendData: "Tiada data trend tersedia lagi.",
          uploadForTrends: "Muat naik bil untuk sekurang-kurangnya 2 bulan untuk melihat trend.",
          failedToLoad: "Gagal Memuatkan Papan Pemuka",
          retry: "Cuba Lagi",
          needMoreAccess: "Perlukan Lebih Akses?",
          contactAdmin: "Hubungi pentadbir anda untuk kebenaran tambahan",
          viewerMessage: "Sebagai penonton, anda boleh melihat data pelepasan dan laporan tetapi tidak boleh memuat naik bil atau membuat perubahan. Jika anda perlu menyumbang data atau menjana laporan, sila hubungi pentadbir {tenantName}.",
          viewReports: "Lihat Laporan",
          viewAllEntries: "Lihat Semua Catatan"
        },
        uploadBills: {
          title: "Muat Naik Bil",
          subtitle: "Muat naik bil utiliti untuk pengekstrakan data ESG automatik",
          dragDrop: "Seret dan lepas fail di sini, atau klik untuk memilih",
          supportedFormats: "Format yang disokong",
          maxSize: "Saiz maksimum",
          orTakePhoto: "Atau ambil foto",
          recentUploads: "Muat Naik Terkini",
          processing: "Memproses",
          completed: "Selesai",
          failed: "Gagal",
          retry: "Cuba Lagi",
          viewDetails: "Lihat Butiran"
        },
        entries: {
          title: "Catatan Bil",
          subtitle: "Urus dan semak semua bil utiliti yang dimuat naik",
          filters: {
            all: "Semua",
            allTypes: "Semua Jenis",
            allStatus: "Semua Status",
            electricity: "Elektrik",
            fuel: "Bahan Api",
            water: "Air",
            status: "Status",
            dateRange: "Julat Tarikh"
          },
          table: {
            date: "Tarikh",
            type: "Jenis",
            provider: "Pembekal",
            amount: "Jumlah",
            usage: "Penggunaan",
            emissions: "Pelepasan",
            status: "Status",
            actions: "Tindakan"
          },
          status: {
            verified: "Disahkan",
            pending: "Menunggu",
            flagged: "Ditanda",
            rejected: "Ditolak"
          },
          noEntriesFound: "Tiada catatan ditemui",
          tryAdjustingFilters: "Cuba ubah penapis anda",
          uploadFirstBill: "Muat Naik Bil Pertama Anda",
          uploadBill: "Muat Naik Bil",
          showingEntries: "Menunjukkan {count} daripada {total} catatan",
          billSingular: "bil",
          billPlural: "bil",
          fromAllEntries: "Daripada semua catatan",
          completion: "pengambilan",
          searchPlaceholder: "Cari mengikut pembekal, tarikh, atau amaun...",
          uploaded: "Dimuat naik {date}",
          confidence: "{percent}% keyakinan",
          totalEntries: "Jumlah Catatan",
          totalCO2e: "Jumlah CO2e",
          kg: "kg"
        },
        analytics: {
          title: "Analitik & Penanda Aras",
          subtitle: "Bandingkan prestasi anda dengan rakan industri",
          sectorComparison: "Perbandingan Sektor",
          emissionsTrend: "Trend Pelepasan",
          topPerformers: "Prestasi Terbaik",
          recommendations: "Cadangan",
          yourCompany: "Syarikat Anda",
          industryAverage: "Purata Industri",
          topQuartile: "25% Teratas",
          yourRanking: "Kedudukan Anda",
          rank: "Kedudulan #{rank} daripada {total} syarikat",
          notEnoughData: "Tidak cukup data",
          vsSectorAverage: "vs Purata Sektor",
          belowSectorAvg: "di bawah purata sektor",
          aboveSectorAvg: "di atas purata sektor",
          betterThanAvg: "Lebih baik daripada purata",
          aboveAvg: "Di atas purata",
          monthlyImprovement: "Peningkatan Bulanan",
          fromTo: "Dari {from} kepada {to} kg",
          onTrackToTarget: "Dalam track untuk mencapai sasaran",
          increasing: "Meningkat",
          sector: "Sektor",
          companiesTracked: "{count} syarikat dijejaki",
          sme: "PKS",
          noAnalyticsData: "Tiada Data Analitik Tersedia",
          analyticsDataDesc: "Sistem tidak mempunyai cukup data untuk menjana analitik atau sektor anda tidak cukup terwakili untuk penanda aras. Jangan risau, ia akan tersedia apabila lebih banyak syarikat/catatan dimuat naik.",
          refreshData: "Segar Semula Data",
          exportReport: "Eksport Laporan",
          timePeriod: "Tempoh Masa",
          selectPeriod: "Pilih tempoh",
          monthly: "Bulanan",
          quarterly: "Suku Tahun",
          yearly: "Tahunan",
          sectorLabel: "Sektor",
          yourSector: "Sektor Anda",
          keyMetrics: "Metrik Utama",
          performanceHighlight: "Highlight Prestasi",
          excellentPerformance: "Prestasi Cemerlang!",
          keepUpGreatWork: "Teruskan kerja hebat untuk mengekalkan kelebihan kompetitif anda.",
          sectorBenchmarking: "Penanda Aras Sektor - {sector}",
          positionRelative: "Kedudukan anda relatif kepada rakan industri (kg CO2e/bulan)",
          emissionTrends: "Trend Pelepasan",
          yourEmissionsVsSector: "Pelepasan anda vs purata sektor sepanjang masa",
          regionalComparison: "Perbandingan Wilayah",
          avgEmissionsByRegion: "Pelepasan purata mengikut negeri/wilayah",
          topPerformersTitle: "Prestasi Terbaik - {sector}",
          bestEmissionReduction: "Syarikat dengan kadar pengurangan pelepasan terbaik",
          aiGeneratedInsights: "Wawasan Dijana AI",
          personalizedRecommendations: "Cadangan peribadi berdasarkan data penanda aras",
          competitiveAdvantage: "Kelebihan Kompetitif",
          advantageDesc: "Jejak karbon yang rendah anda adalah kelebihan jualan yang kuat untuk pembeli yang peka ESG. Sorot kedudukan anda di peringkat {percent}% dalam cadangan untuk menunjukkan komitmen kemampanan anda.",
          targetTop25: "Sasaran untuk 25% Teratas",
          targetDesc: "Anda hampir mencapai 25% teratas syarikat {sector}. Fokus pada pengoptimuman penggunaan elektrik pada waktu puncak untuk mencapai pencapaian ini.",
          consistentImprovement: "Peningkatan Konsisten",
          improvementDesc: "Anda telah mengurangkan pelepasan sebanyak {percent}% bulan ini. Trend ini menempatkan anda dalam track untuk mencapai sasaran kemampanan dengan lebih cepat.",
          emissionsIncrease: "Peningkatan Pelepasan Dikesan",
          increaseDesc: "Pelepasan anda meningkat sebanyak {percent}% bulan ini. Semak aktiviti terkini dan pertimbangkan untuk melaksanakan langkah penjimatan tenaga."
        },
        reports: {
          title: "Laporan ESG",
          subtitle: "Jana laporan kemampanan yang komprehensif",
          generateReport: "Jana Laporan Baharu",
          reportHistory: "Sejarah Laporan",
          downloadPDF: "Muat Turun PDF",
          shareReport: "Kongsi Laporan",
          reportTypes: {
            monthly: "Ringkasan Bulanan",
            quarterly: "Laporan Suku Tahun",
            annual: "Laporan Tahunan",
            custom: "Laporan Tersuai"
          },
          status: {
            generating: "Menjana",
            ready: "Sedia",
            expired: "Tamat Tempoh"
          }
        },
        impact: {
          title: "Papan Pemuka Impak",
          subtitle: "Jejaki sumbangan anda kepada matlamat kemampanan",
          sdgAlignment: "Penyelarasan SDG",
          carbonSaved: "Karbon Diselamatkan",
          treeEquivalent: "Setara Pokok",
          successStories: "Kisah Kejayaan",
          milestones: "Pencapaian",
          communityImpact: "Impak Komuniti"
        },
        users: {
          title: "Pengurusan Pengguna",
          subtitle: "Urus ahli pasukan dan kebenaran",
          addUser: "Tambah Pengguna",
          inviteUser: "Jemput Pengguna",
          roles: {
            admin: "Pentadbir",
            editor: "Editor",
            viewer: "Penonton",
            clerk: "Klerk"
          },
          table: {
            name: "Nama",
            email: "E-mel",
            role: "Peranan",
            lastActive: "Aktif Terakhir",
            status: "Status",
            phone: "Telefon",
            actions: "Tindakan",
            tenant: "Organisasi"
          },
          status: {
            active: "Aktif",
            inactive: "Tidak Aktif",
            suspended: "Digantung",
            pending: "Menunggu"
          },
          filters: {
            allRoles: "Semua Peranan",
            allStatus: "Semua Status"
          },
          searchPlaceholder: "Cari pengguna...",
          loadingUsers: "Memuatkan pengguna...",
          noUsersFound: "Tiada pengguna ditemui",
          inviteSent: "Jemputan berjaya dihantar",
          userAdded: "Pengguna berjaya ditambah",
          userUpdated: "Pengguna berjaya dikemas kini",
          userDeleted: "Pengguna berjaya dipadam",
          confirmDelete: "Adakah anda pasti mahu memadam pengguna ini?",
          editUser: "Edit Pengguna",
          deleteUser: "Padam Pengguna",
          resendInvite: "Hantar Semula Jemputan",
          cancelInvite: "Batalkan Jemputan",
          summaryCards: {
            totalUsers: "Jumlah Pengguna",
            inYourOrganization: "Dalam organisasi anda",
            activeUsers: "Pengguna Aktif",
            ofTotal: "daripada jumlah",
            administrators: "Pentadbir",
            withFullAccess: "Dengan akses penuh",
            pendingInvites: "Jemputan Tertunggu",
            awaitingActivation: "Menunggu pengaktifan"
          },
          header: {
            manageAccounts: "Urus akaun pengguna, peranan, dan kebenaran"
          },
          tableHeaders: {
            name: "Nama",
            email: "E-mel",
            role: "Peranan",
            status: "Status",
            lastActive: "Aktif Terakhir",
            actions: "Tindakan"
          },
          roleBadges: {
            admin: "Pentadbir",
            clerk: "Klerk",
            viewer: "Penonton"
          },
          statusBadges: {
            active: "Aktif",
            pending: "Menunggu",
            inactive: "Tidak Aktif"
          },
          actions: {
            edit: "Edit",
            delete: "Padam",
            resendInvite: "Hantar Semula",
            cancelInvite: "Batalkan"
          },
          errorPrefix: "Ralat:",
          notAuthenticated: "Tidak diautentikasi"
        },
        tenants: {
          title: "Pengurusan Syarikat",
          subtitle: "Urus organisasi dan anak syarikat",
          addTenant: "Tambah Syarikat",
          table: {
            name: "Nama",
            industry: "Industri",
            users: "Pengguna",
            emissions: "Jumlah Pelepasan",
            status: "Status",
            createdAt: "Dicipta",
            actions: "Tindakan"
          },
          status: {
            active: "Aktif",
            inactive: "Tidak Aktif",
            suspended: "Digantung",
            trial: "Percubaan"
          },
          searchPlaceholder: "Cari syarikat...",
          loadingTenants: "Memuatkan syarikat...",
          noTenantsFound: "Tiada syarikat ditemui",
          tenantAdded: "Syarikat berjaya ditambah",
          tenantUpdated: "Syarikat berjaya dikemas kini",
          tenantDeleted: "Syarikat berjaya dipadam",
          confirmDelete: "Adakah anda pasti mahu memadam syarikat ini?",
          editTenant: "Edit Syarikat",
          deleteTenant: "Padam Syarikat",
          viewDetails: "Lihat Butiran"
        },
        systemConfig: {
          title: "Konfigurasi Sistem",
          subtitle: "Konfigur tetapan platform dan integrasi",
          general: "Tetapan Am",
          apiKeys: "Kunci API",
          integrations: "Integrasi",
          notifications: "Tetapan Pemberitahuan",
          security: "Keselamatan",
          backup: "Sandaran & Pemulihan"
        },
        auditLog: {
          title: "Log Audit",
          subtitle: "Jejaki semua aktiviti sistem untuk pematuhan PDPA",
          table: {
            timestamp: "Cap Masa",
            user: "Pengguna",
            action: "Tindakan",
            resource: "Sumber",
            ipAddress: "Alamat IP",
            details: "Butiran",
            status: "Status"
          },
          actions: {
            created: "Dicipta",
            updated: "Dikemas kini",
            deleted: "Dipadam",
            viewed: "Dilihat",
            exported: "Dieksport",
            login: "Log Masuk",
            logout: "Log Keluar",
            upload: "Muat Naik",
            download: "Muat Turun",
            aiExtraction: "Pengekstrakan AI",
            autoBackup: "Sandaran Automatik"
          },
          status: {
            success: "Berjaya",
            failure: "Gagal",
            warning: "Amaran"
          },
          filters: {
            allActions: "Semua Tindakan",
            allStatus: "Semua Status"
          },
          searchPlaceholder: "Cari log audit...",
          loadingLogs: "Memuatkan log audit...",
          noLogsFound: "Tiada log audit ditemui",
          stats: {
            totalActivities: "Jumlah Aktiviti",
            uniqueUsers: "Pengguna Unik",
            failedAttempts: "Percubaan Gagal"
          }
        },
        settings: {
          title: "Tetapan",
          subtitle: "Urus keutamaan peribadi anda",
          profile: "Profil",
          account: "Akaun",
          preferences: "Keutamaan",
          notifications: "Pemberitahuan",
          security: "Keselamatan",
          language: "Bahasa",
          timezone: "Zon Masa",
          saveChanges: "Simpan Perubahan"
        },
        help: {
          title: "Pusat Bantuan",
          subtitle: "Cari jawapan dan dapatkan sokongan",
          searchPlaceholder: "Cari bantuan...",
          categories: {
            gettingStarted: "Memulakan",
            uploadingData: "Memuat Naik Data",
            reports: "Laporan & Analitik",
            account: "Akaun & Bil",
            compliance: "Pematuhan & Piawaian"
          },
          videoTutorials: "Tutorial Video",
          faq: "Soalan Lazim",
          contactSupport: "Hubungi Sokongan",
          popularArticles: "Artikel Popular",
          articleViews: "{count} paparan",
          helpful: "Berguna",
          getStartedGuide: "Baru ke SustainChain? Mula di sini",
          aiFeatures: "Belajar tentang pengekstrakan berkuasa AI",
          understandingConfidence: "Memahami skor keyakinan pengekstrakan AI",
          confidenceDesc: "Pelajari apa yang dimaksudkan dengan skor keyakinan dan bila untuk mengesahkan data secara manual",
          generatingReports: "Menerbitkan laporan PDF yang mematuhi ESG",
          reportsDesc: "Cipta laporan profesional untuk pemegang saham dan pembeli korporat",
          benchmarking: "Bagaimana penanda aras sektor berfungsi",
          benchmarkingDesc: "Bandingkan pelepasan anda terhadap rakan industri dan tingkatkan kedudukan",
          userManagement: "Menambah ahli pasukan dan menetapkan peranan",
          userManagementDesc: "Jemput pengguna dan tetapkan kebenaran Pentadbir, Klerk, atau Penonton",
          complianceInfo: "Pematuhan PDPA dan privasi data",
          complianceDesc: "Bagaimana SustainChain melindungi data anda di bawah undang-undang Malaysia"
        },
        changelog: {
          title: "Log Perubahan",
          subtitle: "Apa yang baharu dalam SustainChain",
          latest: "Kemas Kini Terkini",
          upcoming: "Ciri Akan Datang",
          version: "Versi",
          releaseDate: "Tarikh Keluaran",
          features: "Ciri",
          improvements: "Penambahbaikan",
          bugFixes: "Pembaikan Pepijat"
        },
        billing: {
          title: "Bil & Langganan",
          subtitle: "Urus langganan dan kaedah pembayaran anda",
          currentPlan: "Pelan Semasa",
          usage: "Penggunaan",
          paymentMethod: "Kaedah Pembayaran",
          billingHistory: "Sejarah Bil",
          upgradePlan: "Naik Taraf Pelan",
          plans: {
            free: "Percuma",
            starter: "Permulaan",
            professional: "Profesional",
            enterprise: "Enterprise"
          },
          planDetails: {
            price: "Harga",
            period: "sebulan",
            description: "Penerangan",
            features: "Ciri",
            included: "Termasuk",
            notIncluded: "Tidak Termasuk",
            current: "Pelan Semasa",
            popular: "Paling Popular"
          },
          usageStats: {
            billsUploaded: "Bil Dimuat Naik",
            billsLimit: "Had Bil",
            reportsGenerated: "Laporan Dijana",
            reportsLimit: "Had Laporan",
            storageUsed: "Storan Digunakan",
            storageLimit: "Had Stor",
            users: "Pengguna",
            usersLimit: "Had Pengguna"
          },
          billingCycle: "Kitaran Bil",
          nextBillingDate: "Tarikh Bil Seterusnya",
          status: "Status",
          active: "Aktif",
          trial: "Percubaan",
          expired: "Tamat Tempoh",
          downloadInvoice: "Muat Turun Invois",
          paymentMethods: "Kaedah Pembayaran",
          addPaymentMethod: "Tambah Kaedah Pembayaran",
          billingHistoryTitle: "Sejarah Bil",
          date: "Tarikh",
          amount: "Amaun",
          download: "Muat Turun",
          receipt: "Resit"
        },
        notifications: {
          title: "Pemberitahuan",
          subtitle: "Kekal dikemas kini dengan makluman penting",
          markAllRead: "Tandakan Semua Dibaca",
          filters: {
            all: "Semua",
            unread: "Belum Dibaca",
            system: "Sistem",
            reports: "Laporan",
            team: "Pasukan"
          },
          empty: "Tiada pemberitahuan",
          types: {
            success: "Kejayaan",
            info: "Makluman",
            warning: "Amaran",
            error: "Ralat"
          },
          sampleNotifications: {
            reportGenerated: "Laporan Berjaya Dijana",
            reportGeneratedDesc: "Laporan ESG (Q4 2025) anda sedia untuk dimuat turun",
            aiExtraction: "Pengekstrakan AI Selesai",
            aiExtractionDesc: "3 bil baru telah diproses dengan skor keyakinan 95%",
            usageLimit: "Mendekati Had Penggunaan",
            usageLimitDesc: "Anda telah menggunakan 450/500 muat naik bil bulan ini. Pertimbangkan untuk menaik taraf pelan.",
            teamMemberAdded: "Ahli Pasukan Baru Ditambah",
            teamMemberAddedDesc: "Sarah Ahmad telah ditambah ke ruang kerja anda sebagai Klerk",
            rankingImproved: "Kedudukan Sektor Meningkat",
            rankingImprovedDesc: "Syarikat anda naik ke Top 28% dalam sektor Pengilangan",
            monthlyReminder: "Pengingat Bulanan",
            monthlyReminderDesc: "Jangan lupajana laporan ESG bulanan sebelum 25 Januari",
            maintenance: "Penyelenggaraan Sistem Dijadualkan",
            maintenanceDesc: "Penyelenggaraan dijadualkan pada 20 Januari, 2AM-4AM MYT. Tidak ada downtime dijangka.",
            onboardingComplete: "Penyertaan Selesai",
            onboardingDesc: "Selamat datang ke SustainChain! Persediaan akaun anda selesai."
          }
        },
        export: {
          title: "Eksport Data",
          subtitle: "Muat turun data anda dalam pelbagai format",
          selectDataType: "Pilih Jenis Data",
          selectFormat: "Pilih Format",
          dateRange: "Julat Tarikh",
          generateExport: "Jana Eksport",
          exportHistory: "Sejarah Eksport",
          templates: "Templat Eksport",
          customBuilder: "Pembina Eksport Tersuai",
          exportTypes: {
            allData: "Semua Data",
            billsOnly: "Bil Sahaja",
            reportsOnly: "Laporan Sahaja",
            usersOnly: "Pengguna Sahaja",
            auditLogsOnly: "Log Audit Sahaja"
          },
          formats: {
            csv: "CSV",
            excel: "Excel",
            pdf: "PDF",
            json: "JSON",
            zip: "Arkib ZIP"
          },
          dateRangePresets: {
            last30Days: "30 Hari Terakhir",
            last90Days: "90 Hari Terakhir",
            thisYear: "Tahun Ini",
            lastYear: "Tahun Lepas",
            custom: "Julat Tersuai"
          },
          generating: "Menjana eksport...",
          exportReady: "Eksport sedia untuk dimuat turun",
          exportFailed: "Eksport gagal",
          downloadExport: "Muat Turun Eksport",
          deleteExport: "Padam Eksport",
          confirmDelete: "Adakah anda pasti mahu memadam eksport ini?",
          noExportsFound: "Tiada eksport ditemui",
          exportSize: "Saiz",
          rows: "baris",
          exportCreated: "Eksport berjaya dijana",
          exportDeleted: "Eksport berjaya dipadam"
        }
      }
    },
    common: {
      retry: "Cuba Semula",
      yes: "Ya",
      no: "Tidak",
      darkMode: "Mod Gelap",
      lightMode: "Mod Terang",
      system: "Sistem",
    },
    header: {
      search: {
        placeholder: "Cari...",
      },
      command: {
        placeholder: "Taip arahan atau cari...",
        empty: "Tiada keputusan.",
        suggestions: {
          heading: "Cadangan",
          items: {
            calendar: "Kalendar",
            searchEmoji: "Cari Emoji",
            calculator: "Kalkulator",
          },
        },
      },
      langToggle: "Tukar bahasa",
    },
    notifications: {
      title: "Pemberitahuan",
      viewAll: "Lihat Semua Pemberitahuan",
      sample: {
        first: "Pemberitahuan pertama",
        second: "Pemberitahuan kedua",
      },
    },
    upload: {
      error: {
        invalidFile: "Fail tidak sah",
        signInRequired: "Sila log masuk untuk memuat naik bil",
        noTenant: "Tiada penyewa dikaitkan dengan akaun anda. Sila log keluar dan log masuk semula.",
        noRole: "Tiada peranan ditetapkan. Sila log keluar dan log masuk semula.",
        analyzeFailed: "Gagal menganalisis bil",
      },
      success: {
        entrySavedTitle: "Catatan Berjaya Disimpan!",
        entrySavedDesc: "Bil anda \"{fileName}\" telah diproses dan disimpan.",
        uploadAnother: "Muat Naik Bil Lain",
      },
      state: {
        analyzingTitle: "Gemini AI sedang menganalisis bil anda...",
        analyzingDesc: "Mengekstrak penggunaan tenaga, mengira pelepasan CO2, dan menjana wawasan.",
        uploadingTitle: "Sedang memuat naik...",
      },
      placeholder: {
        dropHere: "Lepaskan bil anda di sini",
        clickToUpload: "Klik untuk muat naik",
      },
      supportedFormats: "Bil TNB, SAJ, IWK, SESB, SEB • PDF atau imej sehingga 10MB",
      formats: {
        PDF: "PDF",
        PNG: "PNG",
        JPG: "JPG",
        HEIC: "HEIC",
      },
    },
    entryReview: {
      title: "Semak Data yang Diekstrak",
      description: "Sahkan data yang diekstrak AI sebelum menyimpan",
      confidence: {
        high: "Keyakinan Tinggi",
        medium: "Keyakinan Sederhana",
        low: "Keyakinan Rendah - Sila Semak",
        lowDesc: "Keyakinan AI adalah rendah ({percent}%). Sila semak semua medan dengan teliti.",
      },
      labels: {
        utilityType: "Jenis Utiliti",
        provider: "Pembekal",
        usage: "Penggunaan",
        unit: "Unit",
        amount: "Jumlah (MYR)",
        billingDate: "Tarikh Bil",
        accountNumber: "Nombor Akaun",
        notes: "Nota (Pilihan)",
      },
      co2e: {
        title: "Pengiraan Pelepasan CO2",
        unit: "CO2e",
      },
      actions: {
        saving: "Menyimpan...",
        saveEntry: "Simpan Catatan",
        reanalyze: "Analisis semula",
        cancel: "Batal",
      },
      units: {
        kWh: "kWh",
        m3: "m³",
        L: "L",
        kg: "kg",
      },
    },
    manualEntry: {
      trigger: "Masukkan data secara manual",
      title: "Masukan Data Manual",
      description: "Masukkan data bil utiliti anda secara manual. Semua medan yang bertanda * adalah wajib.",
      validation: {
        fillRequired: "Sila isi semua medan yang diperlukan",
        loginRequired: "Anda mesti log masuk untuk mencipta catatan",
      },
      placeholders: {
        selectType: "Pilih jenis",
        provider: "contoh: TNB, SAJ, Petron",
        usage: "850",
        unitSelect: "Pilih unit",
        amount: "320.50",
        accountNumber: "12345678",
      },
      labels: {
        utilityType: "Jenis Utiliti",
        provider: "Pembekal",
        usageAmount: "Jumlah Penggunaan",
        unit: "Unit",
        billAmount: "Jumlah Bil (RM)",
        billingDate: "Tarikh Bil",
        accountNumberOptional: "Nombor Akaun (Pilihan)",
      },
      actions: {
        saving: "Menyimpan...",
        saveEntry: "Simpan Catatan",
        clear: "Kosongkan",
      },
      success: {
        saved: "Masukan manual berjaya disimpan!",
        viewEntries: "Lihat dalam senarai catatan",
      },
    },
    sidebar: {
      superadmin: {
        systemOverview: "Gambaran Keseluruhan Sistem",
        allTenants: "Semua Penyewa",
        allUsers: "Semua Pengguna",
        systemActivity: "Aktiviti Sistem",
        globalConfig: "Konfigurasi Global",
        systemAdministration: "Pentadbiran Sistem",
      },
      brandName: "SustainChain",
    },
    landing: {
      stats: {
        enterprises: "Perusahaan",
        billsAnalyzed: "Bil Dianalisis",
        accuracy: "Ketepatan",
      },
      badges: {
        features: "Ciri Platform",
        simpleProcess: "Proses Mudah",
        currentChallenges: "Cabaran Semasa",
        ourSolution: "Penyelesaian Kami",
        unSdgAligned: "Selaras dengan SDG PBB",
      },
      buttons: {
        signIn: "Log Masuk",
        viewDemo: "Lihat Demo",
      },
    },
  },
};

