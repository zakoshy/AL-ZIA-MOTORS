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

  // If Firebase isn't initialized (e.g., on the server during build), don't render the provider or its children.
  // This prevents crashes and the client-side render will correctly populate everything.
  if (!services) {
    return null; 
  }

  return (
    <FirebaseProvider value={services}>
      {children}
    </FirebaseProvider>
  );
}
