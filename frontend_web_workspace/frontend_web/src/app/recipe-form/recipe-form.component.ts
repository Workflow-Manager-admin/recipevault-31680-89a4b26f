import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe, RecipeCreate, RecipeUpdate } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
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
  ) {}

  ngOnInit() {
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
        error: _ => { this.errorMsg = 'Recipe not found'; this.loading = false; }
      });
    }
  }

  addIngredientField() {
    this.form.ingredients.push('');
  }

  removeIngredientField(i: number) {
    if (this.form.ingredients.length > 1) {
      this.form.ingredients.splice(i, 1);
    }
  }

  submit() {
    if (this.loading) return;
    this.loading = true;
    if (this.isEdit && this.recipeId) {
      const update: RecipeUpdate = {
        ...this.form,
        ingredients: this.form.ingredients
      };
      this.recipeService.updateRecipe(this.recipeId, update).subscribe({
        next: _ => this.router.navigate(['/recipes', this.recipeId]),
        error: _ => {
          this.errorMsg = 'Failed to update recipe';
          this.loading = false;
        }
      });
    } else {
      this.recipeService.addRecipe(this.form).subscribe({
        next: r => this.router.navigate(['/recipes', r.id]),
        error: _ => {
          this.errorMsg = 'Failed to add recipe';
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    if (this.isEdit && this.recipeId) {
      this.router.navigate(['/recipes', this.recipeId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
