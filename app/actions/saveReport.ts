'use server';

import { db } from '@/lib/firebase-admin';
import { bigquery, DATASET_ID, TABLE_ID } from '@/lib/bigquery';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Interface for the ESG report data received from Gemini analysis.
 */
export interface ESGReportData {
  // Document ID (present when fetched from Firestore)
  id?: string;
  
  // User/Company Information
  userId?: string;
  companyName?: string;
  companySector: string;

  // Energy Data
  kwhUsage: number;
  co2Emissions: number; // in kg CO2e

  // Optional detailed data
  billingPeriod?: { start: string; end: string };
  utilityProvider?: string;
  meterNumber?: string;

  // Raw analysis from Gemini
  rawAnalysis?: Record<string, unknown>;
}

/**
 * Interface for the simplified BigQuery benchmark row.
 */
interface BenchmarkRow {
  timestamp: string;
  company_sector: string;
  kwh_usage: number;
  co2_emissions: number;
}

/**
 * Save ESG report to Firestore and insert benchmark data to BigQuery.
 * 
 * @param reportData - The parsed ESG report data from Gemini analysis.
 * @returns Object containing success status and document/error details.
 */
export async function saveReport(reportData: ESGReportData): Promise<{
  success: boolean;
  firestoreDocId?: string;
  bigQueryInserted?: boolean;
  error?: string;
}> {
  const timestamp = new Date().toISOString();
  let firestoreDocId: string | undefined;
  let bigQueryInserted = false;

  // 1. Save full report to Firestore
  try {
    const docRef = await db.collection('esg_reports').add({
      ...reportData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    firestoreDocId = docRef.id;
    console.log(`[Firestore] ESG Report saved with ID: ${firestoreDocId}`);
  } catch (error) {
    console.error('[Firestore] Error saving ESG report:', error);
    return {
      success: false,
      error: `Firestore save failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }

  // 2. Insert simplified benchmark data to BigQuery
  try {
    const benchmarkRow: BenchmarkRow = {
      timestamp,
      company_sector: reportData.companySector,
      kwh_usage: reportData.kwhUsage,
      co2_emissions: reportData.co2Emissions,
    };

    await bigquery
      .dataset(DATASET_ID)
      .table(TABLE_ID)
      .insert([benchmarkRow]);

    bigQueryInserted = true;
    console.log(`[BigQuery] Benchmark data inserted for sector: ${reportData.companySector}`);
  } catch (error) {
    // Log the error but don't fail the entire operation
    // BigQuery insert is secondary to Firestore save
    console.error('[BigQuery] Error inserting benchmark data:', error);
    
    // Check for specific BigQuery errors
    if (error instanceof Error) {
      // BigQuery partial failures contain insertErrors
      const bqError = error as { errors?: Array<{ errors: Array<{ message: string }> }> };
      if (bqError.errors) {
        console.error('[BigQuery] Insert errors:', JSON.stringify(bqError.errors, null, 2));
      }
    }
  }

  return {
    success: true,
    firestoreDocId,
    bigQueryInserted,
  };
}

/**
 * Retrieve ESG reports for a specific user.
 * 
 * @param userId - The user ID to fetch reports for.
 * @returns Array of ESG reports.
 */
export async function getReportsByUser(userId: string): Promise<ESGReportData[]> {
  try {
    const snapshot = await db
      .collection('esg_reports')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as unknown as ESGReportData));
  } catch (error) {
    console.error('[Firestore] Error fetching reports:', error);
    throw error;
  }
}
