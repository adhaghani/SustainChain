# SustainChain: Technical Requirements Document & MVP Roadmap

## 📋 TECHNICAL REQUIREMENTS DOCUMENT (TRD)

### 1. SYSTEM ARCHITECTURE

#### 1.1 High-Level Architecture Diagram Description

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Next.js 15)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Bill Upload  │  │ Dashboard    │  │ Report Gen   │          │
│  │ (Multimodal) │  │ (Analytics)  │  │ (PDF Export) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js API Routes)                │
│  /api/analyze  |  /api/reports  |  /api/benchmarking            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      GOOGLE CLOUD SERVICES                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Firebase Auth    │  │ Cloud Storage    │  │ Firestore DB  │ │
│  │ (Tenant Mgmt)    │  │ (Bill Images)    │  │ (Transactions)│ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Gemini 1.5 Flash (Vision + Structured Output)    │  │
│  │         Input: Bill Image → Output: {kWh, date, CO2e}    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         BigQuery (Data Warehouse)                        │  │
│  │         - Sector benchmarking analytics                  │  │
│  │         - Time-series carbon footprint aggregation       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### 1.2 Data Flow (Bill Ingestion → Report Generation)

1. **Upload**: User uploads TNB/SAJ bill photo (JPEG/PNG) via drag-and-drop UI
2. **Storage**: Image → Firebase Cloud Storage (`gs://sustainchain-bills/{tenantId}/{timestamp}.jpg`)
3. **AI Extraction**: Trigger `/api/analyze` → Gemini 1.5 Flash Vision API
4. **Structured Output**: Gemini JSON mode returns:
   ```json
   {
     "utilityType": "electricity",
     "provider": "TNB",
     "kWh": 850,
     "billingDate": "2026-01-15",
     "amount": 320.50,
     "accountNumber": "12345678",
     "confidence": 0.94
   }
   ```
5. **Carbon Calculation**: Apply x`r (0.587 kg CO2e/kWh)
6. **Storage**: Write to Firestore `/tenants/{id}/entries/{entryId}`
7. **Analytics**: Batch ETL to BigQuery for benchmarking queries
8. **Report**: Generate PDF using carbon totals + sector comparisons

---

### 2. FUNCTIONAL REQUIREMENTS

#### FR-1: Multimodal Bill Ingestion (PRIORITY: CRITICAL)
- **ID**: FR-001
- **Description**: The system MUST accept utility bill images (TNB, SAJ, IWK) and extract structured data using Gemini 1.5 Flash
- **Acceptance Criteria**:
  - ✅ Support JPEG, PNG, HEIC formats (max 10MB)
  - ✅ Extract: kWh/cubic meters, billing date, account number, amount
  - ✅ Achieve ≥90% extraction accuracy on test dataset (50 Malaysian bills)
  - ✅ Handle rotated/blurry images (Gemini's built-in preprocessing)
  - ✅ Fallback: Manual data entry if confidence <70%
- **Tech Stack**: Gemini 1.5 Flash Vision API, Firebase Storage, Next.js File Upload

#### FR-2: Automated Carbon Footprint Calculation
- **ID**: FR-002
- **Description**: Convert extracted utility data to CO2e using Malaysia-specific emission factors
- **Calculation Logic**:
  ```
  Electricity: kWh × 0.587 kg CO2e/kWh (Peninsular Malaysia grid factor 2025)
  Water: m³ × 0.298 kg CO2e/m³ (water treatment + distribution)
  Fuel: Liters × 2.31 kg CO2e/L (diesel B10 standard)
  ```
- **Acceptance Criteria**:
  - ✅ Auto-calculate CO2e upon data extraction
  - ✅ Display real-time emission totals on dashboard
  - ✅ Allow manual override with audit trail
- **Data Source**: Malaysia Green Technology and Climate Change Centre (MGTC) emission factors

#### FR-3: Sector Benchmarking (BigQuery Analytics)
- **ID**: FR-003
- **Description**: Compare SME carbon intensity against sector averages (Manufacturing, F&B, Logistics)
- **SQL Example**:
  ```sql
  SELECT 
    sector,
    AVG(monthly_co2e) AS sector_avg,
    PERCENTILE_CONT(monthly_co2e, 0.5) AS median
  FROM `sustainchain.emissions`
  WHERE billing_month = '2026-01'
  GROUP BY sector
  ```
- **Acceptance Criteria**:
  - ✅ Generate "You emit 20% less than sector average" insights
  - ✅ Visualize percentile rankings (P25, P50, P75)
  - ✅ Update benchmarks monthly via scheduled BigQuery job
- **Tech Stack**: BigQuery, Cloud Scheduler, Recharts for visualization

#### FR-4: Multi-Tenant Architecture
- **ID**: FR-004
- **Description**: Support multiple SME tenants with data isolation
- **Features**:
  - Tenant registration with company UEN (Unique Entity Number)
  - Role-based access: Admin, Data Entry Clerk, Viewer
  - Data partitioning in Firestore: `/tenants/{tenantId}/entries`
  - Billing isolation in Cloud Storage: `gs://bills/{tenantId}/`
- **Acceptance Criteria**:
  - ✅ No cross-tenant data leakage (security audit)
  - ✅ Support ≥100 concurrent tenants (load testing)

#### FR-5: PDF Report Generation
- **ID**: FR-005
- **Description**: Generate ESG-compliant PDF reports for SMEs to submit to corporate buyers
- **Report Sections**:
  1. Executive Summary (total emissions, trend chart)
  2. Scope 1 & 2 Breakdown (electricity, fuel, water)
  3. Benchmarking Analysis (sector comparison)
  4. SDG Alignment Statement (Goals 8, 9, 12)
  5. Appendix (uploaded bill thumbnails)
- **Tech Stack**: React-PDF or Puppeteer, Cloud Functions
- **Acceptance Criteria**:
  - ✅ Generate PDF in <5 seconds
  - ✅ Include bilingual headers (EN/MS)

#### FR-6: Localization (i18n)
- **ID**: FR-006
- **Description**: Full bilingual support (English + Bahasa Malaysia)
- **Coverage**:
  - UI labels, buttons, form validations
  - AI prompts to Gemini (extract from Malay-language bills)
  - Report templates
- **Tech Stack**: next-intl or i18next
- **Acceptance Criteria**:
  - ✅ User can toggle language without page reload
  - ✅ All static text translated (0% hardcoded English)

---

### 3. NON-FUNCTIONAL REQUIREMENTS

#### NFR-1: Performance
- API response time: <2s for bill analysis (P95)
- Dashboard load: <1s (Lighthouse score >90)
- BigQuery queries: <5s (partitioned tables)

#### NFR-2: Scalability
- Handle 1,000 bill uploads/day (auto-scaling Cloud Run)
- Firestore: 10,000 documents/tenant limit (paginated queries)
- BigQuery: Support 10M rows (streaming inserts)

#### NFR-3: Security
- Firebase Auth with email verification
- Storage access: Signed URLs (1-hour expiry)
- API: CORS whitelist + rate limiting (100 req/min per tenant)
- Compliance: PDPA (Malaysia Personal Data Protection Act)

#### NFR-4: Reliability
- Uptime: 99.5% SLA (Firebase guarantees)
- Error handling: Retry logic for Gemini API (exponential backoff)
- Data backup: Firestore daily automated backups

#### NFR-5: Usability
- Mobile-responsive (Tailwind CSS)
- Accessibility: WCAG 2.1 Level AA (keyboard navigation, ARIA labels)
- Onboarding: 3-step wizard for first-time users

---

## 🗓️ 6-WEEK MVP ROADMAP

### WEEK 1: Foundation & Authentication
**Goal**: Set up project infrastructure and secure multi-tenant auth

**Tasks**:
- [ ] Initialize Firebase project (Auth, Firestore, Storage)
- [ ] Configure BigQuery dataset (`sustainchain` database)
- [ ] Implement tenant registration flow (`/sign-up`)
- [ ] Create role-based access control (Admin/Clerk/Viewer)
- [ ] Set up i18n with next-intl (EN/MS language switcher)

**Deliverable**: Users can sign up and access tenant-isolated dashboard

---

### WEEK 2: Multimodal Bill Ingestion (CORE FEATURE)
**Goal**: Achieve working Gemini-powered bill extraction

**Tasks**:
- [ ] Build drag-and-drop file uploader component (`components/dashboard/bill-uploader.tsx`)
- [ ] Implement `/api/analyze` endpoint:
  - Accept image upload → Firebase Storage
  - Call Gemini 1.5 Flash Vision with structured output prompt
  - Parse JSON response (kWh, date, amount)
- [ ] Create data entry form with manual override option
- [ ] Write Firestore schema: `/tenants/{id}/entries/{entryId}`
- [ ] Add loading states + error handling (retry mechanism)

**Demo Test**: Upload sample TNB bill → Display extracted kWh value

---

### WEEK 3: Carbon Calculation & Dashboard
**Goal**: Convert utility data to CO2e and visualize trends

**Tasks**:
- [ ] Implement emission factor calculations (electricity, water, fuel)
- [ ] Build dashboard cards:
  - Total CO2e (current month)
  - Trend chart (last 6 months) - Recharts line graph
  - Emission breakdown (pie chart: electricity 70%, fuel 20%, water 10%)
- [ ] Create `/entries` page with data table (sortable, filterable)
- [ ] Add data export to CSV functionality

**Deliverable**: Real-time dashboard showing carbon footprint

---

### WEEK 4: BigQuery Benchmarking
**Goal**: Enable sector comparison analytics

**Tasks**:
- [ ] Set up ETL pipeline: Firestore → BigQuery (Cloud Function trigger)
- [ ] Design BigQuery schema:
  ```sql
  CREATE TABLE emissions (
    tenant_id STRING,
    sector STRING,
    monthly_co2e FLOAT64,
    billing_month DATE,
    entry_count INT64
  )
  ```
- [ ] Write benchmarking SQL queries (sector averages, percentiles)
- [ ] Build `/reports` page with:
  - "Your Performance" card (percentile ranking)
  - Sector comparison bar chart
  - Improvement recommendations (AI-generated via Gemini Pro)

**Demo Test**: Show "Your factory emits 18% less than F&B sector average"

---

### WEEK 5: PDF Report Generation & Localization
**Goal**: Generate submission-ready ESG reports

**Tasks**:
- [ ] Implement `/api/reports/generate` endpoint (React-PDF)
- [ ] Design PDF template:
  - Company logo + tenant info
  - Emission summary table
  - Benchmarking chart (embedded image)
  - SDG alignment icons (8, 9, 12)
  - Bilingual headers
- [ ] Add "Download Report" button on dashboard
- [ ] Complete Malay translations for all UI text
- [ ] Test with actual SME use case (Muar furniture factory scenario)

**Deliverable**: Downloadable PDF report (English + Malay versions)

---

### WEEK 6: Polish, Testing & Demo Prep
**Goal**: Finalize "Showstopper Demo" experience

**Tasks**:
- [ ] Performance optimization:
  - Implement Next.js ISR for dashboard (revalidate every 60s)
  - Add Firestore indexes for queries
  - Compress images with Next.js Image component
- [ ] Security audit:
  - Test Firebase Security Rules (no cross-tenant access)
  - Add CAPTCHA to sign-up form
- [ ] Prepare demo script:
  - Story: "Pak Ahmad's furniture shop losing Samsung contract"
  - Live upload: Blurry TNB bill → Instant extraction
  - Show benchmarking: "You're in top 30% of manufacturers"
  - Generate PDF in 3 seconds
- [ ] Record backup demo video (in case of Wi-Fi issues)
- [ ] Create pitch deck (10 slides: Problem, Solution, Tech Stack, Impact)

**Demo Checklist**:
- [ ] ✅ Blurry bill photo uploads successfully
- [ ] ✅ Gemini extracts data with >90% accuracy
- [ ] ✅ Dashboard displays CO2e calculations
- [ ] ✅ Benchmarking shows sector comparison
- [ ] ✅ PDF report generates in <5 seconds
- [ ] ✅ Language switches between EN/MS seamlessly
- [ ] ✅ Mobile-responsive on iPad (judges may use tablets)

---

## 🎯 SHOWSTOPPER DEMO SCRIPT (5 Minutes)

### Scene 1: The Problem (30 seconds)
*"Meet Pak Ahmad. His furniture factory in Muar supplies IKEA. But IKEA now requires ESG data—or he loses the contract. Hiring a consultant costs RM15,000. Manual data entry? 40 hours/month. He's stuck."*

### Scene 2: The Solution (2 minutes)
*"Introducing SustainChain. Watch this: [Upload blurry TNB bill photo]. Our Gemini-powered AI extracts 850 kWh instantly. It calculates 498 kg CO2e emissions. Now look—[Switch to dashboard]—he sees he's emitting 20% LESS than other manufacturers. That's his competitive advantage."*

### Scene 3: The Impact (1.5 minutes)
*"Now he generates an ESG report [Click Download]. 3 seconds—done. PDF includes benchmarking, SDG alignment, and it's bilingual. He emails this to IKEA. Contract saved. And look—[Show system config]—this scales to 1,000 SMEs. Every factory in Johor can now compete with giants."*

### Scene 4: The Tech (1 minute)
*"Under the hood: Gemini 1.5 Flash for multimodal OCR. BigQuery for sector-wide analytics. Firebase for multi-tenant security. And it's 100% Google Cloud—built for KitaHack's mission to democratize AI for Malaysian businesses."*

---

## 📊 SUCCESS METRICS (KitaHack 2026 Rubric Alignment)

### Technical Depth (40%)
- ✅ **Advanced Gemini Use**: Structured output + vision in production
- ✅ **BigQuery Analytics**: Complex SQL aggregations for benchmarking
- ✅ **Multi-Tenant Architecture**: Production-ready data isolation
- ✅ **API Design**: RESTful endpoints with error handling

### Presentation/Demo (40%)
- ✅ **Wow Factor**: Blurry bill → Instant extraction (shows AI power)
- ✅ **Storytelling**: Pak Ahmad narrative (emotional + practical)
- ✅ **Visual Polish**: Professional dashboard with charts
- ✅ **Live Demo**: No mocks—real Gemini API calls

### Innovation/SDG Impact (20%)
- ✅ **SDG 8 (Economic Growth)**: Helps SMEs retain MNC contracts
- ✅ **SDG 9 (Infrastructure)**: Builds digital ESG infrastructure
- ✅ **SDG 12 (Responsible Consumption)**: Carbon reduction incentives
- ✅ **Market Fit**: Addresses Bursa Malaysia 2026 mandate

---

## 🚨 CRITICAL SUCCESS FACTORS

1. **Gemini Accuracy**: Must achieve >90% extraction accuracy on Malaysian bills (TNB/SAJ formats). Test with 50 real bills during Week 2.
2. **Demo Reliability**: Have backup pre-recorded video. Test on venue Wi-Fi 1 hour before.
3. **Localization**: Judges may be Malay-speaking government officials. Perfect translation is non-negotiable.
4. **Performance**: Dashboard must load <1s. Use Next.js static generation + Firebase SDK v9 (modular imports).
5. **Story Over Tech**: Lead with Pak Ahmad's problem, not "We used Gemini." Judges care about impact first.

---

## 🛠️ RECOMMENDED TECH STACK CONFIGURATION

```javascript
// firebase.config.ts
{
  projectId: "sustainchain-2026",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "sustainchain-2026.firebaseapp.com",
  storageBucket: "sustainchain-bills",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// gemini.config.ts
{
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.1, // Low temp for factual extraction
    responseMimeType: "application/json",
    responseSchema: billSchema
  }
}

// bigquery.config.ts
{
  dataset: "sustainchain",
  table: "emissions",
  location: "asia-southeast1" // Singapore region for latency
}
```

---

**END OF DOCUMENT**

*Last Updated: January 17, 2026*  
*Document Owner: Lead Full-Stack Architect, SustainChain Team*  
*Version: 1.0 (KitaHack 2026 Submission)*
