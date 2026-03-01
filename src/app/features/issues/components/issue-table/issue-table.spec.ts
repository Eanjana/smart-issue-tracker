import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTable } from './issue-table';

describe('IssueTable', () => {
  let component: IssueTable;
  let fixture: ComponentFixture<IssueTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
