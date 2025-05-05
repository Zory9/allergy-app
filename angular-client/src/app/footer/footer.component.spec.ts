import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { FooterComponent } from './footer.component';
import { UserService } from '../user.service';
import { BehaviorSubject } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(true);

    mockUserService = jasmine.createSpyObj('UserService', [], {
      isLoggedIn$: isLoggedInSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FooterComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoggedIn to true when user is logged in', () => {
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should display the correct links when user is logged in', () => {
    const linkDes = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    const analyzeLinkDe = linkDes.find(
      (de) => de.nativeElement.textContent.trim() === 'Анализ на храни'
    );

    const routerLinkInstance = analyzeLinkDe.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['./analyze']);
    expect(routerLinkInstance['href']).toEqual('/analyze');
  });

  it('should display signup links when user is not logged in', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
  
    const linkDes = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    const analyzeLinkDe = linkDes.find(
      (de) => de.nativeElement.textContent.trim() === 'Анализ на храни'
    );
    const routerLinkInstance = analyzeLinkDe.injector.get(RouterLinkWithHref);
  
    expect(routerLinkInstance['commands']).toEqual(['./signup/register']);
  });
});
