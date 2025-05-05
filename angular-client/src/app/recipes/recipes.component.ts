import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  sparklesIcon,
  SVGIcon,
  replaceSingleIcon,
} from '@progress/kendo-svg-icons';
import { filter, startWith } from 'rxjs';

export interface IButton {
  text: string;
  selected?: boolean;
  route: string;
  icon: SVGIcon;
}

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe((event: NavigationEnd) => {
        const url = this.router.url;
        const parts = url.split('/');

        this.manageButtonSelection(parts[2]);
      });
  }

  public buttons: IButton[] = [
    { text: 'Генерирай рецепта', route: 'generate', icon: sparklesIcon },
    {
      text: 'Модифицирай рецепта',
      route: 'substitute',
      icon: replaceSingleIcon,
    },
  ];

  public selectedChange(btn: IButton): void {
    this.manageButtonSelection(btn.route);

    if (btn.route == 'generate') {
      this.router.navigate(['generate'], { relativeTo: this.route });
    } else {
      this.router.navigate(['substitute'], { relativeTo: this.route });
    }
  }

  public manageButtonSelection(route): void {
    this.buttons.forEach((button) => {
      if (button.route == route) {
        button.selected = true;
      } else {
        button.selected = false;
      }
    });
  }
}
