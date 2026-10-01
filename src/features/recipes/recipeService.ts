import type { Recipe } from "./recipeTypes";

const STORAGE_KEY = "strikkeoppskrift-recipes";

export function getRecipes(): Recipe[] {
  const storedRecipes = localStorage.getItem(STORAGE_KEY);

  if (!storedRecipes) {
    return [];
  }

  return JSON.parse(storedRecipes) as Recipe[];
}

export function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function addRecipe(recipe: Recipe): void {
  const recipes = getRecipes();

  saveRecipes([...recipes, recipe]);
}
