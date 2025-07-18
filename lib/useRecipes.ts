"use client";
import { useEffect, useState, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  imageUrl?: string;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const q = query(collection(db, "recipes"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) =>
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Recipe, "id">) })))
    );
    return unsub;
  }, []);

  const add = useCallback(async (data: Omit<Recipe, "id">) => {
    await addDoc(collection(db, "recipes"), { ...data, createdAt: serverTimestamp() });
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "recipes", id));
  }, []);

  const edit = useCallback(async (id: string, data: Partial<Recipe>) => {
    await updateDoc(doc(db, "recipes", id), data);
  }, []);

  return { recipes, add, remove, edit };
}
