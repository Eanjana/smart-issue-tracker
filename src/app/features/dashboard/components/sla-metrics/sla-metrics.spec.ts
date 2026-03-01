import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaMetrics } from './sla-metrics';

describe('SlaMetrics', () => {
  let component: SlaMetrics;
  let fixture: ComponentFixture<SlaMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlaMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
