import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface StatGridItem {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-stat-grid',
  templateUrl: './stat-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatGridComponent {
  readonly items = input<readonly StatGridItem[]>([]);
}
