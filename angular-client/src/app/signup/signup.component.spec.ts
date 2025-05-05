import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SignupComponent } from './signup.component';
import { Subject } from 'rxjs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let events: Subject<{}>;

  beforeEach(async () => {
    events = new Subject<{}>();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ButtonsModule],
      declarations: [SignupComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: [{ value: '/signup', writable: true }] },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

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

  it('should initialize buttons with correct properties', async() => {
    expect(component.buttons.length).toBe(2);
    expect(component.buttons[0].text).toBe('Регистрирай се');
    expect(component.buttons[0].route).toBe('register');
    expect(component.buttons[0].selected).toBeTrue();
    expect(component.buttons[1].text).toBe('Влез в профила си');
    expect(component.buttons[1].route).toBe('login');
    expect(component.buttons[1].selected).toBeFalse();
  });

  it('should navigate to "register" by default', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['register'], {
      relativeTo: jasmine.any(Object),
    });
  });

  it('should update button selection and navigate on selectedChange()', async () => {
    component.selectedChange(component.buttons[0]);
    expect(component.buttons[0].selected).toBeTrue();
    expect(component.buttons[1].selected).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['register'], {
      relativeTo: jasmine.any(Object),
    });

    component.selectedChange(component.buttons[1]);
    expect(component.buttons[0].selected).toBeFalse();
    expect(component.buttons[1].selected).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['login'], {
      relativeTo: jasmine.any(Object),
    });
  });

  it('should update button selection on router events', async() => {
    Object.defineProperty(router, 'url', {
      value: '/signup/login',
      writable: true,
    });
    events.next(new NavigationEnd(1, '/signup/login', '/signup/login'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.buttons[0].selected).toBeFalse();
    expect(component.buttons[1].selected).toBeTrue();
  });
});
