    // ============================================================
//  Social Login (Google + GitHub) via Firebase Authentication
//
//  HOW TO MAKE IT WORK (one-time, ~5 minutes, FREE):
//  1. Go to https://console.firebase.google.com  ->  "Add project"
//     (name it e.g. fraudguard-ai, Google Analytics optional/off)
//  2. Build  ->  Authentication  ->  Get started  ->  Sign-in method
//       - Enable "Google"        (pick a support email, Save)
//       - Enable "GitHub": on github.com/settings/developers create an
//         OAuth App, paste Firebase's callback URL into it
//         (looks like https://YOUR-PROJECT.firebaseapp.com/__/auth/handler),
//         then copy the GitHub Client ID + Secret into Firebase, Save.
//  3. Project settings (gear icon)  ->  "Your apps"  ->  Web app  ->
//     copy the firebaseConfig values and paste them below.
//  4. Authentication -> Settings -> Authorized domains:
//     add your deployed domain (localhost is already allowed).
//  5. In your project run:   npm install firebase
//
//  UNTIL YOU PASTE YOUR CONFIG the buttons run in DEMO mode:
//  they sign in a demo user so you can test the flow end-to-end.
// ============================================================

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'PASTE_YOUR_PROJECT.firebaseapp.com',
  projectId: 'PASTE_YOUR_PROJECT_ID',
  appId: 'PASTE_YOUR_APP_ID',
};

const isConfigured =
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('PASTE');

let auth = null;

if (isConfigured) {
  auth = getAuth(initializeApp(firebaseConfig));
}

export async function signInWithProvider(providerName) {
  // ---- DEMO MODE (config not pasted yet) ----
  if (!auth) {
    console.warn(
      '[FraudGuard] Firebase config not set - using demo social login.'
    );

    const demoUser =
      providerName === 'google'
        ? {
            email: 'demo.google.user@gmail.com',
            displayName: 'Google Demo User',
          }
        : {
            email: 'demo.github.user@github.com',
            displayName: 'GitHub Demo User',
          };

    return {
      token:
        'demo-' +
        providerName +
        '-' +
        Date.now(),
      email: demoUser.email,
      displayName: demoUser.displayName,
    };
  }

  // ---- REAL MODE ----
  const provider =
    providerName === 'google'
      ? new GoogleAuthProvider()
      : new GithubAuthProvider();

  const result = await signInWithPopup(
    auth,
    provider
  );

  return {
    token: await result.user.getIdToken(),
    email: result.user.email,
    displayName:
      result.user.displayName ||
      result.user.email?.split('@')[0] ||
      'User',
  };
}
