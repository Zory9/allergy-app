import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../types/user';
import { allergies } from '../data/allergy-list';
import { arrayToString, stringsToArray } from '../utils/helper-methods';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
})
export class UserSettingsComponent {
  private initialUserFormValues: Partial<User>;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.initUserForm();
  }
  
  public allergiesData: string[] = allergies;

  public updateSuccess: boolean = false;
  public updateError: boolean = false;

  public userForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
    ]),
    allergy: new FormControl('', Validators.required),
  });

  private initUserForm(): void {
    const userId = this.userService.getUserId();

    this.userService.getUser(userId).then((user) => {
      const allergies = stringsToArray(user.allergy);

      this.userForm = this.formBuilder.group({
        username: [user.username, Validators.required],
        email: [user.email, [Validators.required, Validators.email]],
        firstName: [user.firstName],
        lastName: [user.lastName],
        allergy: [allergies, Validators.required],
      });

      this.initialUserFormValues = { ...this.userForm.getRawValue() };
    });
  }

  public updateUserInfo(): void {
    if (this.userForm.valid) {
      let formValue = this.userForm.value;
      const userId = this.userService.getUserId();
      let allergies = arrayToString(formValue.allergy);

      this.userService.updateUserInfo(userId, formValue.email, formValue.username, allergies).then((user) => {
        if (user) {
          this.updateSuccess = true;
          this.updateError = false;
          this.userForm.markAsUntouched();
        }
      }).catch((err) => {
        this.updateSuccess = false;
        this.updateError = true;
      });

    } else {
      this.userForm.markAsTouched();
    }
  }

  public restoreUserInfo(): void {
   this.userForm.reset(this.initialUserFormValues);
   this.userForm.markAsPristine();
   this.userForm.markAsUntouched();
  }

  public onDialogClose(): void {
    this.updateSuccess = false;
  }

  public onDialogCloseError(): void {
   this.updateError = false;
  }
}
