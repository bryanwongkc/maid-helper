"use client";
import { useEffect, useState, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface Task {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) =>
      setTasks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) })))
    );
    return unsub;
  }, []);

  const add = useCallback(async (data: Omit<Task, "id">) => {
    await addDoc(collection(db, "tasks"), { ...data, createdAt: serverTimestamp() });
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  }, []);

  const edit = useCallback(async (id: string, data: Partial<Task>) => {
    await updateDoc(doc(db, "tasks", id), data);
  }, []);

  return { tasks, add, remove, edit };
}
