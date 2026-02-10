'use client';

import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import type { Vehicle, Salesperson } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Saves (creates or updates) a vehicle document in Firestore.
 * @param firestore The Firestore instance.
 * @param vehicle The vehicle data to save.
 */
export function saveVehicle(firestore: Firestore, vehicle: Omit<Vehicle, 'id'> & { id?: string }) {
  const { id, ...data } = vehicle;
  const col = collection(firestore, 'vehicles');
  const ref = id ? doc(col, id) : doc(col);

  const operation = id ? 'update' : 'create';

  setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: ref.path,
        operation: operation,
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
      // Re-throw so the component knows the operation failed
      throw permissionError;
    });
}

/**
 * Deletes a vehicle document from Firestore.
 * @param firestore The Firestore instance.
 * @param vehicleId The ID of the vehicle to delete.
 */
export function deleteVehicle(firestore: Firestore, vehicleId: string) {
  const ref = doc(firestore, 'vehicles', vehicleId);
  deleteDoc(ref)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: ref.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError;
    });
}

/**
 * Saves (creates or updates) a salesperson document in Firestore.
 * @param firestore The Firestore instance.
 * @param salesperson The salesperson data to save.
 */
export function saveSalesperson(firestore: Firestore, salesperson: Omit<Salesperson, 'id'> & { id?: string }) {
    const { id, ...data } = salesperson;
    const col = collection(firestore, 'salespeople');
    const ref = id ? doc(col, id) : doc(col);

    const operation = id ? 'update' : 'create';

    setDoc(ref, data, { merge: true })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: operation,
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
      });
}

/**
 * Deletes a salesperson document from Firestore.
 * @param firestore The Firestore instance.
 * @param salespersonId The ID of the salesperson to delete.
 */
export function deleteSalesperson(firestore: Firestore, salespersonId: string) {
    const ref = doc(firestore, 'salespeople', salespersonId);
    deleteDoc(ref)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
      });
}
