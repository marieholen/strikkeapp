import { describe, expect, it } from "vitest";
import {
  parseNeedleSizes,
  validateRecipeForm,
  type RecipeFormData,
} from "../features/recipes/recipeValidation";

const validForm: RecipeFormData = {
  title: "Sunday Sweater",
  category: "Genser",
  needleSizes: "4, 4.5",
  difficulty: "Middels",
  used: false,
  notes: "",
};

describe("validateRecipeForm", () => {
  it("returns no errors for valid data", () => {
    expect(validateRecipeForm(validForm)).toEqual({});
  });

  it("requires a title", () => {
    const result = validateRecipeForm({
      ...validForm,
      title: "",
    });

    expect(result.title).toBe("Navn på oppskrift er påkrevd.");
  });

  it("requires a category", () => {
    const result = validateRecipeForm({
      ...validForm,
      category: "",
    });

    expect(result.category).toBe("Velg en type oppskrift.");
  });

  it("requires needle sizes", () => {
    const result = validateRecipeForm({
      ...validForm,
      needleSizes: "",
    });

    expect(result.needleSizes).toBe("Skriv inn minst én pinnestørrelse.");
  });
});

describe("parseNeedleSizes", () => {
  it.each([
    ["3.5, 4", [3.5, 4]],
    [" 2.25 , 4 , 10 ", [2.25, 4, 10]],
    ["4", [4]],
  ])("parses %s", (input, expected) => {
    expect(parseNeedleSizes(input)).toEqual(expected);
    expect(
      validateRecipeForm({ ...validForm, needleSizes: input }).needleSizes,
    ).toBeUndefined();
  });

  it.each([
    "",
    " ",
    "abc",
    "0",
    "-2",
    "4, abc",
    "4, 0",
    "4, -2",
    "4,",
    ",4",
    "3,,4",
    "Infinity",
    "NaN",
    "1e3",
    "0x10",
    "3.5 mm",
    "3.5; 4",
    "9".repeat(400),
  ])("rejects %s without dropping invalid entries", (input) => {
    expect(parseNeedleSizes(input)).toBeNull();
    expect(
      validateRecipeForm({ ...validForm, needleSizes: input }).needleSizes,
    ).toBeTruthy();
  });
});
