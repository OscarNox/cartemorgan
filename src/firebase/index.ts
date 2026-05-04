
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      // Intentamos inicialización automática (entorno Studio)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback al objeto de configuración manual con corrección de bucket
      const config = {
        ...firebaseConfig,
        // Aseguramos que el bucket de almacenamiento esté presente con los formatos estándar de Google Cloud
        storageBucket: (firebaseConfig as any).storageBucket || `${firebaseConfig.projectId}.firebasestorage.app` || `${firebaseConfig.projectId}.appspot.com`
      };
      firebaseApp = initializeApp(config);
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
