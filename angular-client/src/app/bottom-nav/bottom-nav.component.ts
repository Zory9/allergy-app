import { Component, ViewEncapsulation } from '@angular/core';
import { homeIcon, searchIcon, SVGIcon, trackChangesEnableIcon } from '@progress/kendo-svg-icons';
import { UserService } from '../user.service';
import { NavigationEnd, Router } from '@angular/router';
import { BottomNavigationItem, BottomNavigationSelectEvent } from '@progress/kendo-angular-navigation';
import { filter, startWith } from 'rxjs';

interface MyBottomNavigationItem extends BottomNavigationItem {
  route: string; 
}

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BottomNavComponent {
  constructor(public userService: UserService, private router: Router) {
    this.userService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public ngOnInit(): void {
      this.router.events
      .pipe(
         filter((event) => event instanceof NavigationEnd),
         startWith(this.router)
      )
      .subscribe((event: NavigationEnd) => {
        const url = this.router.url;
        const parts = url.split('/');

        this.manageItemsSelection(parts[1]);
      })
    }

  public homeIcon: SVGIcon = homeIcon;
  public searchIcon: SVGIcon = searchIcon;
  public trackChangesEnableIcon: SVGIcon = trackChangesEnableIcon;

  public items: MyBottomNavigationItem[] = [
    { text: "Начало", svgIcon: this.homeIcon, route: "home" },
    { text: "Анализ", svgIcon: this.searchIcon, route: "analyze" },
    { text: "Рецепти", svgIcon: this.trackChangesEnableIcon, route: "recipes" },
  ];

  public isLoggedIn: boolean = false;

  public onSelect(ev: BottomNavigationSelectEvent): void {
    this.router.navigate([`./${ev.item.route}`]);
  }

  public manageItemsSelection(route): void {
    this.items.forEach((item) => {
      if (item.route == route) {
        item.selected = true;
      }
      else {
        item.selected = false;
      }
    })
  }
}
