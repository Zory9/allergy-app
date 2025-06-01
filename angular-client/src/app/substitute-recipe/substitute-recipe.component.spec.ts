import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SubstituteRecipeComponent } from './substitute-recipe.component';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

describe('SubstituteRecipeComponent', () => {
  let component: SubstituteRecipeComponent;
  let fixture: ComponentFixture<SubstituteRecipeComponent>;
  let mockOpenAiService: jasmine.SpyObj<OpenAiService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockOpenAiService = jasmine.createSpyObj('OpenAiService', ['modifyRecipe']);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllergy']);
    mockUserService.getAllergy.and.returnValue(Promise.resolve('nuts, dairy'));

    await TestBed.configureTestingModule({
      declarations: [SubstituteRecipeComponent],
      imports: [
        ReactiveFormsModule,
        LabelModule,
        InputsModule,
        IconsModule,
        ButtonsModule,
      ],
      providers: [
        { provide: OpenAiService, useValue: mockOpenAiService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubstituteRecipeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize allergies from user service', async () => {
    await fixture.whenStable();
    expect(component.allergies).toEqual(['nuts', 'dairy']);
  });

  it('should mark form as touched and not call modifyRecipe if form is invalid', () => {
    spyOn(component.recipeForm, 'markAllAsTouched');
    component.modifyRecipe();
    expect(component.recipeForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockOpenAiService.modifyRecipe).not.toHaveBeenCalled();
  });

  it('should call OpenAiService.modifyRecipe if form is valid', async () => {
    component.recipeForm.setValue({ recipe: 'Pasta with cheese' });
    mockOpenAiService.modifyRecipe.and.returnValue(
      Promise.resolve({
        modifiedRecipe: {
          name: 'Modified Recipe',
          shortDesc: 'Example description',
          time: '30 minutes',
          ingredients: [],
          description: 'First instruction.\nSecond instruction.',
        },
      })
    );

    component.modifyRecipe();
    expect(component.loading).toBeTrue();
    await fixture.whenStable();
    expect(mockOpenAiService.modifyRecipe).toHaveBeenCalledWith(
      'nuts, dairy',
      'Pasta with cheese'
    );
    expect(component.modifiedRecipeCard).toEqual({
      name: 'Modified Recipe',
      shortDesc: 'Example description',
      time: '30 minutes',
      ingredients: [],
      description: 'First instruction.\nSecond instruction.',
    });
    expect(component.loading).toBeFalse();
  });

  it('should reset the form when clearForm is called', () => {
    component.recipeForm.setValue({ recipe: 'Pasta with cheese' });
    component.clearForm();
    expect(component.recipeForm.value.recipe).toBeNull();
  });

  it('should reset modifiedRecipeCard when backToForm is called', () => {
    component.modifiedRecipeCard = { name: 'Modified Recipe' } as any;
    component.backToForm();
    expect(component.modifiedRecipeCard).toBeUndefined();
  });
});
