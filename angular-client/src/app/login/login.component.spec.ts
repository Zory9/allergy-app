import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { UserService } from '../user.service';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, InputsModule, LabelModule, ButtonsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordType).toBe('password');
    component.toggleVisibility();
    expect(component.passwordType).toBe('text');
    component.toggleVisibility();
    expect(component.passwordType).toBe('password');
  });

  it('should clear the form', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    component.clearForm();
    expect(component.loginForm.value).toEqual({ email: null, password: null });
  });

  it('should call UserService.login on valid form submission', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    component.login();
    expect(mockUserService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should not call UserService.login on invalid form submission', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.login();
    expect(mockUserService.login).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched on invalid form submission', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.login();
    expect(component.loginForm.controls['email'].touched).toBeTrue();
    expect(component.loginForm.controls['password'].touched).toBeTrue();
  });

  it('should display error messages for invalid email', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('');
    emailControl.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('kendo-formerror')).nativeElement;
    expect(errorElement.textContent).toContain('Моля, въведи валиден имейл.');
  });

  it('should display error messages for invalid password', () => {
    const passwordControl = component.loginForm.controls['password'];
    passwordControl.setValue('');
    passwordControl.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('kendo-formerror')).nativeElement;
    expect(errorElement.textContent).toContain('Моля, въведи парола.');
  });
});
