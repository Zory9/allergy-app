import { Component, ViewEncapsulation } from '@angular/core';
import {
  searchIcon,
  SVGIcon,
  sparklesIcon,
  replaceSingleIcon
} from '@progress/kendo-svg-icons';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  public searchIcon: SVGIcon = searchIcon;
  public sparklesIcon: SVGIcon = sparklesIcon;
  public replaceSingleIcon: SVGIcon = replaceSingleIcon;
  public isLoggedIn: boolean = false;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.userService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public onStartNow(): void{
    if (this.isLoggedIn) {
      this.router.navigate(['/analyze']);
    } else {
      this.router.navigate(['/signup/register']);
    }
  }
}
