import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextCompletionComponent } from './text-completion.component';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { ConversationalUIModule, PromptRequestEvent } from '@progress/kendo-angular-conversational-ui';

describe('TextCompletionComponent', () => {
  let component: TextCompletionComponent;
  let fixture: ComponentFixture<TextCompletionComponent>;
  let mockOpenAiService: jasmine.SpyObj<OpenAiService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockOpenAiService = jasmine.createSpyObj('OpenAiService', ['askText']);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllergy']);
    mockUserService.getAllergy.and.returnValue(Promise.resolve('nuts, dairy'));

    await TestBed.configureTestingModule({
      declarations: [TextCompletionComponent],
      imports: [ConversationalUIModule],
      providers: [
        { provide: OpenAiService, useValue: mockOpenAiService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextCompletionComponent);
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

  it('should reset activeView and promptOutputs on retry', () => {
    component.activeView = 2;
    component.promptOutputs = [{ id: 1, prompt: 'Test', title: 'TEST', output: 'Output' }];
    const event: PromptRequestEvent = { sender: null, isRetry: true, prompt: '' };

    component.onPromptRequest(event);

    expect(component.activeView).toBe(0);
    expect(component.promptOutputs).toEqual([]);
  });

  it('should call askAIText on non-retry prompt request', () => {
    spyOn(component as any, 'askAIText');
    const event: PromptRequestEvent = { sender: null, isRetry: false, prompt: 'Test prompt' };

    component.onPromptRequest(event);

    expect((component as any).askAIText).toHaveBeenCalledWith(event);
  });

  it('should call OpenAiService.askText and update promptOutputs', async () => {
    const mockResponse = JSON.stringify({ keyword: 'Test', details: 'Test details' });
    mockOpenAiService.askText.and.returnValue(Promise.resolve(mockResponse));
    component.allergies = ['nuts', 'dairy'];
    const event: PromptRequestEvent = { sender: null, isRetry: false, prompt: 'Test prompt' };

    (component as any).askAIText(event);

    expect(component.loading).toBeTrue();
    expect(component.activeView).toBe(1);
    await fixture.whenStable();

    expect(mockOpenAiService.askText).toHaveBeenCalledWith('Test prompt', 'nuts, dairy');
    expect(component.promptOutputs.length).toBe(1);
    expect(component.promptOutputs[0].title).toBe('TEST');
    expect(component.promptOutputs[0].output).toBe('Test details');
    expect(component.loading).toBeFalse();
    expect(component.activeView).toBe(2);
  });

  it('should not call OpenAiService.askText if prompt is empty', () => {
    const event: PromptRequestEvent = { sender: null, isRetry: false, prompt: '' };

    (component as any).askAIText(event);

    expect(mockOpenAiService.askText).not.toHaveBeenCalled();
  });

  it('should render prompt suggestions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const suggestions = component.promptSuggestions;

    suggestions.forEach((suggestion) => {
      expect(compiled.textContent).toContain(suggestion);
    });
  });
});
