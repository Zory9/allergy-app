import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { UserService } from '../user.service';
import { By } from '@angular/platform-browser';
import { MenusModule } from '@progress/kendo-angular-menu';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;
  let events: Subject<{}>;
  let router: Router;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(true);
    events = new Subject<{}>();

    mockUserService = jasmine.createSpyObj('UserService', [], {
      isLoggedIn$: isLoggedInSubject.asObservable(),
      logout: jasmine.createSpy('logout'),
    });

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MenusModule, ButtonsModule, NavigationModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    Object.defineProperty(router, 'url', { value: '/analyze', writable: true });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
   
    spyOn(router, 'navigate');
    spyOn(router.events, 'pipe').and.returnValue(events.asObservable());
    router.initialNavigation();

    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoggedIn to true when user is logged in', () => {
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should call logout method on logout button click', () => {
    const logoutButton = component.buttonData.find(
      (btn) => btn.actionName === 'Излизане'
    );

    logoutButton.click();
    expect(mockUserService.logout).toHaveBeenCalled();
  });

  it('should navigate to user settings when settings button is clicked', () => {
    const settingsButton = component.buttonData.find(
      (btn) => btn.actionName === 'Настройки'
    );

    settingsButton.click();
    expect(router.navigate).toHaveBeenCalledWith(['/user-settings']);
  });

  it('should update activeItemIndex based on the current route', () => {
    events.next(new NavigationEnd(1, '/analyze', '/analyze'));
    fixture.detectChanges();
    
    expect(component.activeItemIndex).toBe('1');
  });

  it('should render the logo', () => {
    const logo = fixture.debugElement.query(By.css('.logo'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('allergen-free-logo.png');
  });

  it('should display menu items when user is logged in', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.k-menu'));
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('should display login/register button when user is not logged in', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
    const regButton = fixture.debugElement.query(By.css('.register-btn'));
    expect(regButton).toBeTruthy();
  });
});
