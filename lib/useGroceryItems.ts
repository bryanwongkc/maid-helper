"use client";
import { useEffect, useState, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  recipeId: string;
}

export function useGroceryItems() {
  const [items, setItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, "grocery"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GroceryItem, "id">) })))
    );
    return unsub;
  }, []);

  const add = useCallback(async (data: Omit<GroceryItem, "id">) => {
    await addDoc(collection(db, "grocery"), { ...data, createdAt: serverTimestamp() });
  }, []);

  const toggle = useCallback(async (id: string, checked: boolean) => {
    await updateDoc(doc(db, "grocery", id), { checked });
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "grocery", id));
  }, []);

  const clearAll = useCallback(async () => {
    const q = query(collection(db, "grocery"));
    const snap = await onSnapshot(q, () => {}); // Listen and close immediately
    snap.docs.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "grocery", docSnap.id));
    });
  }, []);

  return { items, add, toggle, remove, clearAll };
}
