import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RecipesComponent } from './recipes.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;
  let router: Router;
  let events: Subject<{}>;

  beforeEach(async () => {
    events = new Subject<{}>();

    await TestBed.configureTestingModule({
      declarations: [RecipesComponent],
      imports: [RouterTestingModule, ButtonsModule, IconsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: [{ value: '/recipes', writable: true }] },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    Object.defineProperty(router, 'url', { value: '/recipes/generate', writable: true });
  
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
   
    spyOn(router, 'navigate');
    spyOn(router.events, 'pipe').and.returnValue(events.asObservable());
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize buttons with correct properties', () => {
    expect(component.buttons.length).toBe(2);
    expect(component.buttons[0].text).toBe('Генерирай рецепта');
    expect(component.buttons[0].route).toBe('generate');
    expect(component.buttons[1].text).toBe('Модифицирай рецепта');
    expect(component.buttons[1].route).toBe('substitute');
  });

  it('should navigate to the correct route on selectedChange()', () => {
    component.selectedChange(component.buttons[0]);
    expect(router.navigate).toHaveBeenCalledWith(['generate'], { relativeTo: jasmine.any(Object) });

    component.selectedChange(component.buttons[1]);
    expect(router.navigate).toHaveBeenCalledWith(['substitute'], { relativeTo: jasmine.any(Object) });
  });

  it('should update button selection correctly in manageButtonSelection()', () => {
    component.manageButtonSelection('generate');
    expect(component.buttons[0].selected).toBeTrue();
    expect(component.buttons[1].selected).toBeFalse();

    component.manageButtonSelection('substitute');
    expect(component.buttons[0].selected).toBeFalse();
    expect(component.buttons[1].selected).toBeTrue();
  });

  it('should update button selection on router events', () => {
    events.next(new NavigationEnd(1, '/recipes', '/recipes/generate'));
    fixture.detectChanges();
    expect(component.buttons[0].selected).toBeTrue();
    expect(component.buttons[1].selected).toBeFalse();
  });
});
