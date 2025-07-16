"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useGroceryItems } from "@/lib/useGroceryItems";
import { useTasks } from "@/lib/useTasks";
import { useRecipes, Recipe } from "@/lib/useRecipes";
import AddTaskModal from "@/components/AddTaskModal";
import AddRecipeModal from "@/components/AddRecipeModal";
import { useLongPress } from "@/lib/useLongPress";

export default function MaidHelperApp() {
  const { tasks, add: addTask, remove: removeTask } = useTasks();
  const { recipes, add: addRecipe, remove: removeRecipe } = useRecipes();
  const {
    items: groceryItems,
    add,
    toggle,
    clearAll
  } = useGroceryItems();

  const [taskOpen, setTaskOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);

  const addIngredientsToGrocery = (recipe: Recipe) => {
    const existing = new Set(groceryItems.map((i) => i.name.toLowerCase()));
    recipe.ingredients.forEach((ing) => {
      if (!existing.has(ing.toLowerCase())) {
        add({ name: ing, checked: false, recipeId: recipe.id });
      }
    });
  };

  const toggleCheck = (id: string) => {
    const item = groceryItems.find((i) => i.id === id);
    if (item) toggle(id, !item.checked);
  };

  const addCustomItem = (name: string) => {
    if (name.trim()) {
      add({ name: name.trim(), checked: false, recipeId: "custom" });
    }
  };

  const handleLongPressTask = (id: string) => {
    if (confirm("Delete this task?")) {
      removeTask(id);
    }
  };

  const handleLongPressRecipe = (id: string) => {
    if (confirm("Delete this recipe?")) {
      removeRecipe(id);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="grocery">Grocery List</TabsTrigger>
        </TabsList>

        {/* TASKS */}
        <TabsContent value="tasks" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Task List</h2>
              <Button size="sm" onClick={() => setTaskOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>
            <AddTaskModal open={taskOpen} onOpenChange={setTaskOpen} />

            <div className="space-y-4">
              {tasks.map((task) => {
                const longPress = useLongPress(() => handleLongPressTask(task.id));
                return (
                  <Card key={task.id} {...longPress} className="cursor-pointer">
                    <CardHeader>
                      <CardTitle>{task.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <details>
                        <summary className="cursor-pointer select-none mb-2 text-sm text-gray-500">
                          View details
                        </summary>
                        <p className="text-base leading-relaxed">
                          {task.description}
                        </p>
                      </details>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>

        {/* RECIPES */}
        <TabsContent value="recipes" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Recipes</h2>
              <Button size="sm" onClick={() => setRecipeOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Recipe
              </Button>
            </div>
            <AddRecipeModal open={recipeOpen} onOpenChange={setRecipeOpen} />

            <div className="space-y-4">
              {recipes.map((recipe) => {
                const longPress = useLongPress(() => handleLongPressRecipe(recipe.id));
                return (
                  <Card key={recipe.id} {...longPress}>
                    <CardHeader>
                      <CardTitle>{recipe.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {recipe.imageUrl && (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full max-h-40 object-cover rounded-lg mb-2"
                        />
                      )}

                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {recipe.ingredients.map((ing) => (
                          <li key={ing}>{ing}</li>
                        ))}
                      </ul>

                      <Button onClick={() => addIngredientsToGrocery(recipe)}>
                        Add Ingredients to Grocery
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>

        {/* GROCERY */}
        <TabsContent value="grocery" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Grocery Shopping List</h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add custom item..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCustomItem((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>(
                    "input[placeholder='Add custom item...']"
                  );
                  if (input) {
                    addCustomItem(input.value);
                    input.value = "";
                  }
                }}
              >
                Add
              </Button>
              {groceryItems.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={clearAll}
                  className="ml-auto"
                >
                  Clear All
                </Button>
              )}
            </div>

            {groceryItems.length === 0 ? (
              <p className="text-gray-500">
                No items yet. Add from recipes or custom.
              </p>
            ) : (
              recipes
                .concat([{ id: "custom", name: "Custom Items", ingredients: [] }])
                .map((recipe) => {
                  const items = groceryItems.filter(
                    (i) => i.recipeId === recipe.id
                  );
                  if (items.length === 0) return null;
                  return (
                    <div key={recipe.id} className="mb-6">
                      <h3 className="font-medium mb-2 text-lg">{recipe.name}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => toggleCheck(item.id)}
                            />
                            <span
                              className={
                                item.checked
                                  ? "line-through text-gray-400"
                                  : ""
                              }
                            >
                              {item.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
