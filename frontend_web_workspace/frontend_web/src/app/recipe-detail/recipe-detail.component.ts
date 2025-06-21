import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent {
  recipe?: Recipe;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRecipe(id);
  }

  loadRecipe(id: number): void {
    this.loading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: (r) => { this.recipe = r; this.loading = false; },
      error: () => { this.router.navigate(['/']); }
    });
  }

  editRecipe(): void {
    if (this.recipe) {
      this.router.navigate(['/recipes', this.recipe.id, 'edit']);
    }
  }

  deleteRecipe(): void {
    if (!this.recipe) return;
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: () => this.router.navigate(['/']),
        // eslint-disable-next-line no-alert
        error: () => window.alert('Could not delete recipe.')
      });
    }
  }

  backToList(): void {
    this.router.navigate(['/']);
  }
}
