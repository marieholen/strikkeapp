import { describe, expect, it } from "vitest";
import { filterRecipes, type RecipeFilters } from "./recipeFilters";
import type { Recipe } from "./recipeTypes";

const recipes: Recipe[] = [
  {
    id: "1",
    title: "Sunday Sweater",
    category: "Genser",
    needleSizes: [4],
    difficulty: "Middels",
    used: false,
    notes: "",
    createdAt: "2026-09-30",
  },
  {
    id: "2",
    title: "Basic Socks",
    category: "Sokker",
    needleSizes: [2.5],
    difficulty: "Enkel",
    used: true,
    notes: "",
    createdAt: "2026-09-30",
  },
];

const allFilters: RecipeFilters = {
  search: "",
  category: "Alle",
  needleSize: "Alle",
  difficulty: "Alle",
  used: "Alle",
};

describe("filterRecipes", () => {
  it("returns all recipes when no filters are active", () => {
    expect(filterRecipes(recipes, allFilters)).toHaveLength(2);
  });

  it("filters by title", () => {
    const result = filterRecipes(recipes, {
      ...allFilters,
      search: "sweater",
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Sunday Sweater");
  });

  it("filters by category", () => {
    const result = filterRecipes(recipes, {
      ...allFilters,
      category: "Sokker",
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Basic Socks");
  });

  it("combines multiple filters", () => {
    const result = filterRecipes(recipes, {
      ...allFilters,
      category: "Genser",
      difficulty: "Middels",
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Sunday Sweater");
  });
});
