import type { Recipe } from "../recipeTypes";

import { RecipeCard } from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
  onOpenPdf: (pdfId: string) => void;
}

export function RecipeList({ recipes, onOpenPdf }: RecipeListProps) {
  if (recipes.length === 0) {
    return <p>Du har ingen oppskrifter ennå.</p>;
  }

  return (
    <section aria-label="Oppskrifter">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onOpenPdf={onOpenPdf} />
      ))}
    </section>
  );
}
