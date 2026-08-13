import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCloSzqVIVIXl6YKQyAGG0yQ_nY4DG7TXY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "skillpassport-d9bec.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "skillpassport-d9bec",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "skillpassport-d9bec.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "14241077671",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:14241077671:web:e7c1dda233614bfeea7e82",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogleFirebase() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        name: user.displayName || "Google User",
        email: user.email || "",
        image: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      },
    };
  } catch (error: any) {
    console.warn("Firebase direct popup error or unconfigured API keys, falling back to simulated modal:", error);
    return { success: false, error: error.message };
  }
}
