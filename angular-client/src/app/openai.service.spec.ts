import { TestBed } from '@angular/core/testing';

import { OpenAiService } from './openai.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpenAiService', () => {
  let service: OpenAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(OpenAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
