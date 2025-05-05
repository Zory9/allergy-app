import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraMobileComponent } from './camera-mobile.component';

describe('CameraMobileComponent', () => {
  let component: CameraMobileComponent;
  let fixture: ComponentFixture<CameraMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
