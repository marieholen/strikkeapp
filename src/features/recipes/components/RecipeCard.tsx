import type { Recipe } from "../recipeTypes";

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article>
      <h2>{recipe.title}</h2>

      <p>Kategori: {recipe.category}</p>
      <p>Vanskelighetsgrad: {recipe.difficulty}</p>
      <p>Pinestørrelser: {recipe.needleSizes.join(', ')}</p>
      <p>{recipe.used ? 'Brukt' : 'Ikke brukt'}</p>

      {recipe.notes && <p>{recipe.notes}</p>}
    </article>
  )
}