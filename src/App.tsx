import { RecipeList } from './features/recipes/components/RecipeList'
import type { Recipe } from './features/recipes/recipeTypes'

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
  return (
    <main>
      <h1>Strikkeapp</h1>
      <p>Din strikkeorganisator!!</p>

      <RecipeList recipes={recipes} />
    </main>
  )
}

export default App