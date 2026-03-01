import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueKanban } from './issue-kanban';

describe('IssueKanban', () => {
  let component: IssueKanban;
  let fixture: ComponentFixture<IssueKanban>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueKanban]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueKanban);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
