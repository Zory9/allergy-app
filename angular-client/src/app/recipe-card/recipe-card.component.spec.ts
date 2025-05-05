import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RecipeCardComponent } from './recipe-card.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IconsModule } from '@progress/kendo-angular-icons';

describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCardComponent],
      imports: [LayoutModule, IconsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded state and button text on toggleRecipe()', () => {
    expect(component.expanded).toBeFalse();
    expect(component.btnText).toBe('Виж цялата рецепта');

    component.toggleRecipe();
    expect(component.expanded).toBeTrue();
    expect(component.btnText).toBe('Скрий');

    component.toggleRecipe();
    expect(component.expanded).toBeFalse();
    expect(component.btnText).toBe('Виж цялата рецепта');
  });

  it('should display the correct parsed steps', () => {
    component.description = '1. Step one\n2. Step two\n3. Step three';
    fixture.detectChanges();

    const parsedSteps = component.parsedSteps;
    expect(parsedSteps).toEqual(['Step one', 'Step two', 'Step three']);
  });

  it('should render name, shortDesc, and cookTime correctly', () => {
    component.name = 'Test Recipe';
    component.shortDesc = 'This is a short description';
    component.cookTime = '30 mins';
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('.recipe-name')).nativeElement;
    const shortDescElement = fixture.debugElement.query(By.css('.short-desc')).nativeElement;
    const cookTimeElement = fixture.debugElement.query(By.css('.time-info i')).nativeElement;

    expect(nameElement.textContent).toContain('Test Recipe');
    expect(shortDescElement.textContent).toContain('This is a short description');
    expect(cookTimeElement.textContent).toContain('30 mins');
  });

  it('should toggle recipe steps visibility on button click', () => {
    component.description = '1. Step one\n2. Step two';
    const button = fixture.debugElement.query(By.css('.toggle-button')).nativeElement;

    expect(component.expanded).toBeFalse();
    button.click();
    fixture.detectChanges();
    expect(component.expanded).toBeTrue();

    button.click();
    fixture.detectChanges();
    expect(component.expanded).toBeFalse();
  });

  it('should display steps when expanded is true', () => {
    component.description = '1. Step one\n2. Step two';
    component.expanded = true;
    fixture.detectChanges();

    const steps = fixture.debugElement.queryAll(By.css('.recipe-steps li'));
    expect(steps.length).toBe(2);
    expect(steps[0].nativeElement.textContent).toContain('Step one');
    expect(steps[1].nativeElement.textContent).toContain('Step two');
  });
});
