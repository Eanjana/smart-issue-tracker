import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  viewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { ChartConfig, ChartDataPoint } from '../../models/dashboard.interface';
import { scaleBand, scaleLinear, select } from 'd3';

/**
 * @description Renders a D3 bar chart from a ChartConfig input.
 * Redraws automatically via effect() whenever the config signal changes.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-issue-chart',
  imports: [],
  templateUrl: './issue-chart.html',
  styleUrl: './issue-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueChart {
  //input from parent component - dashboard component
  config = input.required<ChartConfig>();

  // values in chartConfig - changes according to config input
  title = computed(() => this.config().title);
  chartType = computed(() => this.config().type);
  data = computed(() => this.config().data);

  //access svg element from template
  private svgElement = viewChild<ElementRef<SVGSVGElement>>('chartSvg');

  //chart
  private readonly width = 800;
  private readonly height = 300;
  private readonly margin = { top: 20, right: 20, bottom: 40, left: 50 };

  constructor() {
    effect(() => {
      const chartData = this.data();
      const svg = this.svgElement();
      const type = this.chartType();

      if (chartData && svg) {
        if (type === 'bar') {
          this.drawBarChart(chartData, svg.nativeElement);
        }
      }
    });
  }

  //Chart D3 drawing bar chart logic
  private drawBarChart(chartData: ChartDataPoint[], svgElement: SVGSVGElement): void {
    // select SVG & Clear previous chart
    const svg = select(svgElement);
    svg.selectAll('*').remove();

    //chart size - giving space for margins from total width and height
    const chartWidth = this.width - this.margin.left - this.margin.right;
    const chartHeight = this.height - this.margin.top - this.margin.bottom;

    // group <g> inside svg to move and draw chart to right and down according to margins
    const chart = svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // X - axis
    const x = scaleBand()
      .domain(chartData.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    // Y - axis
    const maxValue = Math.max(...chartData.map((d) => d.value));
    const y = scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([chartHeight, 0]);

    // Draw bars
    chart
      .selectAll('rect')
      .data(chartData) // jan 15 etc.
      .join('rect')
      .attr('x', (d) => x(d.label)!)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth()) //total width divided by number of bars (12 months)
      .attr('height', (d) => chartHeight - y(d.value))
      .attr('fill', (d) => d.color || 'var(--clr-teal-500)')
      .attr('rx', 4) // rounded corners
      .style('opacity', 0.9)

      //hover effects
      .on('mouseenter', function (event, d) {
        select(this)
          .style('opacity', 1)
          .attr('fill', d.color ? d.color : 'var(--clr-teal-400)');
      })
      .on('mouseleave', function (event, d) {
        select(this)
          .style('opacity', 0.9)
          .attr('fill', d.color || 'var(--clr-teal-500)');
      });

    // Add value labels on top of bars
    chart
      .selectAll('text.value-label')
      .data(chartData)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', (d) => x(d.label)! + x.bandwidth() / 2) // move text to center of bar
      .attr('y', (d) => y(d.value) - 5) // position text above bar
      .attr('text-anchor', 'middle') //center's text
      .attr('fill', 'var(--clr-text-secondary)')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text((d) => d.value); // the value on top of bar

    // Add labels under bars - months
    const xAxis = chart.append('g').attr('transform', `translate(0, ${chartHeight})`);

    chartData.forEach((d) => {
      xAxis
        .append('text')
        .attr('x', x(d.label)! + x.bandwidth() / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--clr-text-secondary)')
        .attr('font-size', '13px')
        .text(d.label);
    });

    // Y-axis grid lines
    const yTicks = y.ticks(5);
    yTicks.forEach((tick) => {
      chart
        .append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', y(tick))
        .attr('y2', y(tick))
        .attr('stroke', 'var(--clr-border-subtle)')
        .attr('stroke-dasharray', '2,2');
    });
  }
}
