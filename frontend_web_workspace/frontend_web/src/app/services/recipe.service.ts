import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipeCreate, RecipeUpdate } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'http://localhost:8000/recipes';

  constructor(private http: HttpClient) {}

  // PUBLIC_INTERFACE
  getRecipes(q?: string, tag?: string): Observable<Recipe[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (tag) params = params.set('tag', tag);
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  }

  // PUBLIC_INTERFACE
  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  }

  // PUBLIC_INTERFACE
  addRecipe(recipe: RecipeCreate): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, recipe);
  }

  // PUBLIC_INTERFACE
  updateRecipe(id: number, updates: RecipeUpdate): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.baseUrl}/${id}`, updates);
  }

  // PUBLIC_INTERFACE
  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
