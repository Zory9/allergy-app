import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OpenAiService } from './openai.service';
import { HttpService } from './@backend/services/http.service';
import { of } from 'rxjs';

describe('OpenAiService', () => {
  let service: OpenAiService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const httpServiceMock = jasmine.createSpyObj('HttpService', [
      'askAIText',
      'askAIImage',
      'askAIGenerateRecipe',
      'askAIModifyRecipe',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useValue: httpServiceMock }],
    });

    service = TestBed.inject(OpenAiService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call askAIText and return the response', async () => {
    const mockResponse = { answer: { content: 'Example AI response text' } };
    httpServiceSpy.askAIText.and.returnValue(of(mockResponse));

    const result = await service.askText('Can I eat this food?', 'peanuts');
    expect(result).toBe('Example AI response text');
    expect(httpServiceSpy.askAIText).toHaveBeenCalledWith('Can I eat this food?', 'peanuts');
  });

  it('should call askAIImage and return the response', async () => {
    const mockResponse = { answer: { content: 'Example AI image response' } };
    httpServiceSpy.askAIImage.and.returnValue(of(mockResponse));

    const result = await service.askImage('imageData', 'peanuts');
    expect(result).toBe('Example AI image response');
    expect(httpServiceSpy.askAIImage).toHaveBeenCalledWith('imageData', 'peanuts');
  });

  it('should call askAIGenerateRecipe and return the response', async () => {
    const mockResponse = { recipe: 'Generated Recipe' };
    httpServiceSpy.askAIGenerateRecipe.and.returnValue(of(mockResponse));

    const result = await service.generateRecipe('peanuts', 'tomatoes', 'Italian', 'dinner', '30 minutes');
    expect(result).toEqual(mockResponse);
    expect(httpServiceSpy.askAIGenerateRecipe).toHaveBeenCalledWith(
      'peanuts',
      'tomatoes',
      'Italian',
      'dinner',
      '30 minutes'
    );
  });

  it('should call askAIModifyRecipe and return the response', async () => {
    const mockResponse = { modifiedRecipe: 'Modified Recipe' };
    httpServiceSpy.askAIModifyRecipe.and.returnValue(of(mockResponse));

    const result = await service.modifyRecipe('peanuts', 'Original Recipe');
    expect(result).toEqual(mockResponse);
    expect(httpServiceSpy.askAIModifyRecipe).toHaveBeenCalledWith('peanuts', 'Original Recipe');
  });

  it('should throw an error if askAIText fails', async () => {
    httpServiceSpy.askAIText.and.returnValue(of(Promise.reject('Error')));

    try {
      await service.askText('What is AI?', 'peanuts');
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBe('Error');
    }
  });

  it('should throw an error if askAIImage fails', async () => {
    httpServiceSpy.askAIImage.and.returnValue(of(Promise.reject('Error')));

    try {
      await service.askImage('imageData', 'peanuts');
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBe('Error');
    }
  });
});
