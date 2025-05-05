import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationEnd, Router } from '@angular/router';
import {
  gearIcon,
  logoutIcon,
  SVGIcon,
  userIcon,
} from '@progress/kendo-svg-icons';
import { MenuSelectEvent } from '@progress/kendo-angular-menu';
import { filter, startWith } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{
  public isLoggedIn: boolean = false;

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

        const routeToIndexMap: { [key: string]: string } = {
          home: '0',
          analyze: '1',
          recipes: '2',
        };

        this.activeItemIndex = routeToIndexMap[parts[1]] || null;
      });
  }

  public logout(): void {
    this.userService.logout();
  }

  public userIcon: SVGIcon = userIcon;
  public gearIcon: SVGIcon = gearIcon;
  public logoutIcon: SVGIcon = logoutIcon;
  public activeItemIndex: string | null = null;

  public menuItems: any[] = [
    { text: 'Начало', path: 'home' },
    { text: 'Анализ', path: 'analyze' },
    { text: 'Рецепти', path: 'recipes' },
  ];

  public buttonData = [
    {
      actionName: 'Настройки',
      svgIcon: gearIcon,
      click: (): void => {
        this.router.navigate(['/user-settings']);
      },
    },
    {
      actionName: 'Излизане',
      svgIcon: logoutIcon,
      click: (): void => {
        this.logout();
      },
    },
  ];

  public onSelect(e: MenuSelectEvent): void {
    this.activeItemIndex = e.index;
  }
}
