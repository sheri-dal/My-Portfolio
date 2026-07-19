import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.html',
  styleUrl: './language-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageToggleComponent {
  readonly language = inject(LanguageService);
}
