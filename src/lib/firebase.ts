import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("🔥 Initializing Firebase...");
console.log("DEBUG - All import.meta.env:", import.meta.env);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

console.log("Firebase config loaded:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "✓ (hidden)" : "❌ missing",
});

const missing = Object.entries(firebaseConfig)
  .filter(([_, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error("❌ Missing Firebase env vars:", missing);
  console.warn("⚠️ Running in DEMO MODE - Firebase features will not work");
  // Temporarily disabled to show UI: throw new Error(
  //   `Missing Firebase env vars: ${missing.join(", ")}. Check .env and restart.`
  // );
}

console.log("✅ All Firebase env vars present");

let app, auth, db;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized");
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("✅ Firebase Auth and Firestore ready");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  console.warn("⚠️ DEMO MODE: Creating mock Firebase instances");
  // Create mock objects so imports don't crash
  app = null as any;
  auth = null as any;
  db = null as any;
}

export { app, auth, db };
