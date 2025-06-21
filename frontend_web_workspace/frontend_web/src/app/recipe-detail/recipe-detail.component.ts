import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRecipe(id);
  }

  loadRecipe(id: number) {
    this.loading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: r => { this.recipe = r; this.loading = false; },
      error: _ => { this.router.navigate(['/']); }
    });
  }

  editRecipe() {
    this.router.navigate(['/recipes', this.recipe?.id, 'edit']);
  }

  deleteRecipe() {
    if (!this.recipe) return;
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: _ => this.router.navigate(['/']),
        error: _ => alert('Could not delete recipe.')
      });
    }
  }

  backToList() {
    this.router.navigate(['/']);
  }
}
