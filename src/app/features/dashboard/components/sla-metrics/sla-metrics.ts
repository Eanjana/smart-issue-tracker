import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SLAMetric } from '../../models/dashboard.interface';

@Component({
  selector: 'app-sla-metrics',
  imports: [],
  templateUrl: './sla-metrics.html',
  styleUrl: './sla-metrics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaMetrics {
  metrics = input.required<SLAMetric[]>();

}
