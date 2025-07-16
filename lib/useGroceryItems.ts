// lib/useGroceryItems.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp
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
    const q = query(collection(db, "groceryItems"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) =>
      setItems(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<GroceryItem, "id">),
        }))
      )
    );
    return unsub;
  }, []);

  const add = useCallback(async (item: Omit<GroceryItem, "id">) => {
    await addDoc(collection(db, "groceryItems"), {
      ...item,
      createdAt: serverTimestamp(),
    });
  }, []);

  const toggle = useCallback(async (id: string, checked: boolean) => {
    await updateDoc(doc(db, "groceryItems", id), { checked });
  }, []);

  const clearAll = useCallback(async () => {
    const q = query(collection(db, "groceryItems"));
    const snapshot = await onSnapshot(q, () => {});
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "groceryItems", docSnap.id));
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "groceryItems", id));
  }, []);

  return { items, add, toggle, remove, clearAll };
}
