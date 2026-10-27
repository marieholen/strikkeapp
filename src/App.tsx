import { useEffect, useState } from "react";

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

function getCurrentPage() {
  const hash = window.location.hash;

  if (hash === "" || hash === "#/" || hash === "#/recipes") {
    return "recipes";
  }

  if (hash === "#/projects") {
    return "projects";
  }

  return "not-found";
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes);
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [filters, setFilters] = useState<RecipeFiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getCurrentPage());
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const filteredRecipes = filterRecipes(recipes, filters);

  async function handleCreateRecipe(recipe: Recipe, pdfFile?: File) {
    try {
      let recipeToSave = recipe;

      if (pdfFile) {
        const pdfId = await savePdf(pdfFile);

        recipeToSave = {
          ...recipe,
          pdfId,
        };
      }

      addRecipe(recipeToSave);
      setRecipes(getRecipes());
    } catch {
      alert("Kunne ikke lagre oppskriften.");
    }
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
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60_000);
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
    <main>
      <h1>Strikkeapp</h1>

      <p>Din strikkeorganisator</p>

      <nav aria-label="Hovedmeny" className="main-nav">
        <a
          href="#/recipes"
          aria-current={currentPage === "recipes" ? "page" : undefined}
        >
          Oppskrifter
        </a>

        <a
          href="#/projects"
          aria-current={currentPage === "projects" ? "page" : undefined}
        >
          Prosjekter
        </a>
      </nav>

      {currentPage === "recipes" && (
        <>
          <p>
            Her kan du samle oppskriftene dine. En oppskrift kan brukes i flere
            prosjekter.
          </p>

          <RecipeForm onCreate={handleCreateRecipe} />

          <RecipeFilters filters={filters} onChange={setFilters} />

          <RecipeList recipes={filteredRecipes} onOpenPdf={handleOpenPdf} />
        </>
      )}

      {currentPage === "projects" && (
        <>
          <p>
            Et prosjekt er noe du strikker med utgangspunkt i en lagret
            oppskrift.
          </p>

          <ProjectForm recipes={recipes} onCreate={handleCreateProject} />

          <ProjectList projects={projects} recipes={recipes} />
        </>
      )}

      {currentPage === "not-found" && (
        <section>
          <h2>Siden finnes ikke</h2>
          <p>Bruk menyen for å gå til oppskrifter eller prosjekter.</p>
        </section>
      )}
    </main>
  );
}

export default App;