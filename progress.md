# SustainChain - Development Progress Tracker

**Project:** SustainChain ESG Compliance Platform  
**Timeline:** 6 Weeks (January 17 - February 28, 2026)  
**Last Updated:** January 17, 2026

---

## 🎯 WEEK 1: Foundation & Authentication

### Firebase Infrastructure
- [x] ✅ Create comprehensive Firebase/Firestore database schema (`FIREBASE_SCHEMA.md`)
- [x] ✅ Define composite indexes for optimal query performance
- [x] ✅ Write Firestore Security Rules (multi-tenant isolation + RBAC)
- [x] ✅ Design Cloud Storage rules for bill images and reports
- [x] ✅ Initialize Firebase project (Auth, Firestore, Storage)
- [x] ✅ Deploy security rules to Firebase Console
- [x] ✅ Deploy indexes to Firestore
- [x] ✅ Configure BigQuery dataset (`sustainchain` database)

### Authentication & Multi-Tenant Setup
- [x] ✅ Implement tenant registration flow (`/sign-up`)
- [x] ✅ Create role-based access control (Admin/Clerk/Viewer)
- [x] ✅ Set up Firebase custom claims integration
- [x] ✅ Create TypeScript interfaces for Firestore documents
- [x] ✅ Build Firestore helper functions (CRUD operations)
- [x] ✅ Implement RBAC middleware with permissions
- [x] ✅ Create audit logging system
- [x] ✅ Build user management interface (admin panel)

<!-- not that important, can skip for now -->
### Localization Nearly Complete (Auth & Multi-Tenant - 9)
- [ ] Set up i18n with next-intl (EN/MS language switcher)
- [ ] Create translation files for core UI elements

**Status:** 🟡 In Progress (Schema Design Complete - 40%)

---

## 🔄 WEEK 2: Multimodal Bill Ingestion (CORE FEATURE)

### Bill Upload & Storage
- [ ] Build drag-and-drop file uploader component (`components/bill/bill-uploader.tsx`)
- [ ] Implement Cloud Storage integration for bill images
- [ ] Create image thumbnail generation (Cloud Functions)

### AI Extraction Pipeline
- [ ] Implement `/api/analyze` endpoint:
  - [ ] Accept image upload → Firebase Storage
  - [ ] Call Gemini 1.5 Flash Vision with structured output prompt
  - [ ] Parse JSON response (kWh, date, amount)
- [ ] Create data entry form with manual override option
- [ ] Implement confidence threshold logic (<70% → manual review)

### Data Storage
- [ ] Write entries to Firestore `/tenants/{id}/entries/{entryId}`
- [ ] Add loading states + error handling (retry mechanism)
- [ ] Create audit log triggers for entry creation

**Status:** ⚪ Not Started (0%)

---

## 📊 WEEK 3: Carbon Calculation & Dashboard

### Carbon Footprint Engine
- [ ] Implement emission factor calculations (electricity, water, fuel)
- [ ] Create CO2e calculation service using MGTC factors
- [ ] Build real-time aggregation Cloud Functions

### Dashboard UI
- [ ] Build dashboard cards:
  - [ ] Total CO2e (current month)
  - [ ] Trend chart (last 6 months) - Recharts line graph
  - [ ] Emission breakdown (pie chart: electricity/fuel/water)
- [ ] Create `/entries` page with data table (sortable, filterable)
- [ ] Add data export to CSV functionality
- [ ] Implement real-time updates (Firestore snapshots)

**Status:** ⚪ Not Started (0%)

---

## 📈 WEEK 4: BigQuery Benchmarking

### ETL Pipeline
- [ ] Set up ETL pipeline: Firestore → BigQuery (Cloud Function trigger)
- [ ] Design BigQuery schema for `emissions` table
- [ ] Implement streaming inserts from Firestore
- [ ] Create scheduled job for sector benchmark updates

### Benchmarking Analytics
- [ ] Write benchmarking SQL queries (sector averages, percentiles)
- [ ] Build `/reports` page with:
  - [ ] "Your Performance" card (percentile ranking)
  - [ ] Sector comparison bar chart
  - [ ] Improvement recommendations (AI-generated via Gemini Pro)
- [ ] Cache benchmark results in tenant documents

**Status:** ⚪ Not Started (0%)

---

## 📄 WEEK 5: PDF Report Generation & Localization

### Report Generation
- [ ] Implement `/api/reports/generate` endpoint (React-PDF or Puppeteer)
- [ ] Design PDF template:
  - [ ] Company logo + tenant info
  - [ ] Emission summary table
  - [ ] Benchmarking chart (embedded image)
  - [ ] SDG alignment icons (8, 9, 12)
  - [ ] Bilingual headers (EN/MS)
- [ ] Add "Download Report" button on dashboard
- [ ] Store PDF metadata in `/tenants/{id}/reports`

### Localization Completion
- [ ] Complete Malay translations for all UI text
- [ ] Translate Gemini prompts for Malay bill extraction
- [ ] Test with actual SME use case (Muar furniture factory scenario)

**Status:** ⚪ Not Started (0%)

---

## 🎨 WEEK 6: Polish, Testing & Demo Prep

### Performance Optimization
- [ ] Implement Next.js ISR for dashboard (revalidate every 60s)
- [x] Add Firestore indexes for all queries
- [ ] Compress images with Next.js Image component
- [ ] Optimize bundle size and Core Web Vitals

### Security & Compliance
- [ ] Security audit:
  - [ ] Test Firebase Security Rules (no cross-tenant access)
  - [ ] Penetration testing for API endpoints
  - [ ] Add CAPTCHA to sign-up form
- [ ] PDPA compliance verification
- [ ] Implement rate limiting for API routes

### Demo Preparation
- [ ] Prepare demo script (Pak Ahmad narrative)
- [ ] Test blurry bill upload workflow
- [ ] Verify benchmarking displays correctly
- [ ] Test PDF generation (<5 seconds)
- [ ] Record backup demo video
- [ ] Create pitch deck (10 slides)

### Testing
- [ ] ✅ Unit tests for CO2e calculations
- [ ] ✅ Integration tests for multi-tenant isolation
- [ ] ✅ Security rules simulation tests
- [ ] Load testing (1000 bill uploads/day)
- [ ] Mobile responsiveness testing (iPad/tablet)

**Status:** ⚪ Not Started (0%)

---

## 📌 OVERALL PROGRESS

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| 1 | Foundation & Auth | ✅ Nearly Complete | 90% |
| 2 | Bill Ingestion | ⚪ Not Started | 0% |
| 3 | Dashboard & Carbon Calc | ⚪ Not Started | 0% |
| 4 | BigQuery Benchmarking | ⚪ Not Started | 0% |
| 5 | PDF Reports & i18n | ⚪ Not Started | 0% |
| 6 | Polish & Demo Prep | ⚪ Not Started | 0% |

**Total Project Completion:** 25% (15/60 tasks completed)

---

## 🚀 NEXT IMMEDIATE TASKS

1. **Deploy Firebase Infrastructure**
   - Firebase Console setup (project creation)
   - Deploy Firestore security rules
   - Deploy composite indexes
   - Create Cloud Storage buckets

2. **Implement TypeScript Interfaces**
   - Create `types/firestore.ts` with all document interfaces
   - Set up Firebase Admin SDK
   - Create helper functions for CRUD operations

3. **Build Authentication Flow**
   - Tenant registration with UEN validation
   - Custom claims integration (role + tenantId)
   - User invitation system

---

## 🐛 KNOWN ISSUES & BLOCKERS

None currently.

---

## 📝 NOTES

- Firebase schema designed with PDPA compliance (7-year retention)
- Multi-tenant architecture uses subcollections for data isolation
- Security rules enforce role-based access (admin/clerk/viewer)
- BigQuery partitioning by `billing_date` for cost optimization
- Cloud Storage lifecycle: bills archived after 1 year, deleted after 7 years
