import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnalyzeComponent } from './analyze.component';
import { UserService } from '../user.service';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { IconsModule } from '@progress/kendo-angular-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TextCompletionComponent } from '../text-completion/text-completion.component';
import { ImageCompletionComponent } from '../image-completion/image-completion.component';
import { ConversationalUIModule } from '@progress/kendo-angular-conversational-ui';

describe('AnalyzeComponent', () => {
  let component: AnalyzeComponent;
  let fixture: ComponentFixture<AnalyzeComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAllergy']);
    mockUserService.getAllergy.and.returnValue(Promise.resolve('Peanuts,Milk'));

    TestBed.configureTestingModule({
      declarations: [
        AnalyzeComponent,
        TextCompletionComponent,
        ImageCompletionComponent,
      ],
      imports: [
        TabStripModule,
        LabelModule,
        FormFieldModule,
        IconsModule,
        ConversationalUIModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AnalyzeComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize allergies from UserService', async () => {
    await fixture.whenStable().then(() => {
      expect(mockUserService.getAllergy).toHaveBeenCalled();
      expect(component.allergies).toEqual(['Peanuts', 'Milk']);
    });
  });

  it('should render allergies in the template', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const allergyTags = element.querySelectorAll('.allergy-tag');
    expect(allergyTags.length).toBe(2);
    expect(allergyTags[0].textContent).toContain('Peanuts');
    expect(allergyTags[1].textContent).toContain('Milk');
  });

  it('should display icons correctly', () => {
    expect(component.commentIcon).toBeDefined();
    expect(component.cameraIcon).toBeDefined();
    expect(component.imageAddIcon).toBeDefined();
    expect(component.sparklesIcon).toBeDefined();
    expect(component.warningTriangleIcon).toBeDefined();
  });
});
