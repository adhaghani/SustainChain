#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Initialize Rate Limits in Firestore
 * 
 * This script creates the /system_config/api_limits document with default
 * rate limits and quotas if it doesn't exist.
 * 
 * Usage:
 *   node scripts/init-rate-limits.js
 * 
 * Or add to package.json scripts:
 *   "init-rate-limits": "node scripts/init-rate-limits.js"
 */

require('dotenv').config({ path: '.env' });

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  // Try FIREBASE_SERVICE_ACCOUNT_KEY first (full JSON)
  let serviceAccount;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim()) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
      console.log('Falling back to individual environment variables...\n');
      serviceAccount = null;
    }
  }
  
  // Fall back to individual environment variables
  if (!serviceAccount) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Missing Firebase Admin credentials.');
      console.error('Required environment variables:');
      console.error('  - FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)');
      console.error('  - FIREBASE_CLIENT_EMAIL');
      console.error('  - FIREBASE_PRIVATE_KEY');
      console.error('\nOr provide:');
      console.error('  - FIREBASE_SERVICE_ACCOUNT_KEY (full JSON)');
      process.exit(1);
    }
    
    serviceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

/**
 * Default rate limits from FIREBASE_SCHEMA.md
 */
const DEFAULT_RATE_LIMITS = {
  billAnalysis: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500,
  },
  reportGeneration: {
    requestsPerMinute: 5,
    requestsPerHour: 50,
    requestsPerDay: 200,
  },
};

/**
 * Default quotas by subscription tier from FIREBASE_SCHEMA.md
 */
const DEFAULT_QUOTAS = {
  trial: {
    maxUsers: 1,
    maxBillsPerMonth: 2,
    maxReportsPerMonth: 0,
  },
  standard: {
    maxUsers: 10,
    maxBillsPerMonth: 50,
    maxReportsPerMonth: 50,
  },
  premium: {
    maxUsers: 50,
    maxBillsPerMonth: 2000,
    maxReportsPerMonth: 200,
  },
  enterprise: {
    maxUsers: -1, // unlimited
    maxBillsPerMonth: -1, // unlimited
    maxReportsPerMonth: -1, // unlimited
  },
};

async function initializeRateLimits() {
  try {
    console.log('🚀 Initializing rate limits and monthly quotas in Firestore...\n');

    // Step 1: Initialize system config
    const configRef = db.collection('system_config').doc('api_limits');
    const configDoc = await configRef.get();

    if (configDoc.exists) {
      console.log('✅ Rate limits document already exists');
      console.log('\nCurrent configuration:');
      console.log(JSON.stringify(configDoc.data(), null, 2));
    } else {
      // Create the document with defaults
      await configRef.set({
        rateLimits: DEFAULT_RATE_LIMITS,
        quotas: DEFAULT_QUOTAS,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'system',
      });

      console.log('✅ Successfully initialized rate limits\n');
      console.log('Rate Limits:');
      console.log(JSON.stringify(DEFAULT_RATE_LIMITS, null, 2));
      console.log('\nQuotas:');
      console.log(JSON.stringify(DEFAULT_QUOTAS, null, 2));
    }

    // Step 2: Initialize monthly usage for all tenants
    console.log('\n🔄 Initializing monthly quotas for existing tenants...\n');
    
    const tenantsSnapshot = await db.collection('tenants').get();
    
    if (tenantsSnapshot.empty) {
      console.log('ℹ️  No tenants found.');
    } else {
      const now = new Date();
      const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
      const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
      
      let initialized = 0;
      let skipped = 0;
      
      const batch = db.batch();
      
      for (const tenantDoc of tenantsSnapshot.docs) {
        const tenantData = tenantDoc.data();
        
        // Skip if monthlyUsage already exists
        if (tenantData.monthlyUsage) {
          skipped++;
          continue;
        }
        
        // Initialize monthlyUsage
        batch.update(tenantDoc.ref, {
          monthlyUsage: {
            billAnalysisCount: 0,
            reportGenerationCount: 0,
            periodStart: admin.firestore.Timestamp.fromDate(periodStart),
            periodEnd: admin.firestore.Timestamp.fromDate(periodEnd),
            lastReset: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
        });
        
        initialized++;
      }
      
      if (initialized > 0) {
        await batch.commit();
        console.log(`✅ Initialized monthly quotas for ${initialized} tenant(s)`);
      }
      
      if (skipped > 0) {
        console.log(`ℹ️  Skipped ${skipped} tenant(s) (already initialized)`);
      }
    }

    console.log('\n📝 You can modify rate limits via:');
    console.log('  - SuperAdmin UI: /system-admin/rate-limits');
    console.log('  - API: PATCH /api/system-admin/rate-limits');
    console.log('  - Firestore Console: /system_config/api_limits\n');

  } catch (error) {
    console.error('❌ Error initializing rate limits:', error);
    process.exit(1);
  } finally {
    // Close admin instance
    await admin.app().delete();
  }
}

// Run the initialization
initializeRateLimits();
