export interface Recipe {
  name: string;
  shortDesc: string;
  time: string;
  description: string;
}
export interface ModifiedRecipe {
  name: string;
  shortDesc: string;
  time: string;
  ingredients: ModifiedIngredient[];
  description: string;
  safe?: boolean;
}

export interface ModifiedIngredient {
  original: string;
  isAllergen: boolean;
  replacement?: string;
  quantity: string;
}
