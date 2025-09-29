# Firebase Configuration

## Current Status
The app is configured to work with Firebase, but you need to replace the placeholder values with your actual Firebase project credentials.

## Configuration File
Update `constants/firebase.ts` with your actual Firebase project values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY", // Replace this
  authDomain: "ready-to-run-cq-app.firebaseapp.com",
  projectId: "ready-to-run-cq-app", 
  storageBucket: "ready-to-run-cq-app.firebasestorage.app",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID", // Replace this
  appId: "YOUR_ACTUAL_APP_ID" // Replace this
};
```

## Where to Find Your Values
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ready-to-run-cq-app`
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on your web app or create one if needed
6. Copy the config values

## Features Using Firebase
- **Snap & Send**: Uploads photos and form data to Firebase Storage
- **GPS Problems**: Uploads GPS diagnostic photos and details to Firebase Storage
- **File Upload**: Uses `utils/firebase-upload.ts` for handling multiple image uploads

## Development Mode
The app will continue to work in development mode even if Firebase fails to initialize. It will show success screens and log data to console for testing purposes.

## Web vs Native
- The Firebase SDK used is the modern v9+ SDK that works in React Native
- Web-based Firebase scripts (like the ones you provided) won't work in React Native
- The app handles web compatibility through Platform checks