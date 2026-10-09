import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({ prompt: 'select_account' });

let cachedUser: User | null = null;
let cachedToken: string | null = null;

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedToken = credential?.accessToken || null;
    cachedUser = result.user;
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const logoutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedToken = null;
  cachedUser = null;
};

export const listenToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    cachedUser = user;
    callback(user);
  });
};

export const getCachedAccessToken = () => cachedToken;
