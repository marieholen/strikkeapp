import type { Recipe } from "../recipeTypes";

interface RecipeDetailProps {
  recipe?: Recipe;
  onOpenPdf: (pdfId: string) => void;
}

export function RecipeDetail({ recipe, onOpenPdf }: RecipeDetailProps) {
  const pdfId = recipe?.pdfId;
  if (!recipe) {
    return (
      <section className="empty-state">
        <h1>Oppskriften finnes ikke</h1>
        <p>Oppskriften kan være slettet eller lagret i en annen nettleser.</p>
        <a className="recipe-back-link" href="#/recipes">
          Tilbake
        </a>
      </section>
    );
  }

  return (
    <section className="recipe-detail">
      <a className="recipe-back-link" href="#/recipes">
        Tilbake
      </a>
      <header className="page-header">
        <h1>{recipe.title}</h1>
      </header>
      <dl className="recipe-facts">
        <div>
          <dt>Type oppskrift</dt>
          <dd>{recipe.category}</dd>
        </div>
        <div>
          <dt>Pinnestørrelser</dt>
          <dd>{recipe.needleSizes.join(", ")} mm</dd>
        </div>
        <div>
          <dt>Vanskelighetsgrad</dt>
          <dd>{recipe.difficulty}</dd>
        </div>
        <div>
          <dt>Bruk</dt>
          <dd>{recipe.used ? "Strikket før" : "Ikke brukt ennå"}</dd>
        </div>
      </dl>
      <section aria-labelledby="recipe-instructions-heading">
        <h2 id="recipe-instructions-heading">Notater og fremgangsmåte</h2>
        {recipe.notes ? (
          <p className="recipe-instructions">{recipe.notes}</p>
        ) : (
          <p>Ingen notater eller fremgangsmåte er lagt til.</p>
        )}
      </section>
      {pdfId ? (
        <button type="button" onClick={() => onOpenPdf(pdfId)}>
          Åpne PDF
        </button>
      ) : (
        <p>Ingen PDF er lagt til.</p>
      )}
    </section>
  );
}
