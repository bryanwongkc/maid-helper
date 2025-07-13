"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useGroceryItems } from "@/lib/useGroceryItems";
import { useTasks } from "@/lib/useTasks";
import { useRecipes } from "@/lib/useRecipes";





// ---------- Types ----------
interface Task {
  id: string;
  name: string;
  description: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
}

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  recipeId: string; // "custom" or recipe.id
}



// ---------- Main App ----------
export default function MaidHelperApp() {
  
const { tasks, add: addTask } = useTasks();
const { recipes, add: addRecipe } = useRecipes();


const { items: groceryItems, add, toggle, clearAll } = useGroceryItems();

  // ---------- Handlers ----------
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

const clearAllGroceries = () => clearAll();

const addCustomItem = (name: string) => {
  if (name.trim()) {
    add({ name: name.trim(), checked: false, recipeId: "custom" });
  }
};

  // ---------- Render ----------
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="grocery">Grocery List</TabsTrigger>
        </TabsList>

        {/* ----------------- Tasks Tab ----------------- */}
        <TabsContent value="tasks" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Task List</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="cursor-pointer">
                  <CardHeader>
                    <CardTitle>{task.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <details>
                      <summary className="cursor-pointer select-none mb-2 text-sm text-gray-500">
                        View details
                      </summary>
                      <p className="text-base leading-relaxed">{task.description}</p>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ----------------- Recipes Tab ----------------- */}
        <TabsContent value="recipes" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Recipes</h2>
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <Card key={recipe.id}>
                  <CardHeader>
                    <CardTitle>{recipe.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ----------------- Grocery List Tab ----------------- */}
        <TabsContent value="grocery" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Grocery Shopping List</h2>
            {/* Custom Item Entry */}
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
                  const input = document.querySelector<HTMLInputElement>("input[placeholder='Add custom item...']")!;
                  addCustomItem(input.value);
                  input.value = "";
                }}
              >
                Add
              </Button>
              {groceryItems.length > 0 && (
                <Button variant="destructive" onClick={clearAllGroceries} className="ml-auto">
                  Clear All
                </Button>
              )}
            </div>

            {/* Grouped Grocery Items */}
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
                          <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox checked={item.checked} onCheckedChange={() => toggleCheck(item.id)} />
                            <span className={item.checked ? "line-through text-gray-400" : ""}>{item.name}</span>
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
