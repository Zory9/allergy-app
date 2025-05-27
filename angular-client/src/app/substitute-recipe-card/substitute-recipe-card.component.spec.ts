import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstituteRecipeCardComponent } from './substitute-recipe-card.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IconsModule } from '@progress/kendo-angular-icons';

describe('SubstituteRecipeCardComponent', () => {
  let component: SubstituteRecipeCardComponent;
  let fixture: ComponentFixture<SubstituteRecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubstituteRecipeCardComponent],
      imports: [LayoutModule, IconsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SubstituteRecipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded state and button text when toggleRecipe is called', () => {
    expect(component.expanded).toBeFalse();
    expect(component.btnText).toBe('Виж стъпките за приготвяне');

    component.toggleRecipe();
    expect(component.expanded).toBeTrue();
    expect(component.btnText).toBe('Скрий');

    component.toggleRecipe();
    expect(component.expanded).toBeFalse();
    expect(component.btnText).toBe('Виж стъпките за приготвяне');
  });

  it('should parse description into steps correctly', () => {
    component.description = '1. Step one\n2. Step two\n3. Step three';
    const parsedSteps = component.parsedSteps;
    expect(parsedSteps).toEqual(['Step one', 'Step two', 'Step three']);
  });

  it('should display the correct icon when expanded state changes', () => {
    expect(component.moreIcon).toBe(component.moreIcon);

    component.toggleRecipe();
    expect(component.moreIcon).toBe(component.chevronUpIcon);

    component.toggleRecipe();
    expect(component.moreIcon).toBe(component.moreIcon);
  });

  it('should render the name, short description, and cook time', () => {
    component.name = 'Test Recipe';
    component.shortDesc = 'This is a test recipe.';
    component.cookTime = '30 minutes';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.recipe-name')?.textContent).toContain('Test Recipe');
    expect(compiled.querySelector('.recipe-meta')?.textContent).toContain('30 minutes');
    expect(compiled.querySelector('.short-desc')?.textContent).toContain('This is a test recipe.');
  });

  it('should render ingredients with allergen and replacement information', () => {
    component.ingredients = [
      { original: 'Milk', isAllergen: true, replacement: 'Almond Milk', quantity: '1 cup' },
      { original: 'Sugar', isAllergen: false, quantity: '2 tbsp' },
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const ingredientItems = compiled.querySelectorAll('.recipe-ingredients li');

    expect(ingredientItems.length).toBe(2);
    expect(ingredientItems[0].textContent).toContain('Milk');
    expect(ingredientItems[0].textContent).toContain('Заместител: Almond Milk');
    expect(ingredientItems[1].textContent).toContain('Sugar');
    expect(ingredientItems[1].textContent).not.toContain('Заместител');
  });
});
