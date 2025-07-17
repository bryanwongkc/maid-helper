"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/useTasks";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function AddTaskModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { add } = useTasks();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setUploading(true);
    let imageUrl = "";

    if (image) {
      const fileRef = ref(storage, `task-images/${Date.now()}_${image.name}`);
      await uploadBytes(fileRef, image);
      imageUrl = await getDownloadURL(fileRef);
    }

    await add(name, description, imageUrl);
    setName("");
    setDescription("");
    setImage(null);
    onOpenChange(false);
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Adding..." : "Add Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
