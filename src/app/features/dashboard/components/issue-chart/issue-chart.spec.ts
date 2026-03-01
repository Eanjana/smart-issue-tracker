import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueChart } from './issue-chart';

describe('IssueChart', () => {
  let component: IssueChart;
  let fixture: ComponentFixture<IssueChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
