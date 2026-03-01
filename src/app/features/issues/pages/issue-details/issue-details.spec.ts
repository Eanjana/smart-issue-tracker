import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetails } from './issue-details';

describe('IssueDetails', () => {
  let component: IssueDetails;
  let fixture: ComponentFixture<IssueDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
