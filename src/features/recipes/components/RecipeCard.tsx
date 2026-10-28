import type { Recipe } from "../recipeTypes";

interface RecipeCardProps {
  recipe: Recipe;
  onOpenPdf: (pdfId: string) => void;
}

export function RecipeCard({ recipe, onOpenPdf }: RecipeCardProps) {
  const { pdfId } = recipe;

  return (
    <article className="recipe-card">
      <div className="recipe-cover" aria-hidden="true">
        {pdfId && <span className="pdf-badge">PDF</span>}
        <span>{recipe.category}</span>
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <p className="card-meta">
          {recipe.category} · {recipe.needleSizes.join(", ")} mm
        </p>
        <p className="card-meta">{recipe.difficulty}</p>
        <p className="card-meta">
          {recipe.used ? "Strikket før" : "Ikke brukt ennå"}
        </p>
        {recipe.notes && (
          <details className="card-notes">
            <summary>Notater</summary>
            <p>{recipe.notes}</p>
          </details>
        )}
        {pdfId && (
          <button
            className="secondary-button"
            type="button"
            onClick={() => onOpenPdf(pdfId)}
          >
            Åpne PDF
          </button>
        )}
      </div>
    </article>
  );
}
