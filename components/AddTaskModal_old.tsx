"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, ChangeEvent } from "react";
import { useRecipes } from "@/lib/useRecipes";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Plus } from "lucide-react";

export default function AddRecipeModal({ open, onOpenChange }:{open:boolean; onOpenChange:(b:boolean)=>void}) {
  const { add } = useRecipes();
  const [name,setName] = useState("");
  const [ingredients,setIngredients]=useState("");
  const [file,setFile]=useState<File|null>(null);

  const handleImage = (e:ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if(!name.trim()) return;
    let imageUrl="";
    if(file){
      const path = `recipeImages/${Date.now()}_${file.name}`;
      const snap = await uploadBytes(ref(storage,path), file);
      imageUrl = await getDownloadURL(snap.ref);
    }
    const ingArr = ingredients.split(",").map(i=>i.trim()).filter(Boolean);
    await add(name, ingArr, imageUrl);   // we’ll extend the hook next
    setName(""); setIngredients(""); setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Recipe</DialogTitle></DialogHeader>
        <Input placeholder="Recipe name" value={name} onChange={e=>setName(e.target.value)} className="mb-2"/>
        <Input placeholder="Ingredients (comma separated)" value={ingredients} onChange={e=>setIngredients(e.target.value)} className="mb-2"/>
        <label className="flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>{file? file.name : "Choose image"}</span>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden"/>
        </label>
        <Button className="mt-4 w-full" onClick={handleSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
