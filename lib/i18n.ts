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
          emissionBreakdown: "Emission Breakdown",
          monthlyTrend: "Monthly Trend",
          topEmitters: "Top Emitters",
          recentActivity: "Recent Activity",
          insights: "AI Insights",
          electricity: "Electricity",
          fuel: "Fuel",
          water: "Water",
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
            electricity: "Electricity",
            fuel: "Fuel",
            water: "Water",
            status: "Status",
            dateRange: "Date Range"
          },
          table: {
            date: "Date",
            type: "Type",
            amount: "Amount",
            usage: "Usage",
            emissions: "Emissions",
            status: "Status",
            actions: "Actions"
          },
          status: {
            verified: "Verified",
            pending: "Pending",
            flagged: "Flagged"
          }
        },
        analytics: {
          title: "Analytics",
          subtitle: "Benchmark your performance against industry peers",
          sectorComparison: "Sector Comparison",
          emissionsTrend: "Emissions Trend",
          topPerformers: "Top Performers",
          recommendations: "Recommendations",
          yourCompany: "Your Company",
          industryAverage: "Industry Average",
          topQuartile: "Top 25%"
        },
        reports: {
          title: "ESG Reports",
          subtitle: "Generate comprehensive sustainability reports",
          generateReport: "Generate New Report",
          reportHistory: "Report History",
          downloadPDF: "Download PDF",
          shareReport: "Share Report",
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
            viewer: "Viewer"
          },
          table: {
            name: "Name",
            email: "Email",
            role: "Role",
            lastActive: "Last Active",
            status: "Status"
          }
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
            status: "Status"
          }
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
            details: "Details"
          },
          actions: {
            created: "Created",
            updated: "Updated",
            deleted: "Deleted",
            viewed: "Viewed",
            exported: "Exported"
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
          contactSupport: "Contact Support"
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
          bugFixes: "Bug Fixes"
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
          }
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
          empty: "No notifications"
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
          customBuilder: "Custom Export Builder"
        }
      }
    }
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
          emissionBreakdown: "Pecahan Pelepasan",
          monthlyTrend: "Trend Bulanan",
          topEmitters: "Pelepas Tertinggi",
          recentActivity: "Aktiviti Terkini",
          insights: "Wawasan AI",
          electricity: "Elektrik",
          fuel: "Bahan Api",
          water: "Air",
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
            electricity: "Elektrik",
            fuel: "Bahan Api",
            water: "Air",
            status: "Status",
            dateRange: "Julat Tarikh"
          },
          table: {
            date: "Tarikh",
            type: "Jenis",
            amount: "Jumlah",
            usage: "Penggunaan",
            emissions: "Pelepasan",
            status: "Status",
            actions: "Tindakan"
          },
          status: {
            verified: "Disahkan",
            pending: "Menunggu",
            flagged: "Ditanda"
          }
        },
        analytics: {
          title: "Analitik",
          subtitle: "Bandingkan prestasi anda dengan rakan industri",
          sectorComparison: "Perbandingan Sektor",
          emissionsTrend: "Trend Pelepasan",
          topPerformers: "Prestasi Terbaik",
          recommendations: "Cadangan",
          yourCompany: "Syarikat Anda",
          industryAverage: "Purata Industri",
          topQuartile: "25% Teratas"
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
            viewer: "Penonton"
          },
          table: {
            name: "Nama",
            email: "E-mel",
            role: "Peranan",
            lastActive: "Aktif Terakhir",
            status: "Status"
          }
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
            status: "Status"
          }
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
            details: "Butiran"
          },
          actions: {
            created: "Dicipta",
            updated: "Dikemas kini",
            deleted: "Dipadam",
            viewed: "Dilihat",
            exported: "Dieksport"
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
          contactSupport: "Hubungi Sokongan"
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
          }
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
          empty: "Tiada pemberitahuan"
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
          customBuilder: "Pembina Eksport Tersuai"
        }
      }
    }
  }
};
