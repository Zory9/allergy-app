import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { InputType } from '@progress/kendo-angular-inputs';
import { eyeIcon, SVGIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}
  public passwordType: InputType = "password";
  public eyeIcon: SVGIcon = eyeIcon;

  public toggleVisibility(): void {
    if (this.passwordType === "password") {
      this.passwordType = "text";
    } else {
      this.passwordType = "password";
    }
  }

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]),
    password: new FormControl('', Validators.required),
  });

  public clearForm(): void {
    this.loginForm.reset();
  }

  public login(): void {
    if (this.loginForm.valid){
      let formValue = this.loginForm.value;
  
      this.userService.login(
        formValue.email,
        formValue.password
      );
  
      this.clearForm();
      this.cdr.detectChanges();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
