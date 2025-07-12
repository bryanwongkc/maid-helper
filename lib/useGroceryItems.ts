"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";      // <- the config you set up

export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  recipeId: string;  // "custom" or a recipe ID
}

/** Realtime hook — subscribes once and syncs forever */
export function useGroceryItems() {
  const [items, setItems] = useState<GroceryItem[]>([]);

  // --- 1. Realtime listener ---
  useEffect(() => {
    const q = query(collection(db, "groceryItems"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GroceryItem, "id">) }))
      );
    });
    return () => unsub();
  }, []);

  // --- 2. CRUD helpers ---
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
    // delete in parallel
    await Promise.all(
      items.map((it) => deleteDoc(doc(db, "groceryItems", it.id)))
    );
  }, [items]);

  return { items, add, toggle, clearAll };
}
