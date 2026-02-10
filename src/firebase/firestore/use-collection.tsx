'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(q?: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !q) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useCollection error:", err);
        // Path is not public on a query, this is a best-effort for debugging
        const path = (q as any)._query?.path?.toString() ?? 'unknown path';
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, q]);

  return { data, loading, error };
}
