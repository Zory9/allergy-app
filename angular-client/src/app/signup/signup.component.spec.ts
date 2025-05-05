import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SignupComponent } from './signup.component';
import { Subject } from 'rxjs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { Component } from '@angular/core';
@Component({ template: '<router-outlet></router-outlet>' })
class TestComponent {}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let events: Subject<{}>;

  beforeEach(async () => {
    events = new Subject<{}>();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'signup', pathMatch: 'full' },
          { path: 'signup',
          component: TestComponent,
          children: [
            { path: '', redirectTo: 'register', pathMatch: 'full' },
            {
              path: 'register',
              component: TestComponent,
            },
            {
              path: 'login',
              component: TestComponent,
            },
          ]}
      ]), ButtonsModule],
      declarations: [SignupComponent],
    }).compileComponents();
    
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    spyOn(router, 'navigate');
    spyOn(router.events, 'pipe').and.returnValue(events.asObservable());

    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize buttons with correct properties', async () => {
    expect(component.buttons.length).toBe(2);
    expect(component.buttons[0].text).toBe('Регистрирай се');
    expect(component.buttons[0].route).toBe('register');
    expect(component.buttons[1].text).toBe('Влез в профила си');
    expect(component.buttons[1].route).toBe('login');
  });

  it('should navigate to "register" by default', async() => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toEqual('/signup/register');
  });

  it('should update button selection and navigate on selectedChange()', async () => {
    component.selectedChange(component.buttons[0]);
    expect(router.navigate).toHaveBeenCalledWith(['register'], {
      relativeTo: route,
    });

    component.selectedChange(component.buttons[1]);
    expect(router.navigate).toHaveBeenCalledWith(['login'], {
      relativeTo: route,
    });
  });

  it('should update button selection on router events', async() => {
    Object.defineProperty(router, 'url', { value: '/signup/login', writable: true });
    events.next(new NavigationEnd(1, '/signup', '/signup/login'));
    
    fixture.detectChanges();
    await fixture.whenStable();
    await component.ngOnInit();

    expect(component.buttons[0].selected).toBeFalse();
    expect(component.buttons[1].selected).toBeTrue();
  });
});
