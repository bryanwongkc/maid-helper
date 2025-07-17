"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

import { useGroceryItems } from "@/lib/useGroceryItems";
import { useTasks } from "@/lib/useTasks";
import { useRecipes, Recipe } from "@/lib/useRecipes";
import { useLongPress } from "@/lib/useLongPress";

import AddTaskModal from "@/components/AddTaskModal";
import AddRecipeModal from "@/components/AddRecipeModal";

function TaskCard({ task, onLongPress }: { task: any; onLongPress: () => void }) {
  const longPress = useLongPress(() => {
    const confirmDelete = window.confirm("Delete this task?");
    if (confirmDelete) onLongPress();
  });

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
          <p className="text-base leading-relaxed whitespace-pre-wrap">{task.description}</p>
        </details>
      </CardContent>
    </Card>
  );
}

function RecipeCard({ recipe, onLongPress, addToGrocery }: {
  recipe: Recipe;
  onLongPress: () => void;
  addToGrocery: () => void;
}) {
  const longPress = useLongPress(() => {
    const confirmDelete = window.confirm("Delete this recipe?");
    if (confirmDelete) onLongPress();
  });

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
        <Button onClick={addToGrocery}>Add Ingredients to Grocery</Button>
      </CardContent>
    </Card>
  );
}

export default function MaidHelperApp() {
  const { tasks, add: addTask, remove: removeTask } = useTasks();
  const { recipes, add: addRecipe, remove: removeRecipe } = useRecipes();
  const { items: groceryItems, add, toggle, remove: removeItem, clearAll } = useGroceryItems();

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
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onLongPress={() => removeTask(task.id)} />
              ))}
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
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onLongPress={() => removeRecipe(recipe.id)}
                  addToGrocery={() => addIngredientsToGrocery(recipe)}
                />
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* GROCERY LIST */}
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
                <Button variant="destructive" onClick={clearAll} className="ml-auto">
                  Clear All
                </Button>
              )}
            </div>
            {groceryItems.length === 0 ? (
              <p className="text-gray-500">No items yet. Add from recipes or custom.</p>
            ) : (
              recipes
                .concat([{ id: "custom", name: "Custom Items", ingredients: [] }])
                .map((recipe) => {
                  const items = groceryItems.filter((i) => i.recipeId === recipe.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={recipe.id} className="mb-6">
                      <h3 className="font-medium mb-2 text-lg">{recipe.name}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => toggleCheck(item.id)}
                            />
                            <span
                              className={item.checked ? "line-through text-gray-400" : ""}
                            >
                              {item.name}
                            </span>
                            <button onClick={() => removeItem(item.id)}>
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
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
