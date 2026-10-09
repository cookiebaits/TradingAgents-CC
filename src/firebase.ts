import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

let authInstance: Auth | null = null;
let providerInstance: GoogleAuthProvider | null = null;

const hasValidApiKey = Boolean(
  firebaseConfig &&
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.trim().length > 0
);

if (hasValidApiKey) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    providerInstance = new GoogleAuthProvider();
    providerInstance.addScope('https://www.googleapis.com/auth/userinfo.email');
    providerInstance.addScope('https://www.googleapis.com/auth/userinfo.profile');
    providerInstance.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('Firebase Auth initialization skipped:', err);
    authInstance = null;
  }
}

export const auth = authInstance;

let cachedUser: any = null;
let cachedToken: string | null = null;

// Persistent mock session storage if real Firebase apiKey is not active
const DEMO_STORAGE_KEY = 'tauric_auth_demo_user';
try {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(DEMO_STORAGE_KEY) : null;
  if (stored) {
    cachedUser = JSON.parse(stored);
  }
} catch {
  // localStorage may be unavailable in some environments
}

const authListeners: Array<(user: any) => void> = [];

export const signInWithGoogle = async (): Promise<any> => {
  if (auth && providerInstance) {
    try {
      const result = await signInWithPopup(auth, providerInstance);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      cachedToken = credential?.accessToken || null;
      cachedUser = result.user;
      authListeners.forEach((cb) => cb(cachedUser));
      return result.user;
    } catch (error: any) {
      console.warn('Firebase Popup Sign-In failed or cancelled:', error);
      // If popup fails or apiKey rejected, fallback to demo authenticated session
      if (
        error?.code === 'auth/invalid-api-key' ||
        error?.code === 'auth/api-key-not-valid' ||
        error?.code === 'auth/unauthorized-domain'
      ) {
        const demoUser = {
          uid: 'quant-trader-01',
          displayName: 'Lead Quant Trader',
          email: 'cookiescambait@gmail.com',
          photoURL: null,
        };
        cachedUser = demoUser;
        try {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
        } catch {}
        authListeners.forEach((cb) => cb(demoUser));
        return demoUser;
      }
      throw error;
    }
  }

  // Graceful fallback when Firebase API key is unconfigured
  const demoUser = {
    uid: 'quant-trader-01',
    displayName: 'Lead Quant Trader',
    email: 'cookiescambait@gmail.com',
    photoURL: null,
  };
  cachedUser = demoUser;
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
  } catch {}
  authListeners.forEach((cb) => cb(demoUser));
  return demoUser;
};

export const logoutGoogle = async (): Promise<void> => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
  }
  cachedToken = null;
  cachedUser = null;
  try {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {}
  authListeners.forEach((cb) => cb(null));
};

export const listenToAuth = (callback: (user: any) => void) => {
  authListeners.push(callback);

  if (auth) {
    const unsub = onAuthStateChanged(auth, (user) => {
      cachedUser = user;
      callback(user);
    });
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx !== -1) authListeners.splice(idx, 1);
      unsub();
    };
  }

  // Immediately notify listener of current state asynchronously to match Firebase auth lifecycle
  setTimeout(() => {
    callback(cachedUser);
  }, 0);

  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
};

export const getCachedAccessToken = () => cachedToken;
