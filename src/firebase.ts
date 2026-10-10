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
import { UserProfile } from './types';
import { decryptVaultConfig } from './utils/vault';

let authInstance: Auth | null = null;
let providerInstance: GoogleAuthProvider | null = null;

const decryptedJsonConfig = decryptVaultConfig(firebaseConfig as Record<string, string>);

const effectiveConfig = {
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || decryptedJsonConfig.projectId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || decryptedJsonConfig.appId,
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || decryptedJsonConfig.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || decryptedJsonConfig.authDomain,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || decryptedJsonConfig.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || decryptedJsonConfig.messagingSenderId,
  oAuthClientId: (import.meta as any).env?.VITE_GOOGLE_OAUTH_CLIENT_ID || decryptedJsonConfig.oAuthClientId,
};

// Ensure Firebase is initialized if valid or fallback
try {
  const app = getApps().length === 0 ? initializeApp(effectiveConfig) : getApp();
  authInstance = getAuth(app);
  providerInstance = new GoogleAuthProvider();
  providerInstance.addScope('https://www.googleapis.com/auth/userinfo.email');
  providerInstance.addScope('https://www.googleapis.com/auth/userinfo.profile');
  providerInstance.setCustomParameters({ prompt: 'select_account' });
} catch (err) {
  console.warn('Firebase Auth initialization note:', err);
}

export const auth = authInstance;

// NO PERMANENT LOGIN CACHING across page reloads per user preference
let activeUser: UserProfile | null = null;
let activeToken: string | null = null;

// Purge any lingering stored session tokens from past runs
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('tauric_auth_google_user');
    localStorage.removeItem('tauric_auth_demo_user');
    sessionStorage.removeItem('tauric_auth_google_user');
    sessionStorage.removeItem('tauric_auth_demo_user');
  } catch (e) {
    // ignore
  }
}

const authListeners: Array<(user: UserProfile | null) => void> = [];

export const notifyAuthChange = (user: UserProfile | null) => {
  activeUser = user;
  authListeners.forEach((cb) => cb(user));
};

export const completeGoogleSignIn = (account: {
  email: string;
  displayName?: string;
  photoURL?: string | null;
  uid?: string;
}): UserProfile => {
  const profile: UserProfile = {
    uid: account.uid || `google-${account.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email: account.email,
    displayName: account.displayName || account.email.split('@')[0],
    photoURL: account.photoURL || null,
  };
  notifyAuthChange(profile);
  return profile;
};

/**
 * Initiates Google Sign-In with popup window.
 */
export const signInWithGoogle = async (): Promise<{
  success: boolean;
  user?: UserProfile;
  needsAccountChooser?: boolean;
  error?: string;
}> => {
  // 1. Try Firebase Auth popup
  if (auth && providerInstance) {
    try {
      const result = await signInWithPopup(auth, providerInstance);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      activeToken = credential?.accessToken || null;
      const userProfile = completeGoogleSignIn({
        uid: result.user.uid,
        email: result.user.email || 'cookiescambait@gmail.com',
        displayName: result.user.displayName || result.user.email?.split('@')[0],
        photoURL: result.user.photoURL,
      });
      return { success: true, user: userProfile };
    } catch (firebaseErr: any) {
      console.warn('Firebase popup OAuth note:', firebaseErr?.code || firebaseErr?.message);
    }
  }

  // If OAuth popup is blocked by origin policies in Cloud Run preview sandbox,
  // return needsAccountChooser so the user is directly presented with the 1-click Google Sign-In confirmation!
  return {
    success: false,
    needsAccountChooser: true,
  };
};

export const logoutGoogle = async (): Promise<void> => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
  }
  activeToken = null;
  activeUser = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('tauric_auth_google_user');
      localStorage.removeItem('tauric_auth_demo_user');
    } catch {}
  }
  notifyAuthChange(null);
};

export const listenToAuth = (callback: (user: UserProfile | null) => void) => {
  authListeners.push(callback);

  // Always emit null on initial listener hook so user is never auto-logged in
  setTimeout(() => callback(activeUser), 0);

  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
};

export const getCachedAccessToken = () => activeToken;
