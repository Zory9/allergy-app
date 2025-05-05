import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { UserService } from '../user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let router: Router;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, InputsModule, ButtonsModule, LabelModule, MultiSelectModule, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordType).toBe('password');
    component.toggleVisibility();
    expect(component.passwordType).toBe('text');
    component.toggleVisibility();
    expect(component.passwordType).toBe('password');
  });

  it('should clear the form', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123',
      allergy: ['Peanuts'],
    });
    component.clearForm();
    expect(component.registerForm.value).toEqual({
      username: null,
      email: null,
      password: null,
      allergy: null,
    });
  });

  it('should call userService.register on valid form submission', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123',
      allergy: ['Peanuts'],
    });
    component.register();
    expect(mockUserService.register).toHaveBeenCalledWith(
      'testuser',
      'test@example.com',
      'Test@123',
      'Peanuts'
    );
  });

  it('should mark all fields as touched on invalid form submission', () => {
    component.registerForm.setValue({
      username: '',
      email: '',
      password: '',
      allergy: '',
    });
    component.register();
    expect(component.registerForm.touched).toBeTrue();
    expect(component.registerForm.controls['username'].touched).toBeTrue();
    expect(component.registerForm.controls['email'].touched).toBeTrue();
    expect(component.registerForm.controls['password'].touched).toBeTrue();
    expect(component.registerForm.controls['allergy'].touched).toBeTrue();
  });

  it('should navigate to login on login button click', () => {
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['signup/login']);
  });

  it('should close success dialog', () => {
    component.userService.registerSuccess = true;
    component.onDialogClose();
    expect(component.userService.registerSuccess).toBeFalse();
  });

  it('should close error dialog', () => {
    component.userService.registerError = true;
    component.onDialogCloseError();
    expect(component.userService.registerError).toBeFalse();
  });
});
