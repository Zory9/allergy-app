import { Component, Input } from '@angular/core';
import { clockIcon, arrowDownLeftIcon, warningTriangleIcon, chevronUpIcon, checkCircleIcon, SVGIcon, arrowRotateCwIcon, chevronDownIcon } from '@progress/kendo-svg-icons';
import { ModifiedIngredient } from '../types/recipe';

@Component({
  selector: 'substitute-recipe-card',
  templateUrl: './substitute-recipe-card.component.html',
  styleUrl: './substitute-recipe-card.component.css',
})
export class SubstituteRecipeCardComponent {
  @Input() public name: string;
  @Input() public shortDesc: string;
  @Input() public cookTime: string;
  @Input() public description: string;
  @Input() public safe?: boolean;
  @Input() public ingredients: ModifiedIngredient[];
  
  public clockIcon: SVGIcon = clockIcon;
  public arrowDownLeftIcon: SVGIcon = arrowDownLeftIcon;
  public warningTriangleIcon: SVGIcon = warningTriangleIcon;
  public checkCircleIcon: SVGIcon = checkCircleIcon;
  public arrowRotateCwIcon: SVGIcon = arrowRotateCwIcon;
  public moreIcon: SVGIcon = chevronDownIcon;
  public chevronUpIcon: SVGIcon = chevronUpIcon;

  public expanded = false;
  public btnText = "Виж стъпките за приготвяне";

  public toggleRecipe(): void {
    this.expanded = !this.expanded;
    this.btnText = this.expanded ? "Скрий" : "Виж стъпките за приготвяне";
    this.moreIcon = this.expanded ? chevronUpIcon : chevronDownIcon;
  }
  
  public get parsedSteps(): string[] {
    return this.description
      .split('\n')
      .map(step => step.replace(/^\s*\d+\.\s*/, ''));
  }
}
