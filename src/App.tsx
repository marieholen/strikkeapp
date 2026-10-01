import { useState } from 'react'

import { RecipeList } from './features/recipes/components/RecipeList'
import { RecipeFilters } from './features/recipes/components/RecipeFilters'
import { RecipeForm } from './features/recipes/components/RecipeForm'

import type { Recipe } from './features/recipes/recipeTypes'
import type { RecipeFilters as RecipeFiltersState } from './features/recipes/recipeFilters'

import { filterRecipes } from './features/recipes/recipeFilters'
import { getRecipes, addRecipe } from './features/recipes/recipeService'

const initialFilters: RecipeFiltersState = {
  search: '',
  category: 'Alle',
  needleSize: 'Alle',
  difficulty: 'Alle',
  used: 'Alle',
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes)
  const [filters, setFilters] = useState<RecipeFiltersState>(initialFilters)

  const filteredRecipes = filterRecipes(recipes, filters)

  function handleCreateRecipe(recipe: Recipe) {
    addRecipe(recipe)
    setRecipes(getRecipes())
  }

  return (
    <main>
      <h1>Strikkeapp</h1>
      <p>Din strikkeorganisator!!</p>

      <RecipeForm onCreate={handleCreateRecipe} />

      <RecipeFilters
        filters={filters}
        onChange={setFilters}
      />

      <RecipeList recipes={filteredRecipes} />
    </main>
  )
}

export default App