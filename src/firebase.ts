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

let authInstance: Auth | null = null;
let providerInstance: GoogleAuthProvider | null = null;

// Ensure Firebase is initialized if valid or fallback
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
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

  // 2. Try Google Identity Services (GIS) Token Popup Window
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
    try {
      const tokenPromise = new Promise<{ success: boolean; user?: UserProfile; error?: string }>((resolve) => {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id:
              firebaseConfig.oAuthClientId ||
              '985768273264-dnrdqejf59pqf61oqk0uq9kh613l0e2n.apps.googleusercontent.com',
            scope: 'openid email profile',
            prompt: 'select_account',
            callback: async (tokenResponse: any) => {
              if (tokenResponse?.error) {
                resolve({ success: false, error: tokenResponse.error });
                return;
              }
              try {
                activeToken = tokenResponse.access_token;
                const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (infoRes.ok) {
                  const googleInfo = await infoRes.json();
                  const userProfile = completeGoogleSignIn({
                    uid: googleInfo.sub || googleInfo.email,
                    email: googleInfo.email,
                    displayName: googleInfo.name || googleInfo.email.split('@')[0],
                    photoURL: googleInfo.picture || null,
                  });
                  resolve({ success: true, user: userProfile });
                  return;
                }
              } catch (fetchErr) {
                console.warn('Failed to fetch userinfo:', fetchErr);
              }
              resolve({ success: false });
            },
          });
          client.requestAccessToken({ prompt: 'select_account' });
        } catch (initErr: any) {
          resolve({ success: false, error: initErr?.message });
        }
      });

      // Allow 3.5s for GIS popup
      const result = await Promise.race([
        tokenPromise,
        new Promise<{ success: boolean; needsAccountChooser: boolean }>((r) =>
          setTimeout(() => r({ success: false, needsAccountChooser: true }), 3500)
        ),
      ]);

      if (result.success && result.user) {
        return { success: true, user: result.user };
      }
    } catch (gisErr) {
      console.warn('GIS OAuth note:', gisErr);
    }
  }

  // 3. If popup is restricted in preview sandbox, present account chooser fallback
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
