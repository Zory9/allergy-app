import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { chevronLeftIcon, sparklesIcon, SVGIcon, warningTriangleIcon } from '@progress/kendo-svg-icons';
import { UserService } from '../user.service';
import { OpenAiService } from '../openai.service';
import { arrayToString, stringsToArray } from '../utils/helper-methods';

export interface Recipe {
  name: string;
  description: string;
  cookTime: string;
}

@Component({
  selector: 'app-generate-recipe',
  templateUrl: './generate-recipe.component.html',
  styleUrl: './generate-recipe.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GenerateRecipeComponent {
  public sparklesIcon: SVGIcon = sparklesIcon;
  public warningTriangleIcon: SVGIcon = warningTriangleIcon;
  public chevronLeftIcon: SVGIcon = chevronLeftIcon;
  public loading: boolean = false;
  public allergies: string[] = [];

  constructor(private aiService: OpenAiService, private userService: UserService) {
    this.userService.getAllergy().then((res) => {
      this.allergies = stringsToArray(res);
    });
  }

  public recipeCards: any[] = [];
  public cuisines: string[] = [
    'Българска',
    'Италианска',
    'Френска',
    'Гръцка',
    'Турска',
    'Мексиканска',
    "Американска",
    'Китайска',
    'Корейска',
    'Индийска',
  ];
  public mealTypes: string[] = [
    'Закуска',
    'Обяд',
    'Следобедна закуска',
    'Вечеря',
  ];
  public cookTimes: string[] = [
    '10 минути',
    '20 минути',
    '30 минути',
    '45 минути',
    '1 час'
  ];

  public recipeForm: FormGroup = new FormGroup({
    cuisine: new FormControl(''),
    mealtype: new FormControl(''),
    cooktime: new FormControl(''),
    ingredients: new FormControl('', [
      Validators.required
    ]),
  });

  public generateRecipe(){
    this.recipeForm.markAllAsTouched();

    if (this.recipeForm.valid){
      this.loading = true;
      let formValue = this.recipeForm.value;
  
      if (this.allergies){
        let allergies = arrayToString(this.allergies);

        this.aiService.generateRecipe(
          allergies,
          formValue.ingredients,
          formValue.cuisine,
          formValue.mealtype,
          formValue.cooktime,
        ).then((res) => {
          const generatedRecipes = res.recipes;
          this.recipeCards.push(...generatedRecipes);
          this.loading = false;
        })
      }
    }
  }

  public clearForm(): void {
    this.recipeForm.reset();
  }

  public backToForm(): void {
    this.recipeCards = [];  
  }
}
