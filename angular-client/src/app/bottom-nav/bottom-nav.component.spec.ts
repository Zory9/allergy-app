import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { BottomNavComponent } from './bottom-nav.component';
import { UserService } from '../user.service';
import { BottomNavigationModule } from '@progress/kendo-angular-navigation';
import { IconsModule } from '@progress/kendo-angular-icons';

describe('BottomNavComponent', () => {
  let component: BottomNavComponent;
  let fixture: ComponentFixture<BottomNavComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(true);
    
    mockUserService = jasmine.createSpyObj('UserService', [], {
      isLoggedIn$: isLoggedInSubject.asObservable()
    });

    const routerEventsSubject = new Subject();
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: routerEventsSubject.asObservable() });

    await TestBed.configureTestingModule({
      declarations: [BottomNavComponent],
      imports: [BottomNavigationModule, IconsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoggedIn to true when user is logged in', () => {
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should navigate to the correct route on item selection', () => {
    const mockEvent = { item: { route: 'home' } } as any;
    component.onSelect(mockEvent);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./home']);
  });

  it('should correctly manage item selection based on route', () => {
    component.manageItemsSelection('analyze');
    const selectedItem = component.items.find((item) => item.route === 'analyze');
    const unselectedItem = component.items.find((item) => item.route !== 'analyze');

    expect(selectedItem?.selected).toBeTrue();
    expect(unselectedItem?.selected).toBeFalse();
  });

  it('should update isLoggedIn when userService emits a new value', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalse();
  });
});
