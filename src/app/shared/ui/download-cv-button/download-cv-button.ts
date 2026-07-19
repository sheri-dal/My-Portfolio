import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-download-cv-button',
  imports: [NzIconModule, TranslatePipe],
  templateUrl: './download-cv-button.html',
  styleUrl: './download-cv-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadCvButtonComponent {
  private readonly language = inject(LanguageService);

  readonly href = input<string | null>(null);
  readonly fileName = input<string | null>(null);
  readonly label = input('Download CV');
  readonly fullWidth = input(false);

  readonly downloadHref = computed(() =>
    this.href() ??
    (this.language.current() === 'de'
      ? 'assets/CV/Sheheryar_Hussain_Lebenslauf_DE.pdf'
      : 'assets/CV/Sheheryar_Hussain_CV.pdf'),
  );

  readonly downloadFileName = computed(() =>
    this.fileName() ??
    (this.language.current() === 'de'
      ? 'Sheheryar_Hussain_Lebenslauf_DE.pdf'
      : 'Sheheryar_Hussain_CV_EN.pdf'),
  );
}
