import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { GenerateRecipeComponent } from './generate-recipe.component';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

describe('GenerateRecipeComponent', () => {
  let component: GenerateRecipeComponent;
  let fixture: ComponentFixture<GenerateRecipeComponent>;
  let mockOpenAiService: jasmine.SpyObj<OpenAiService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    mockOpenAiService = jasmine.createSpyObj('OpenAiService', [
      'generateRecipe',
    ]);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllergy']);
    mockUserService.getAllergy.and.returnValue(Promise.resolve('Яйца,Мляко'));

    TestBed.configureTestingModule({
      declarations: [GenerateRecipeComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        LabelModule,
        InputsModule,
        DropDownsModule,
        ButtonsModule,
        IconsModule,
      ],
      providers: [
        { provide: OpenAiService, useValue: mockOpenAiService },
        { provide: UserService, useValue: mockUserService },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize allergies from UserService', async () => {
    await fixture.whenStable().then(() => {
      expect(mockUserService.getAllergy).toHaveBeenCalled();
      expect(component.allergies).toEqual(['Яйца', 'Мляко']);
    });
  });

  it('should mark form as touched and not call generateRecipe if form is invalid', () => {
    spyOn(component.recipeForm, 'markAllAsTouched');
    component.generateRecipe();
    expect(component.recipeForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockOpenAiService.generateRecipe).not.toHaveBeenCalled();
  });

  it('should call OpenAiService.generateRecipe if form is valid', async () => {
    component.recipeForm.setValue({
      cuisine: 'Италианска',
      mealtype: 'Обяд',
      cooktime: '30 минути',
      ingredients: 'домати, босилек',
    });
    mockOpenAiService.generateRecipe.and.returnValue(
      Promise.resolve({
        recipes: [
          {
            name: 'Паста',
            shortDesc: 'Вкусна паста',
            cookTime: '30 минути',
            description: 'Вкусна паста с домати и босилек',
          },
        ],
      })
    );

    component.generateRecipe();
    expect(component.loading).toBeTrue();
    await fixture.whenStable();
    expect(mockOpenAiService.generateRecipe).toHaveBeenCalledWith(
      'Яйца, Мляко',
      'домати, босилек',
      'Италианска',
      'Обяд',
      '30 минути'
    );
    expect(component.recipeCards.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should reset the form when clearForm is called', () => {
    spyOn(component.recipeForm, 'reset');
    component.clearForm();
    expect(component.recipeForm.reset).toHaveBeenCalled();
  });

  it('should clear recipeCards when backToForm is called', () => {
    component.recipeCards = [
      {
        name: 'Паста',
        shortDesc: 'Вкусна паста',
        time: '30 минути',
        description: 'Вкусна паста с домати и босилек',
      },
    ];
    component.backToForm();
    expect(component.recipeCards.length).toBe(0);
  });
});
