import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCompletionComponent } from './image-completion.component';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { ConversationalUIModule } from '@progress/kendo-angular-conversational-ui';
import { FileSelectModule } from '@progress/kendo-angular-upload';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CameraComponent } from '../camera/camera.component';
import { CameraMobileComponent } from '../camera-mobile/camera-mobile.component';

describe('ImageCompletionComponent', () => {
  let component: ImageCompletionComponent;
  let fixture: ComponentFixture<ImageCompletionComponent>;
  let mockOpenAiService: jasmine.SpyObj<OpenAiService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockOpenAiService = jasmine.createSpyObj('OpenAiService', ['askImage']);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllergy']);

    mockUserService.getAllergy.and.returnValue(Promise.resolve('Яйца,Мляко'));

    await TestBed.configureTestingModule({
      declarations: [ImageCompletionComponent, CameraComponent, CameraMobileComponent],
      imports: [ConversationalUIModule, FileSelectModule, HttpClientTestingModule],
      providers: [
        { provide: OpenAiService, useValue: mockOpenAiService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize allergies on component creation', async () => {
    await fixture.whenStable();
    expect(component.allergies).toEqual(['Яйца', 'Мляко']);
  });

  it('should set isMobile based on screen size', () => {
    expect(component.isMobile).toBe(
      window.matchMedia('only screen and (max-width: 786px)').matches
    );
  });

  it('should handle file selection and convert to base64', async () => {
    const event = {
      files: [
        {
          rawFile: new Blob(['dummy content'], { type: 'image/png' }),
          validationErrors: null,
        },
      ],
    } as any;
  
    const mockReader = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onloadend: () => {},
      result: 'data:image/png;base64,dummycontent',
    };
  
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);
  
    component.onSelect(event);
    mockReader.onloadend();
  
    expect(component.uploadSuccess).toBeTrue();
    expect(component.base64img).toBe('data:image/png;base64,dummycontent');
  });

  it('should reset state on remove', () => {
    component.uploadSuccess = true;
    component.base64img = 'someImageData';
    component.onRemove();
    expect(component.uploadSuccess).toBeFalse();
    expect(component.base64img).toBe('');
    expect(component.showCameraWrapper).toBeTrue();
  });

  it('should call askAIImage and update promptOutputs', async () => {
    component.base64img = 'base64Image';
    component.allergies = ['Яйца', 'Мляко'];
    const mockResponse = JSON.stringify({ keyword: 'test', details: 'details' });
    mockOpenAiService.askImage.and.returnValue(Promise.resolve(mockResponse));

    component.analyzeImage();
    await fixture.whenStable();

    expect(mockOpenAiService.askImage).toHaveBeenCalledWith('base64Image', 'Яйца, Мляко');
    expect(component.promptOutputs.length).toBe(1);
    expect(component.promptOutputs[0].title).toBe('TEST');
    expect(component.promptOutputs[0].output).toBe('details');
    expect(component.loading).toBeFalse();
    expect(component.activeView).toBe(2);
  });

  it('should reset state on retry prompt request', () => {
    component.uploadSuccess = true;
    component.showAnalyzeButton = true;
    component.base64img = 'someImageData';
    component.activeView = 2;

    component.onPromptRequest({ isRetry: true } as any);

    expect(component.uploadSuccess).toBeFalse();
    expect(component.showAnalyzeButton).toBeFalse();
    expect(component.base64img).toBe('');
    expect(component.activeView).toBe(0);
    expect(component.promptOutputs.length).toBe(0);
  });

  it('should open the camera when openCamera is called', () => {
    component.openCamera();
    expect(component.showCamera).toBeTrue();
  });

  it('should handle image ready event', () => {
    component.onImageReady('base64Image');
    expect(component.base64img).toBe('base64Image');
    expect(component.showAnalyzeButton).toBeTrue();
  });

  it('should handle mobile image ready event', () => {
    component.onImageReadyMobile('base64Image');
    expect(component.base64img).toBe('base64Image');
    expect(component.showAnalyzeButton).toBeTrue();
    expect(component.showMobileInput).toBeTrue();
  });

  it('should clear uploaded files', () => {
    const mockFileSelect = jasmine.createSpyObj('FileSelectComponent', ['clearFiles']);
    component.clearUploadFiles(mockFileSelect);
    expect(mockFileSelect.clearFiles).toHaveBeenCalled();
    expect(component.uploadSuccess).toBeFalse();
    expect(component.showCameraWrapper).toBeTrue();
  });
});
