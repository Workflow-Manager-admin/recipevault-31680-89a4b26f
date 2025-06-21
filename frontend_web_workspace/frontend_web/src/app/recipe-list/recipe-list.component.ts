import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
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
      next: recipes => {
        this.recipes = recipes;
        this.loading = false;
      }, 
      error: _ => { this.loading = false; }
    });
  }

  onSearch(): void {
    this.fetchRecipes();
  }

  viewRecipe(id: number) {
    this.router.navigate(['/recipes', id]);
  }

  addRecipe() {
    this.router.navigate(['/recipes/new']);
  }
}
