import type { Recipe } from "../recipeTypes";

interface RecipeCardProps {
  recipe: Recipe;
  onOpenPdf: (pdfId: string) => void;
}

export function RecipeCard({ recipe, onOpenPdf }: RecipeCardProps) {
  const { pdfId } = recipe;
  return (
    <article>
      <h3>{recipe.title}</h3>

      <p>Kategori: {recipe.category}</p>

      <p>Pinnestørrelse: {recipe.needleSizes.join(", ")}</p>

      <p>Vanskelighetsgrad: {recipe.difficulty}</p>

      <p>{recipe.used ? "Du har brukt oppskriften" : "Ikke brukt ennå"}</p>

      {recipe.notes && <p>Notater: {recipe.notes}</p>}

      {pdfId && (
        <button type="button" onClick={() => onOpenPdf(pdfId)}>
          Åpne PDF
        </button>
      )}
    </article>
  );
}
