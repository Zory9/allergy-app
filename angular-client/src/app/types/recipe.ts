export interface ModifiedRecipe {
  name: string;
  description: string;
  time: string;
  ingredients: ModifiedIngredient[];
  instructions: string;
  safe?: boolean;
}

export interface ModifiedIngredient {
  original: string;
  isAllergen: boolean;
  replacement?: string;
  quantity: string;
}
