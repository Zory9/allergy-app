import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { eyeIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { InputType } from '@progress/kendo-angular-inputs';
import { hasNumber, hasSpecialCharacter, hasUppercase } from '../utils/validators';
import { allergies } from '../data/allergy-list';
import { arrayToString } from '../utils/helper-methods';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute) {}
  public eyeIcon: SVGIcon = eyeIcon;
  public passwordType: InputType = 'password';
  public allergiesData: string[] = allergies;

  public toggleVisibility(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  public registerForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      hasUppercase,
      hasNumber,
      hasSpecialCharacter,
    ]),
    allergy: new FormControl('', Validators.required),
  });

  public clearForm(): void {
    this.registerForm.reset();
  }

  public register(): void {
    if(this.registerForm.valid){
      let formValue = this.registerForm.value;
      let allergies = arrayToString(formValue.allergy);

      this.userService.register(
        formValue.username,
        formValue.email,
        formValue.password,
        allergies
      );
  
      this.clearForm();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  public login(): void {
    this.router.navigate(['signup/login']);
    this.userService.registerSuccess = false;
  }

  public onDialogClose(): void {
    this.userService.registerSuccess = false;
  }

  public onDialogCloseError(): void {
   this.userService.registerError = false;
  }
}
