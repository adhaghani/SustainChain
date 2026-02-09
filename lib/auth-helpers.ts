/**
 * Helper to get Firebase ID token for authenticated API calls
 */

import { auth } from './firebase';

/**
 * Get the current user's ID token
 * @returns Firebase ID token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  if (!auth?.currentUser) {
    return null;
  }

  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Create authenticated fetch with Authorization header
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
