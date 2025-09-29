import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration - using actual project values
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopment123456789", // Replace with your actual API key
  authDomain: "ready-to-run-cq-app.firebaseapp.com",
  projectId: "ready-to-run-cq-app",
  storageBucket: "ready-to-run-cq-app.firebasestorage.app",
  messagingSenderId: "123456789012", // Replace with your actual sender ID
  appId: "1:123456789012:web:abcdef123456789" // Replace with your actual app ID
};

// Initialize Firebase only if not in a server environment
let app: any = null;
let storage: any = null;

// Check if we're in a browser/React Native environment
if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    app = null;
    storage = null;
  }
} else {
  console.log('Firebase initialization skipped (server environment)');
  app = null;
  storage = null;
}

export { storage };
export default app;