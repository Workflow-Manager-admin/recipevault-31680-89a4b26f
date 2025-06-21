import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  recipes: Recipe[] = [];
  searchText: string = '';
  loading: boolean = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.loading = true;
    this.recipeService.getRecipes(this.searchText).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    this.fetchRecipes();
  }

  viewRecipe(id: number): void {
    this.router.navigate(['/recipes', id]);
  }

  addRecipe(): void {
    this.router.navigate(['/recipes/new']);
  }
}
