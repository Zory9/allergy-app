import { Injectable } from '@angular/core';
import { HttpService } from './@backend/services/http.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AIOutput } from './types/ai-output';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  constructor(private http: HttpService, private router: Router) {}

  public async askText(question: string, allergy: string): Promise<string> {
    try {
      const req = this.http.askAIText(question, allergy);
      const data = await firstValueFrom(req);
      return data.answer.content;
    } catch (err) {
      throw err;
    }
  }

  public async askImage(image: string, allergy: string): Promise<string> {
    try {
      const req = this.http.askAIImage(image, allergy);
      const data = await firstValueFrom(req);
      return data.answer.content;
    } catch (err) {
      throw err;
    }
  }

  public async generateRecipe(allergy: string, ingredients: string, cuisine: string, mealtype: string, cooktime: string): Promise<any> {
    try {
      const req = this.http.askAIGenerateRecipe(allergy, ingredients, cuisine, mealtype, cooktime);
      const data = await firstValueFrom(req);
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async modifyRecipe(allergy: string, recipe: string): Promise<any> {
    try {
      const req = this.http.askAIModifyRecipe(allergy, recipe);
      const data = await firstValueFrom(req);
      return data;
    } catch (err) {
      throw err;
    }
  }
}
