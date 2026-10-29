import type { Recipe } from "../recipeTypes";
import { RecipeCard } from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return <p className="empty-state">Du har ingen oppskrifter ennå.</p>;
  }

  return (
    <section aria-label="Oppskrifter" className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}
