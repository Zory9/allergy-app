import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpService } from './@backend/services/http.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const httpServiceMock = jasmine.createSpyObj('HttpService', [
      'getProfile',
      'loginUser',
      'registerUser',
      'updateUser',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return token from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testToken');
    const token = service.getToken();
    expect(token).toBe('testToken');
  });

  it('should return null if no token is in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const token = service.getToken();
    expect(token).toBeNull();
  });

  it('should return null if no token is present for getUserId', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const userId = service.getUserId();
    expect(userId).toBeNull();
  });

  it('should call logout and clear localStorage', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should fetch user profile', async () => {
    const mockUser = { id: 123, email: 'test@test.com', username: 'testUser', password: 'testPassword123', allergy: 'peanuts' };
    httpServiceSpy.getProfile.and.returnValue(of(mockUser));

    const user = await service.getUser('123');
    expect(user).toEqual(mockUser);
    expect(httpServiceSpy.getProfile).toHaveBeenCalledWith('123');
  });

  it('should handle login and store token', async () => {
    const mockResponse = { token: 'testToken' };
    httpServiceSpy.loginUser.and.returnValue(of(mockResponse));
    spyOn(localStorage, 'setItem');

    await service.login('test@test.com', 'password');
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'testToken');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/analyze']);
  });

  it('should handle registration success', async () => {
    httpServiceSpy.registerUser.and.returnValue(of({}));

    await service.register('testUser', 'test@test.com', 'password', 'peanuts');
    expect(service.registerSuccess).toBeTrue();
    expect(service.registerError).toBeFalse();
  });

  it('should handle registration error', async () => {
    httpServiceSpy.registerUser.and.returnValue(of(Promise.reject('Error')));

    await service.register('testUser', 'test@test.com', 'password', 'peanuts');
    expect(service.registerSuccess).toBeFalse();
    expect(service.registerError).toBeTrue();
  });

  it('should update user info', async () => {
    const mockUpdatedUser = { id: '123', email: 'updated@test.com', username: 'updatedUser', allergy: 'none' };
    httpServiceSpy.updateUser.and.returnValue(of(mockUpdatedUser));

    const updatedUser = await service.updateUserInfo('123', 'updated@test.com', 'updatedUser', 'none');
    expect(updatedUser).toEqual(mockUpdatedUser);
    expect(httpServiceSpy.updateUser).toHaveBeenCalledWith('123', 'updated@test.com', 'updatedUser', 'none');
  });
});
