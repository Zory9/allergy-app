import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyzeComponent } from './analyze/analyze.component';
import { RecipesComponent } from './recipes/recipes.component';
import { HomeComponent } from './home/home.component';
import { SubstituteRecipeComponent } from './substitute-recipe/substitute-recipe.component';
import { GenerateRecipeComponent } from './generate-recipe/generate-recipe.component';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'analyze', pathMatch: 'full' },
      { path: 'analyze', pathMatch: 'full', component: AnalyzeComponent },
      {
        path: 'recipes',
        component: RecipesComponent,
        children: [
          {
            path: 'generate',
            component: GenerateRecipeComponent,
          },
          {
            path: 'substitute',
            component: SubstituteRecipeComponent,
          },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
