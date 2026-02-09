'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

function initializeFirebase(): FirebaseServices | null {
  // This check prevents initialization on the server during build if env vars aren't available.
  if (!firebaseConfig.apiKey) {
    return null;
  }
  
  if (getApps().length > 0) {
    const app = getApp();
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
  }
  
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // useMemo ensures initialization happens only once.
  const services = useMemo(initializeFirebase, []);

  // Always render the provider, but the value can be null if initialization fails.
  // Hooks consuming the context will need to handle the null case.
  return (
    <FirebaseProvider value={services}>
      {children}
    </FirebaseProvider>
  );
}
