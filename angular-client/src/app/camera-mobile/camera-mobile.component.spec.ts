import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraMobileComponent } from './camera-mobile.component';

describe('CameraMobileComponent', () => {
  let component: CameraMobileComponent;
  let fixture: ComponentFixture<CameraMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraMobileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.capturedImage).toBe('');
    expect(component.showCaptureButton).toBeTrue();
  });

  it('should emit imageReady and update capturedImage when a valid image is selected', () => {
    spyOn(component.imageReady, 'emit');
  
    const event = {
      target: {
        files: [new Blob(['dummy content'], { type: 'image/png' })]
      }
    } as unknown as Event;
  
    const mockReader = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onloadend: () => {},
      result: 'data:image/png;base64,dummycontent',
    };
  
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);
  
    component.onFileSelected(event);
    mockReader.onloadend();

    expect(component.capturedImage).toBe('data:image/png;base64,dummycontent');
    expect(component.imageReady.emit).toHaveBeenCalledWith('data:image/png;base64,dummycontent');
    expect(component.showCaptureButton).toBeFalse();
  });

  it('should not update capturedImage if no file is selected', () => {
    const mockEvent = { target: { files: [] } } as unknown as Event;
    spyOn(console, 'warn');

    component.onFileSelected(mockEvent);

    expect(console.warn).toHaveBeenCalledWith('No file selected.');
    expect(component.capturedImage).toBe('');
    expect(component.showCaptureButton).toBeTrue();
  });

  it('should not update capturedImage if selected file is not an image', () => {
    const mockEvent = {
      target: {
        files: [new Blob([''], { type: 'text/plain' })]
      }
    } as unknown as Event;
    spyOn(console, 'warn');

    component.onFileSelected(mockEvent);

    expect(console.warn).toHaveBeenCalledWith('Selected file is not an image.');
    expect(component.capturedImage).toBe('');
    expect(component.showCaptureButton).toBeTrue();
  });
});
