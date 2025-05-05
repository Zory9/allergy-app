import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
 public isLoggedIn: boolean = false;

  constructor(private userService: UserService) {
    this.userService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }
}
