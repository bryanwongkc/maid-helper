"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Modal } from "./ui/modal"; // Make sure this exists or create it
import { useRecipes } from "@/lib/useRecipes";
import { uploadImage } from "@/lib/uploadImage"; // Make sure this utility exists

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
    let imageUrl = "";
    if (file) imageUrl = await uploadImage(file);

    const ingArr = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    await add(name, ingArr, imageUrl);
    setName("");
    setIngredients("");
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add Recipe">
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Ingredients (comma-separated)</Label>
          <Input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div>
          <Label>Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </Modal>
  );
}
