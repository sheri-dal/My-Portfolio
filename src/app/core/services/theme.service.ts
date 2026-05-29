import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'portfolio-theme';

  readonly theme = signal<AppTheme>('light');

  constructor() {
    const initialTheme = this.readInitialTheme();
    this.theme.set(initialTheme);
    this.applyTheme(initialTheme);
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
    this.persistTheme(nextTheme);
  }

  private readInitialTheme(): AppTheme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'dark';
    }

    const stored = window.localStorage.getItem(this.storageKey);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return 'dark';
  }

  private applyTheme(theme: AppTheme): void {
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
  }

  private persistTheme(theme: AppTheme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem(this.storageKey, theme);
  }
}
