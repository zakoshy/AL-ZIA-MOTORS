'use client';

import type { Vehicle, Salesperson } from './types';
import {
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Saves (creates or updates) a vehicle document.
 * @param db The Firestore instance.
 * @param vehicle The vehicle data to save.
 */
export async function saveVehicle(
  db: Firestore,
  vehicle: Omit<Vehicle, 'id' | 'updatedAt'> & { id?: string }
) {
  const { id, ...vehicleData } = vehicle;
  const dataToSave: { [key: string]: any } = {
    ...vehicleData,
    updatedAt: serverTimestamp(),
  };

  // Remove undefined fields before sending to Firestore
  Object.keys(dataToSave).forEach(key => {
    if (dataToSave[key] === undefined) {
      delete dataToSave[key];
    }
  });


  try {
    if (id) {
      // Update existing vehicle
      const vehicleRef = doc(db, 'vehicles', id);
      await setDoc(vehicleRef, dataToSave, { merge: true });
    } else {
      // Create new vehicle
      const collectionRef = collection(db, 'vehicles');
      await addDoc(collectionRef, dataToSave);
    }
  } catch (error) {
      const path = id ? `vehicles/${id}` : 'vehicles';
      const operation = id ? 'update' : 'create';
      const permissionError = new FirestorePermissionError({
        path: path,
        operation: operation,
        requestResourceData: dataToSave,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error; // Re-throw original error for other catch blocks
  }
}

/**
 * Deletes a vehicle document.
 * @param db The Firestore instance.
 * @param vehicleId The ID of the vehicle to delete.
 */
export async function deleteVehicle(db: Firestore, vehicleId: string) {
  const vehicleRef = doc(db, 'vehicles', vehicleId);
  try {
    await deleteDoc(vehicleRef);
  } catch (error) {
    const permissionError = new FirestorePermissionError({
      path: vehicleRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  }
}

/**
 * Saves (creates or updates) a salesperson document.
 * @param db The Firestore instance.
 * @param salesperson The salesperson data to save.
 */
export async function saveSalesperson(
  db: Firestore,
  salesperson: Omit<Salesperson, 'id'> & { id?: string }
) {
  const { id, ...salespersonData } = salesperson;
  
  try {
    if (id) {
      const salespersonRef = doc(db, 'salespeople', id);
      await setDoc(salespersonRef, salespersonData, { merge: true });
    } else {
      const collectionRef = collection(db, 'salespeople');
      await addDoc(collectionRef, salespersonData);
    }
  } catch(error) {
      const path = id ? `salespeople/${id}` : 'salespeople';
      const operation = id ? 'update' : 'create';
      const permissionError = new FirestorePermissionError({
        path: path,
        operation: operation,
        requestResourceData: salespersonData,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
  }
}

/**
 * Deletes a salesperson document.
 * @param db The Firestore instance.
 * @param salespersonId The ID of the salesperson to delete.
 */
export async function deleteSalesperson(db: Firestore, salespersonId: string) {
  const salespersonRef = doc(db, 'salespeople', salespersonId);
  try {
    await deleteDoc(salespersonRef)
  } catch(error) {
    const permissionError = new FirestorePermissionError({
      path: salespersonRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  }
}
