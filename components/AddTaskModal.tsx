"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/useTasks";

export default function AddTaskModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const { add } = useTasks();

  const handleAdd = async () => {
    if (name.trim()) {
      await add(name.trim(), desc.trim());
      setName("");
      setDesc("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Task description (you can use multiple lines)"
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Button onClick={handleAdd} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
