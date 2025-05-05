import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { chevronLeftIcon, sparklesIcon, SVGIcon, warningTriangleIcon } from '@progress/kendo-svg-icons';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { ModifiedRecipe } from '../types/recipe';
import { arrayToString, stringsToArray } from '../utils/helper-methods';

@Component({
  selector: 'app-substitute-recipe',
  templateUrl: './substitute-recipe.component.html',
  styleUrl: './substitute-recipe.component.css'
})
export class SubstituteRecipeComponent {
  public sparklesIcon: SVGIcon = sparklesIcon;
  public chevronLeftIcon: SVGIcon = chevronLeftIcon;
  public warningTriangleIcon: SVGIcon = warningTriangleIcon;
  
  public loading: boolean = false;
  public allergies: string[] = [];

  constructor(private aiService: OpenAiService, private userService: UserService) {
    this.userService.getAllergy().then((res) => {
      this.allergies = stringsToArray(res);
    });
  }

  public modifiedRecipeCard: ModifiedRecipe;
  
  public recipeForm: FormGroup = new FormGroup({
    recipe: new FormControl('', [
      Validators.required
    ]),
  });

  public modifyRecipe(): void{
    this.recipeForm.markAllAsTouched();
    
    if (this.recipeForm.valid){
      this.loading = true;
      let formValue = this.recipeForm.value;
  
      if (this.allergies){
        let allergies = arrayToString(this.allergies);
        
        this.aiService.modifyRecipe(
          allergies,
          formValue.recipe,
        ).then((res) => {
          const modifiedRecipe = res.modifiedRecipe;
          this.modifiedRecipeCard = modifiedRecipe;
          this.loading = false;
        })
      }
    }
  }

  public clearForm(): void {
    this.recipeForm.reset();
  }

  public backToForm(): void {
    this.modifiedRecipeCard = undefined;
  }
}
