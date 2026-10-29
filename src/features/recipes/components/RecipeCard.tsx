import type { Recipe } from "../recipeTypes";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-cover" aria-hidden="true">
        <span>{recipe.category}</span>
      </div>

      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>

        <p className="card-meta">
          {recipe.category} · {recipe.needleSizes.join(", ")} mm
        </p>

        <a
          className="recipe-open-link"
          href={`#/recipes/${encodeURIComponent(recipe.id)}`}
        >
          Åpne
        </a>
      </div>
    </article>
  );
}
