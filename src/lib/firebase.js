import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Returns the Firebase App instance, lazily initialized.
 * Returns null during SSR / prerender / build when window is unavailable
 * or when Firebase env vars are not set — preventing build-time crashes.
 */
export function getFirebaseApp() {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfig.apiKey) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Returns the Firebase Auth instance, lazily initialized.
 * Returns null on the server or when Firebase is not configured.
 */
export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

/**
 * Returns the Firestore instance, lazily initialized.
 * Returns null on the server or when Firebase is not configured.
 */
export function getFirebaseDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return initializeFirestore(app, {});
  } catch {
    return getFirestore(app);
  }
}

export const auth = getFirebaseAuth();
export const db = getFirebaseDb();

// ─── Emulator connection (browser-only, runs once) ───────────────────────────
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  if (!globalThis.__CAREEROS_EMULATOR_CONNECTED__) {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    if (auth && db) {
      const authHost =
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
      const firestoreHost =
        process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
      const [fsHost, fsPort] = firestoreHost.split(':');

      connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
      connectFirestoreEmulator(db, fsHost, Number(fsPort));

      globalThis.__CAREEROS_EMULATOR_CONNECTED__ = true;
    }
  }
}

// ─── Dev-only config warning (server-safe) ───────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const missing = Object.entries(firebaseConfig).filter(([, val]) => !val);
  if (missing.length > 0) {
    console.warn(
      '[CareerOS] Missing Firebase configuration for:',
      missing.map(([key]) => key).join(', ')
    );
  }
}
