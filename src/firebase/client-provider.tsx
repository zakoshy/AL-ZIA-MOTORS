'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
};

function initializeFirebase(): FirebaseServices | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is missing. Firebase could not be initialized.");
    return null;
  }
  
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app),
    storage: getStorage(app)
  };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const services = useMemo(initializeFirebase, []);

  return (
    <FirebaseProvider value={services}>
      {children}
    </FirebaseProvider>
  );
}
