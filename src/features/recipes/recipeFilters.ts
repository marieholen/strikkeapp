import type {
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
} from './recipeTypes'

export interface RecipeFilters {
  search: string
  category: RecipeCategory | 'Alle'
  needleSize: number | 'Alle'
  difficulty: RecipeDifficulty | 'Alle'
  used: 'Alle' | 'Brukt' | 'Ikke brukt'
}

export function filterRecipes(
  recipes: Recipe[],
  filters: RecipeFilters,
): Recipe[] {
  return recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(filters.search.toLowerCase())

    const matchesCategory =
      filters.category === 'Alle' ||
      recipe.category === filters.category

    const matchesNeedleSize =
      filters.needleSize === 'Alle' ||
      recipe.needleSizes.includes(filters.needleSize)

    const matchesDifficulty =
      filters.difficulty === 'Alle' ||
      recipe.difficulty === filters.difficulty

    const matchesUsed =
      filters.used === 'Alle' ||
      (filters.used === 'Brukt' && recipe.used) ||
      (filters.used === 'Ikke brukt' && !recipe.used)

    return (
      matchesSearch &&
      matchesCategory &&
      matchesNeedleSize &&
      matchesDifficulty &&
      matchesUsed
    )
  })
}