import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, startWith } from 'rxjs';
export interface IButton {
  text: string;
  selected?: boolean;
  route: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit{
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.router.events
    .pipe(
       filter((event) => event instanceof NavigationEnd),
       startWith(this.router)
    )
    .subscribe((event: NavigationEnd) => {
      this.manageButtonsSelection(this.router.url);
    })
  }

  public selectedRegister: boolean = true;
  public selectedLogin: boolean = false;
  public buttons: IButton[] = [
    { text: 'Регистрирай се', route: 'register' },
    { text: 'Влез в профила си', route: 'login' },
  ];

  public selectedChange(btn: IButton): void {
    if (btn.route == 'login') {
      this.router.navigate(['login'], { relativeTo: this.route });
    } else {
      this.router.navigate(['register'], { relativeTo: this.route });
    }
  }

  public manageButtonsSelection(url): void {
    if (url.includes('login')) {
      this.buttons[0].selected = false;
      this.buttons[1].selected = true;
    } else {
      this.buttons[0].selected = true;
      this.buttons[1].selected = false;
    }
  }
}
