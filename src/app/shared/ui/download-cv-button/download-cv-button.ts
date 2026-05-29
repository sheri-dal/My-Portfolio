import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-download-cv-button',
  imports: [NzIconModule],
  templateUrl: './download-cv-button.html',
  styleUrl: './download-cv-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadCvButtonComponent {
  readonly href = input('/assets/CV/Sheheryar_Hussain_CV.pdf');
  readonly fileName = input('Sheheryar_Hussain_CV.pdf');
  readonly label = input('Download CV');
  readonly fullWidth = input(false);
}