import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { 
  initializeFirestore, 
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


if (process.env.NODE_ENV !== 'production') {
  const missing = Object.entries(firebaseConfig).filter(([, val]) => !val);
  if (missing.length > 0) {
    console.warn(
      '[CareerOS] Missing Firebase configuration for:',
      missing.map(([key]) => key).join(', ')
    );
  }
}

// Prevent double-initialization on HMR re-evaluation
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Guard against double initializeFirestore calls (HMR safety)
let db;
try {
  // Use memory-based cache to avoid BloomFilter errors in Firestore 12.13.0
  db = initializeFirestore(app, {});
} catch {
  // Already initialized — get the existing instance
  db = getFirestore(app);
}

export { app, auth, db };

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (useEmulator && typeof window !== 'undefined') {
  if (!globalThis.__CAREEROS_EMULATOR_CONNECTED__) {
    const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
    const firestoreHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
    const [fsHost, fsPort] = firestoreHost.split(':');

    connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
    connectFirestoreEmulator(db, fsHost, Number(fsPort));

    globalThis.__CAREEROS_EMULATOR_CONNECTED__ = true;
  }
}
