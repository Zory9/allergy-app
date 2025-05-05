import { Component, } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

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
export class SignupComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.router.navigate(['register'], { relativeTo: this.route });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        console.log(this.router.url, "cmp")
        if (this.router.url.includes('login')) {
          this.buttons[0].selected = false;
          this.buttons[1].selected = true;
          this.buttons = [...this.buttons];
        } else {
          this.buttons[0].selected = true;
          this.buttons[1].selected = false;
          this.buttons = [...this.buttons];
        }
      }
    });
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
      this.buttons[0].selected = false;
      this.buttons[1].selected = true;
    } else {
      this.router.navigate(['register'], { relativeTo: this.route });
      this.buttons[0].selected = true;
      this.buttons[1].selected = false;
    }
  }
}
