import { useState } from "react";

import { RecipeList } from "./features/recipes/components/RecipeList";

import { RecipeFilters } from "./features/recipes/components/RecipeFilters";

import { RecipeForm } from "./features/recipes/components/RecipeForm";

import { ProjectForm } from "./features/projects/components/ProjectForm";

import { ProjectList } from "./features/projects/components/ProjectList";

import type { Recipe } from "./features/recipes/recipeTypes";

import type { RecipeFilters as RecipeFiltersState } from "./features/recipes/recipeFilters";

import { filterRecipes } from "./features/recipes/recipeFilters";

import { getRecipes, addRecipe } from "./features/recipes/recipeService";

import { savePdf, getPdf } from "./features/recipes/pdfStorage";

import { getProjects, addProject } from "./features/projects/projectService";

import type { Project } from "./features/projects/projectTypes";

const initialFilters: RecipeFiltersState = {
  search: "",
  category: "Alle",
  needleSize: "Alle",
  difficulty: "Alle",
  used: "Alle",
};

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes);

  const [projects, setProjects] = useState<Project[]>(getProjects);

  const [filters, setFilters] = useState<RecipeFiltersState>(initialFilters);

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
      alert("Kunne ikke lagre PDF-filen.");
    }
  }

  async function handleOpenPdf(pdfId: string) {
    try {
      const blob = await getPdf(pdfId);
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60_000);
    } catch {
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

      <p>Din strikkeorganisator!!</p>

      <RecipeForm onCreate={handleCreateRecipe} />

      <RecipeFilters filters={filters} onChange={setFilters} />

      <RecipeList recipes={filteredRecipes} onOpenPdf={handleOpenPdf} />

      <ProjectForm recipes={recipes} onCreate={handleCreateProject} />

      <ProjectList projects={projects} recipes={recipes} />
    </main>
  );
}

export default App;
