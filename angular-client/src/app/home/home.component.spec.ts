import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { HomeComponent } from './home.component';
import { UserService } from '../user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IconsModule } from '@progress/kendo-angular-icons';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;
  let router: Router;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(true);
    
    mockUserService = jasmine.createSpyObj('UserService', [], {
      isLoggedIn$: isLoggedInSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, IconsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoggedIn to true when user is logged in', () => {
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should set isLoggedIn to false when user is not logged in', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalse();
  });

  it('should navigate to /analyze if user is logged in when onStartNow is called', () => {
    component.onStartNow();
    expect(router.navigate).toHaveBeenCalledWith(['/analyze']);
  });

  it('should navigate to /signup/register if user is not logged in when onStartNow is called', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
    component.onStartNow();
    expect(router.navigate).toHaveBeenCalledWith(['/signup/register']);
  });
});
