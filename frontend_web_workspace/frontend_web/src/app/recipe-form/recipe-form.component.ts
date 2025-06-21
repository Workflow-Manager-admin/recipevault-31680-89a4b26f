import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe, RecipeCreate, RecipeUpdate } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent {
  isEdit = false;
  recipeId?: number;
  form: RecipeCreate = {
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    tags: []
  };
  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {
    this.initializeComponent();
  }

  // Used because lifecycle hooks are not called on standalone components unless explicitly managed.
  initializeComponent(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.recipeId = Number(id);
      this.loading = true;
      this.recipeService.getRecipe(this.recipeId).subscribe({
        next: (r: Recipe) => {
          this.form = {
            title: r.title,
            description: r.description,
            ingredients: [...r.ingredients],
            instructions: r.instructions,
            tags: r.tags || []
          };
          this.loading = false;
        },
        error: () => { this.errorMsg = 'Recipe not found'; this.loading = false; }
      });
    }
  }

  addIngredientField(): void {
    this.form.ingredients.push('');
  }

  removeIngredientField(i: number): void {
    if (this.form.ingredients.length > 1) {
      this.form.ingredients.splice(i, 1);
    }
  }

  updateTagsFromString(tagsString: string): void {
    this.form.tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);
  }

  tagsToString(): string {
    return this.form.tags?.join(', ') || '';
  }

  submit(): void {
    if (this.loading) return;
    this.loading = true;
    if (this.isEdit && this.recipeId) {
      const update: RecipeUpdate = {
        ...this.form,
        ingredients: this.form.ingredients
      };
      this.recipeService.updateRecipe(this.recipeId, update).subscribe({
        next: () => this.router.navigate(['/recipes', this.recipeId]),
        error: () => {
          this.errorMsg = 'Failed to update recipe';
          this.loading = false;
        }
      });
    } else {
      this.recipeService.addRecipe(this.form).subscribe({
        next: (r) => this.router.navigate(['/recipes', r.id]),
        error: () => {
          this.errorMsg = 'Failed to add recipe';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.isEdit && this.recipeId) {
      this.router.navigate(['/recipes', this.recipeId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
