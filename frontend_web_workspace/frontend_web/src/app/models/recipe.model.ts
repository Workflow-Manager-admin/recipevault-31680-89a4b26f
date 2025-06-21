export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  tags?: string[];
}

export interface RecipeCreate {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  tags?: string[];
}

export interface RecipeUpdate {
  title?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  tags?: string[];
}
