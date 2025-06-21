import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

export const routes: Routes = [
  { path: '', component: RecipeListComponent },
  { path: 'recipes/new', component: RecipeFormComponent },
  { path: 'recipes/:id/edit', component: RecipeFormComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: '**', redirectTo: '' }
];
