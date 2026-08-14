import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  // This app uses the Firebase project linked in the console: skillpassport-d9bec.
  // Firebase web config identifiers are public; keeping this fixed prevents a
  // stale deployment environment from accidentally selecting another project.
  apiKey: "AIzaSyCloSzqVIVIXl6YKQyAGG0yQ_nY4DG7TXY",
  authDomain: "skillpassport-d9bec.firebaseapp.com",
  projectId: "skillpassport-d9bec",
  storageBucket: "skillpassport-d9bec.firebasestorage.app",
  messagingSenderId: "14241077671",
  appId: "1:14241077671:web:e7c1dda233614bfeea7e82",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize GoogleAuthProvider with proper configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Set persistence to LOCAL so sessions survive page refreshes
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Failed to set auth persistence:", error);
});

/**
 * Handle redirect result from Firebase OAuth flow.
 * Call this on component mount to capture the auth result after redirect.
 */
export async function handleAuthRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (!result?.user) return null;

    const user = result.user;
    return {
      success: true,
      user: {
        name: user.displayName || "Google User",
        email: user.email || "",
        image:
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        idToken: await user.getIdToken(),
      },
    };
  } catch (error: any) {
    console.error(
      "Firebase redirect result error:",
      error?.code,
      error?.message,
    );
    return {
      success: false,
      error: error?.message || "Failed to complete sign-in",
    };
  }
}

/**
 * Sign in with Google using redirect flow (recommended, avoids popup blockers).
 * The redirect will return to the current page after authentication.
 */
export async function signInWithGoogleRedirect() {
  try {
    // Use redirect flow to avoid popup blockers
    await signInWithRedirect(auth, googleProvider);
    // Note: page will redirect to Firebase, then back to this app
    // The result should be handled with handleAuthRedirect() on mount
  } catch (error: any) {
    console.error(
      "Firebase Google Redirect Error:",
      error?.code,
      error?.message,
    );

    let friendlyMessage = error?.message || "Google Sign-In redirect failed.";

    if (error?.code === "auth/invalid-credential") {
      friendlyMessage =
        "Google authentication failed. Please check your Firebase OAuth configuration in Google Cloud Console.";
    } else if (error?.code === "auth/unauthorized-domain") {
      friendlyMessage =
        "This domain is not authorized. Add your URL to Firebase Console → Authentication → Settings → Authorized domains.";
    }

    throw new Error(friendlyMessage);
  }
}

/**
 * Sign in with Google using popup flow (fallback if redirect isn't suitable).
 * Note: May be blocked by browser popup blockers. Use redirect flow when possible.
 */
export async function signInWithGoogleFirebase() {
  try {
    // Try popup first (better UX if it works)
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        name: user.displayName || "Google User",
        email: user.email || "",
        image:
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        idToken: await user.getIdToken(),
      },
    };
  } catch (error: any) {
    console.error("Firebase Google Auth Error:", error?.code, error?.message);

    // Provide user-friendly error messages
    let friendlyMessage =
      error?.message || "Google Sign-In failed or popup was closed.";

    if (error?.code === "auth/invalid-credential") {
      friendlyMessage =
        "Google authentication failed. Please check your Firebase OAuth configuration in Google Cloud Console.";
    } else if (error?.code === "auth/unauthorized-domain") {
      friendlyMessage =
        "This domain is not authorized. Add your URL to Firebase Console → Authentication → Settings → Authorized domains.";
    } else if (error?.code === "auth/popup-blocked") {
      friendlyMessage =
        "Popup blocked by browser. Try disabling popup blockers, or use a private/incognito window.";
    } else if (error?.code === "auth/popup-closed-by-user") {
      friendlyMessage = "Sign-in cancelled. Please try again.";
    }

    return {
      success: false,
      error: friendlyMessage,
    };
  }
}
