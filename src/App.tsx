import { useEffect, useState } from "react";

import { RecipeDetail } from "./features/recipes/components/RecipeDetail";
import { RecipeList } from "./features/recipes/components/RecipeList";
import { RecipeFilters } from "./features/recipes/components/RecipeFilters";
import { RecipeForm } from "./features/recipes/components/RecipeForm";
import { ProjectForm } from "./features/projects/components/ProjectForm";
import { ProjectList } from "./features/projects/components/ProjectList";
import type { Recipe } from "./features/recipes/recipeTypes";
import type { RecipeFilters as RecipeFiltersState } from "./features/recipes/recipeFilters";
import type { Project } from "./features/projects/projectTypes";
import { filterRecipes } from "./features/recipes/recipeFilters";
import { getRecipes, addRecipe } from "./features/recipes/recipeService";
import { savePdf, getPdf } from "./features/recipes/pdfStorage";
import { getProjects, addProject } from "./features/projects/projectService";

const initialFilters: RecipeFiltersState = {
  search: "",
  category: "Alle",
  needleSize: "Alle",
  difficulty: "Alle",
  used: "Alle",
};

type Page =
  | { name: "recipes" | "projects" | "not-found" }
  | { name: "recipe-detail"; recipeId: string };

function getCurrentPage(): Page {
  const hash = window.location.hash;
  if (hash === "" || hash === "#/" || hash === "#/recipes")
    return { name: "recipes" };
  if (hash === "#/projects") return { name: "projects" };
  const match = /^#\/recipes\/([^/]+)$/.exec(hash);
  if (match) {
    try {
      return { name: "recipe-detail", recipeId: decodeURIComponent(match[1]) };
    } catch {
      return { name: "not-found" };
    }
  }
  return { name: "not-found" };
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes);
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [filters, setFilters] = useState<RecipeFiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(getCurrentPage);
  const [recipeFormOpen, setRecipeFormOpen] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getCurrentPage());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredRecipes = filterRecipes(recipes, filters);

  async function handleCreateRecipe(
    recipe: Recipe,
    pdfFile?: File,
  ): Promise<void> {
    let recipeToSave = recipe;

    if (pdfFile) {
      const pdfId = await savePdf(pdfFile);
      recipeToSave = { ...recipe, pdfId };
    }

    addRecipe(recipeToSave);
    setRecipes((currentRecipes) => [...currentRecipes, recipeToSave]);
  }

  async function handleOpenPdf(pdfId: string) {
    const pdfWindow = window.open("", "_blank");
    if (!pdfWindow) {
      alert("Kunne ikke åpne PDF-filen. Tillat popup-vinduer og prøv igjen.");
      return;
    }
    pdfWindow.opener = null;
    let url: string | undefined;
    try {
      const blob = await getPdf(pdfId);
      url = URL.createObjectURL(blob);
      pdfWindow.location.href = url;
      const pdfUrl = url;
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    } catch {
      if (url) URL.revokeObjectURL(url);
      pdfWindow.close();
      alert("Kunne ikke åpne PDF-filen.");
    }
  }

  function handleCreateProject(project: Project) {
    addProject(project);
    setProjects(getProjects());
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>Strikkeapp</span>
        </div>
        <nav aria-label="Hovedmeny" className="main-nav">
          <a
            href="#/recipes"
            aria-current={
              currentPage.name === "recipes" ||
              currentPage.name === "recipe-detail"
                ? "page"
                : undefined
            }
          >
            Oppskrifter
          </a>
          <a
            href="#/projects"
            aria-current={currentPage.name === "projects" ? "page" : undefined}
          >
            Prosjekter
          </a>
        </nav>
      </aside>

      <main>
        <section hidden={currentPage.name !== "recipes"}>
          <header className="page-header">
            <div>
              <h1>Oppskriftsbibliotek</h1>
              <p className="page-description">
                {recipes.length} oppskrifter i biblioteket
              </p>
            </div>
            <button
              type="button"
              aria-expanded={recipeFormOpen}
              aria-controls="recipe-form-panel"
              onClick={() => setRecipeFormOpen(!recipeFormOpen)}
            >
              {recipeFormOpen ? "Lukk oppskriftsskjema" : "Legg til oppskrift"}
            </button>
          </header>
          <div id="recipe-form-panel" hidden={!recipeFormOpen}>
            <RecipeForm onCreate={handleCreateRecipe} />
          </div>
          <div className="library-layout">
            <RecipeFilters filters={filters} onChange={setFilters} />
            <div className="library-results">
              <p className="result-count">{filteredRecipes.length} treff</p>
              <RecipeList
                recipes={filteredRecipes}
                totalRecipes={recipes.length}
              />
            </div>
          </div>
        </section>

        <section hidden={currentPage.name !== "projects"}>
          <header className="page-header">
            <div>
              <h1>Prosjekter</h1>
              <p className="page-description">{projects.length} prosjekter</p>
            </div>
            <button
              type="button"
              aria-expanded={projectFormOpen}
              aria-controls="project-form-panel"
              onClick={() => setProjectFormOpen(!projectFormOpen)}
            >
              {projectFormOpen ? "Lukk prosjektskjema" : "Nytt prosjekt"}
            </button>
          </header>
          <div id="project-form-panel" hidden={!projectFormOpen}>
            <ProjectForm recipes={recipes} onCreate={handleCreateProject} />
          </div>
          <p className="page-description">
            Et prosjekt er noe du strikker med utgangspunkt i en lagret
            oppskrift.
          </p>
          <ProjectList projects={projects} recipes={recipes} />
        </section>

        {currentPage.name === "recipe-detail" && (
          <RecipeDetail
            recipe={recipes.find(
              (recipe) => recipe.id === currentPage.recipeId,
            )}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentPage.name === "not-found" && (
          <section className="empty-state">
            <h1>Siden finnes ikke</h1>
            <p>Bruk menyen for å gå til oppskrifter eller prosjekter.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
