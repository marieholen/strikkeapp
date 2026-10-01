import { describe, expect, it } from 'vitest'
import {
  validateRecipeForm,
  type RecipeFormData,
} from './recipeValidation'

const validForm: RecipeFormData = {
  title: 'Sunday Sweater',
  category: 'Genser',
  needleSizes: '4, 4.5',
  difficulty: 'Middels',
  used: false,
  notes: '',
}

describe('validateRecipeForm', () => {
  it('returns no errors for valid data', () => {
    expect(validateRecipeForm(validForm)).toEqual({})
  })

  it('requires a title', () => {
    const result = validateRecipeForm({
      ...validForm,
      title: '',
    })

    expect(result.title).toBe('Navn er påkrevd.')
  })

  it('requires a category', () => {
    const result = validateRecipeForm({
      ...validForm,
      category: '',
    })

    expect(result.category).toBe('Velg en kategori.')
  })

  it('requires needle sizes', () => {
    const result = validateRecipeForm({
      ...validForm,
      needleSizes: '',
    })

    expect(result.needleSizes).toBe(
      'Skriv inn minst én pinnestørrelse.',
    )
  })
})