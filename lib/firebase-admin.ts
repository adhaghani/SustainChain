import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * Initialize Firebase Admin SDK singleton.
 * Uses service account credentials from environment variables.
 */
function initializeFirebaseAdmin(): App {
  const existingApps = getApps();

  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in environment variables.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// Initialize the app once
const app = initializeFirebaseAdmin();

// Initialize Firestore with settings (only once)
// Use global variable to prevent re-initialization during hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _firestoreInstance: Firestore | undefined;
}

function initializeFirestore(): Firestore {
  if (!global._firestoreInstance) {
    const firestore = getFirestore(app);
    // Only call settings if not already initialized
    try {
      firestore.settings({
        ignoreUndefinedProperties: true,
      });
    } catch (error) {
      // Settings already called, ignore error
      console.warn("Firestore settings already initialized");
    }
    global._firestoreInstance = firestore;
  }
  return global._firestoreInstance;
}

// Export the Firestore instance
export const db: Firestore = initializeFirestore();

// Export auth instance
export const adminAuth = getAuth(app);

/**
 * Verify Firebase ID token
 */
export async function verifyIdToken(token: string) {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
}

export default app;
