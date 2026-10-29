import type { Recipe } from "../recipeTypes";
import { RecipeCard } from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
  totalRecipes: number;
}

export function RecipeList({ recipes, totalRecipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <p className="empty-state" role="status">
        {totalRecipes === 0
          ? "Du har ingen oppskrifter ennå."
          : "Ingen oppskrifter passer søket eller filtrene."}
      </p>
    );
  }

  return (
    <section aria-label="Oppskrifter" className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}
