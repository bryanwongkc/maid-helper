"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTasks } from "@/lib/useTasks";

export default function AddTaskModal({ open, onOpenChange }: { open: boolean; onOpenChange: (b:boolean)=>void }) {
  const { add } = useTasks();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await add(name, desc);
    setName(""); setDesc("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
        <Input placeholder="Task name" value={name} onChange={e=>setName(e.target.value)} className="mb-2"/>
        <Input placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <Button className="mt-4 w-full" onClick={handleSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
