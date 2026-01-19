import { BigQuery } from '@google-cloud/bigquery';

/**
 * Initialize BigQuery client.
 * Uses service account credentials from environment variables.
 * 
 * Note: BigQuery can use the same service account as Firebase Admin
 * or a dedicated one. The GOOGLE_APPLICATION_CREDENTIALS env var
 * can be used, or explicit projectId/credentials can be passed.
 */
function initializeBigQuery(): BigQuery {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error('Missing GOOGLE_CLOUD_PROJECT_ID. Please set it in environment variables.');
  }

  // If using explicit credentials (matching Firebase Admin approach)
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    return new BigQuery({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }

  // Fallback to default credentials (GOOGLE_APPLICATION_CREDENTIALS)
  return new BigQuery({ projectId });
}

// Dataset and table configuration
export const DATASET_ID = 'kita_hack_data';
export const TABLE_ID = 'sustainability_benchmarks';

// Export the BigQuery client
export const bigquery = initializeBigQuery();

export default bigquery;
