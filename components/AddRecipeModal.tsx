"use client";

import React, { useState } from "react";
import { Modal } from "./ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/uploadImage";
import { useRecipes } from "@/lib/useRecipes";

interface AddRecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddRecipeModal({ open, onOpenChange }: AddRecipeModalProps) {
  const { add } = useRecipes();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const ingArr = ingredients.split(",").map(i => i.trim()).filter(Boolean);
    let imageUrl = "";
    if (file) imageUrl = await uploadImage(file);
    await add({ name, ingredients: ingArr, imageUrl });
    setName(""); setIngredients(""); setFile(null);
    onOpenChange(false);
  };

  return (
    <Modal title="Add Recipe" open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Input
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleSubmit} className="w-full">
          Add Recipe
        </Button>
      </div>
    </Modal>
  );
}
