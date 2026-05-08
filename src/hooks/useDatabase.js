import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

/**
 * Custom hook for managing a user-owned Firestore collection with real-time updates.
 * Automatically handles authentication state and data synchronization.
 *
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} orderField - Field to sort by (defaults to 'createdAt').
 * @param {string} orderDir - Direction of sorting ('asc' or 'desc').
 * @returns {Object} { data, loading, error, addData, updateData, deleteData }
 */
export const useCollection = (collectionName, orderField = null, orderDir = 'desc') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Dynamic query construction
    const constraints = [where('userId', '==', user.uid)];

    // Removed mandatory 'position' sort to prevent query failures in simplified grid view

    if (orderField) {
      constraints.push(orderBy(orderField, orderDir));
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setData(list);
        setLoading(false);
      },
      (err) => {
        console.error(`Firebase error [${collectionName}]:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, user, orderField, orderDir]);

  const addData = useCallback(
    async (payload) => {
      if (!user) return null;
      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...payload,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
        return docRef.id;
      } catch (err) {
        console.error(`Error adding to ${collectionName}:`, err);
        setError(err.message);
        return null;
      }
    },
    [collectionName, user]
  );

  const updateData = useCallback(
    async (id, payload) => {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, { ...payload, updatedAt: new Date().toISOString() });
      } catch (err) {
        console.error(`Error updating ${collectionName}:`, err);
        setError(err.message);
      }
    },
    [collectionName]
  );

  const deleteData = useCallback(
    async (id) => {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        console.error(`Error deleting from ${collectionName}:`, err);
        setError(err.message);
      }
    },
    [collectionName]
  );

  return { data, loading, error, addData, updateData, deleteData };
};

/**
 * Custom hook for managing a single user-specific singleton document (e.g. Profile).
 *
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {Object} defaultData - Default data to return if document does not exist.
 * @returns {Object} { data, loading, updateDoc }
 */
export const useUserDoc = (collectionName, defaultData = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setData(snap.data());
        } else {
          setData(defaultData);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`useUserDoc error [${collectionName}]:`, err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, user, defaultData]);

  const updateDoc_ = useCallback(
    async (payload) => {
      if (!user) return { success: false, error: 'No user authenticated' };
      const docRef = doc(db, collectionName, user.uid);
      try {
        await setDoc(
          docRef,
          { ...payload, userId: user.uid, updatedAt: new Date().toISOString() },
          { merge: true }
        );
        return { success: true };
      } catch (err) {
        console.error(`Error updating user doc [${collectionName}]:`, err);
        return { success: false, error: err.message };
      }
    },
    [collectionName, user]
  );

  return { data, loading, updateDoc: updateDoc_ };
};
