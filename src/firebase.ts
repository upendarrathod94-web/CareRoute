import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Helper functions for real-time and offline sync
export const syncMedicineToCloud = async (med: any) => {
  try {
    const docRef = doc(db, 'medicines', String(med.id));
    await setDoc(docRef, { ...med, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Firebase sync offline fallback:', error);
  }
};

export const syncAppointmentToCloud = async (appt: any) => {
  try {
    const docRef = doc(db, 'appointments', String(appt.id));
    await setDoc(docRef, { ...appt, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Firebase sync offline fallback:', error);
  }
};
