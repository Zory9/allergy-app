import { Component, Input } from '@angular/core';
import { chevronDownIcon, chevronUpIcon, clockIcon, SVGIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() public name: string;
  @Input() public description: string;
  @Input() public cookTime: string;
  @Input() public shortDesc: string;

  public moreIcon: SVGIcon = chevronDownIcon;
  public chevronUpIcon: SVGIcon = chevronUpIcon;
  public clockIcon: SVGIcon = clockIcon;

  public expanded = false;
  public btnText = "Виж цялата рецепта";

  public toggleRecipe(): void {
    this.expanded = !this.expanded;
    this.btnText = this.expanded ? "Скрий" : "Виж цялата рецепта";
    this.moreIcon = this.expanded ? chevronUpIcon : chevronDownIcon;
  }

  public get parsedSteps(): string[] {
    return this.description
      .split('\n')
      .map(step => step.replace(/^\s*\d+\.\s*/, ''));
  }
}
