import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComponent } from './user-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from '@progress/kendo-angular-dialog';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUserId',
      'getUser',
      'updateUserInfo',
    ]);
    mockUserService.getUserId.and.returnValue('123');
    mockUserService.getUser.and.returnValue(
      Promise.resolve({
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        allergy: 'nuts, dairy',
        password: 'examplePassword',
      })
    );

    await TestBed.configureTestingModule({
      declarations: [UserSettingsComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        InputsModule,
        ButtonsModule,
        LabelModule,
        MultiSelectModule,
        DialogModule
      ],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', async () => {
    await fixture.whenStable();
    expect(component.userForm.value).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      allergy: ['nuts', 'dairy'],
    });
  });

  it('should mark the form as untouched and pristine after restoring user info', async () => {
    await fixture.whenStable();
    component.userForm.patchValue({ username: 'newuser' });

    component.restoreUserInfo();
    expect(component.userForm.value.username).toBe('testuser');
    expect(component.userForm.pristine).toBeTrue();
    expect(component.userForm.untouched).toBeTrue();
  });

  it('should call updateUserInfo on valid form submission', async () => {
    await fixture.whenStable();
    mockUserService.updateUserInfo.and.returnValue(Promise.resolve(true));
    component.userForm.patchValue({ username: 'updateduser' });

    component.updateUserInfo();
    expect(mockUserService.updateUserInfo).toHaveBeenCalledWith(
      '123',
      'test@example.com',
      'updateduser',
      'nuts, dairy'
    );
    await fixture.whenStable();
    expect(component.updateSuccess).toBeTrue();
    expect(component.updateError).toBeFalse();
  });

  it('should set updateError to true if updateUserInfo fails', async () => {
    await fixture.whenStable();
    mockUserService.updateUserInfo.and.returnValue(Promise.reject("Error"));
    component.userForm.patchValue({ username: 'updateduser' });

    await component.updateUserInfo();
    await fixture.whenStable();
    expect(component.updateSuccess).toBeFalse();
    expect(component.updateError).toBeTrue();
  });

  it('should mark the form as touched if invalid on submission', async () => {
    await fixture.whenStable();
    component.userForm.patchValue({ email: '' });
    component.updateUserInfo();
    expect(component.userForm.touched).toBeTrue();
  });

  it('should close the success dialog when onDialogClose is called', () => {
    component.updateSuccess = true;
    component.onDialogClose();
    expect(component.updateSuccess).toBeFalse();
  });

  it('should close the error dialog when onDialogCloseError is called', () => {
    component.updateError = true;
    component.onDialogCloseError();
    expect(component.updateError).toBeFalse();
  });
});
