import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  readonly eyebrow = input<string>('');
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly headingId = input<string>('');
}
