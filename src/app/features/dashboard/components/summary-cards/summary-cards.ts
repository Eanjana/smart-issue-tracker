import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SummaryCardData } from '../../models/dashboard.interface';

@Component({
  selector: 'app-summary-cards',
  imports: [],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCards {
  //input signal to receive data
  cards = input.required<SummaryCardData[]>();

}
