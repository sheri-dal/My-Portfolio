import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface CareerMilestone {
  readonly year: string;
  readonly title: string;
  readonly subtitle: string;
}

@Component({
  selector: 'app-career-timeline',
  templateUrl: './career-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerTimelineComponent {
  readonly items = input<readonly CareerMilestone[]>([]);
}
