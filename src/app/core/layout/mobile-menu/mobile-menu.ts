import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, inject, input, signal } from '@angular/core';
import { DOCUMENT, NgOptimizedImage, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DownloadCvButtonComponent } from '../../../shared/ui/download-cv-button/download-cv-button';
import { ThemeToggleComponent } from '../../../shared/ui/theme-toggle/theme-toggle';
import { NAV_LINKS } from '../navbar/nav-links';
import { auditTime, filter, fromEvent, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterModule, NgOptimizedImage, NzIconModule, ThemeToggleComponent, DownloadCvButtonComponent],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  readonly visible = input(true);

  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly drawerRef = inject(NzDrawerRef<MobileMenuComponent>);

  readonly links = NAV_LINKS;
  readonly currentFragment = signal('home');

  protected readonly activeOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'exact',
  } as const;

  constructor() {
    this.syncCurrentFragment();
    this.setupScrollSpy();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.syncCurrentFragment());
  }

  onClose(): void {
    this.drawerRef.close();
  }

  onNavigate(fragment: string, event?: Event): void {
    event?.preventDefault();
    this.currentFragment.set(fragment);

    void this.router.navigate(['/'], { fragment }).then(() => {
      this.drawerRef.afterClose.pipe(take(1)).subscribe(() => {
        this.scrollToFragment(fragment);
      });

      this.drawerRef.close();
    });
  }

  private scrollToFragment(fragment: string): void {
    this.viewportScroller.scrollToAnchor(fragment);

    if (isPlatformBrowser(this.platformId)) {
      this.document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private syncCurrentFragment(): void {
    const routeFragment = this.router.parseUrl(this.router.url).fragment;

    if (routeFragment) {
      this.currentFragment.set(routeFragment);
      return;
    }

    this.syncCurrentFragmentFromViewport();
  }

  private setupScrollSpy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    fromEvent(window, 'scroll')
      .pipe(auditTime(60), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncCurrentFragmentFromViewport());

    queueMicrotask(() => this.syncCurrentFragmentFromViewport());
  }

  private syncCurrentFragmentFromViewport(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const existingFragments = this.links
      .map((link) => link.fragment)
      .filter((fragment) => !!this.document.getElementById(fragment));

    if (!existingFragments.length) {
      this.currentFragment.set('home');
      return;
    }

    const probeY = window.scrollY + 110;
    let active = existingFragments[0];

    for (const fragment of existingFragments) {
      const element = this.document.getElementById(fragment);
      if (!element) {
        continue;
      }

      const sectionTop = element.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= probeY) {
        active = fragment;
      }
    }

    this.currentFragment.set(active);
    this.syncUrlFragment(active);
  }

  private syncUrlFragment(fragment: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const nextUrl = `${window.location.pathname}${window.location.search}${fragment === 'home' ? '' : `#${fragment}`}`;

    if (window.location.href.endsWith(fragment === 'home' ? window.location.pathname + window.location.search : `#${fragment}`)) {
      return;
    }

    window.history.replaceState(window.history.state, '', nextUrl);
  }
}
