'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(q?: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();
  const queryRef = useRef(q);

  useEffect(() => {
    // Prevent re-running the effect if the query object itself changes
    // but its path and constraints are the same. A better solution
    // is to memoize the query creator in the component.
    if (q?.path === queryRef.current?.path && q?._query?.isEqual(queryRef.current._query)) {
      return;
    }
    queryRef.current = q;
  }, [q]);


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
        const permissionError = new FirestorePermissionError({
          path: (q as any).path, // Internal property, but useful
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, queryRef.current]);

  return { data, loading, error };
}
