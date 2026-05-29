import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [NzIconModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly label = computed(() => (this.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
  readonly icon = computed(() => (this.theme() === 'dark' ? 'sun' : 'moon'));

  toggle(): void {
    // debug: log theme change intent
    // eslint-disable-next-line no-console
    console.log('[ThemeToggle] before toggle, theme=', this.theme());
    this.themeService.toggleTheme();
    // eslint-disable-next-line no-console
    console.log('[ThemeToggle] after toggle, theme=', this.theme());
  }
}
