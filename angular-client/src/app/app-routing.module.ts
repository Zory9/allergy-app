import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TextCompletionComponent } from './text-completion/text-completion.component';
import { CameraComponent } from './camera/camera.component';
import { ImageCompletionComponent } from './image-completion/image-completion.component';
import { SignupComponent } from './signup/signup.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { RecipesComponent } from './recipes/recipes.component';
import { GenerateRecipeComponent } from './generate-recipe/generate-recipe.component';
import { SubstituteRecipeComponent } from './substitute-recipe/substitute-recipe.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'signup',
    component: SignupComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'text',
    component: TextCompletionComponent,
  },
  {
    path: 'camera',
    component: CameraComponent,
  },
  {
    path: 'image',
    component: ImageCompletionComponent,
  },
  { path: 'analyze', component: AnalyzeComponent },
  {
    path: 'recipes',
    component: RecipesComponent,
    children: [
      { path: '', redirectTo: 'generate', pathMatch: 'full' },
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
  {
    path: 'user-settings',
    component: UserSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { 
    scrollPositionRestoration: 'enabled', 
    anchorScrolling: 'enabled', 
    scrollOffset: [0, 50]
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
