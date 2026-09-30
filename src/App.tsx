import { RecipeList } from './features/recipes/components/RecipeList'
import type { Recipe } from './features/recipes/recipeTypes'
import { useState } from 'react'
import { RecipeFilters } from './features/recipes/components/RecipeFilters'
import { filterRecipes } from './features/recipes/recipeFilters'

const initialFilters = {
  search: '',
  category: 'Alle' as const,
  needleSize: 'Alle' as const,
  difficulty: 'Alle' as const,
  used: 'Alle' as const,
}

const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Sunday Sweater',
    category: 'Genser',
    needleSizes: [4, 4.5],
    difficulty: 'Middels',
    used: false,
    notes: 'En enkel genser til høsten.',
    createdAt: '2026-09-30',
  },
  {
    id: '2',
    title: 'Basic Socks',
    category: 'Sokker',
    needleSizes: [2.5],
    difficulty: 'Enkel',
    used: true,
    notes: 'God oppskrift for sokker.',
    createdAt: '2026-09-30',
  },
]

function App() {
  const [filters, setFilters] = useState<Parameters<typeof filterRecipes>[1]>(initialFilters)
  
  const filteredRecipes = filterRecipes(recipes, filters)
  return (
    <main>
      <h1>Strikkeapp</h1>
      <p>Din strikkeorganisator!!</p>

      <RecipeFilters
        filters={filters}
        onChange={setFilters}
      />

      <RecipeList recipes={filteredRecipes} />
    </main>
  )
}

export default App