import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { DOCUMENT, NgOptimizedImage, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule, NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { auditTime, filter, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeToggleComponent } from '../../../shared/ui/theme-toggle/theme-toggle';
import { DownloadCvButtonComponent } from '../../../shared/ui/download-cv-button/download-cv-button';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu';
import { NAV_LINKS } from './nav-links';
import { LanguageToggleComponent } from '../../../shared/ui/language-toggle/language-toggle';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    NgOptimizedImage,
    NzIconModule,
    NzDrawerModule,
    ThemeToggleComponent,
    DownloadCvButtonComponent,
    LanguageToggleComponent,
    TranslatePipe,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly drawerService = inject(NzDrawerService);
  private readonly viewportScroller = inject(ViewportScroller);
  private mobileDrawerRef: NzDrawerRef<MobileMenuComponent> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  @ViewChildren('navLink') private readonly navLinkElements!: QueryList<ElementRef<HTMLAnchorElement>>;

  readonly links = NAV_LINKS;
  readonly mobileOpen = signal(false);
  readonly currentFragment = signal('home');
  readonly indicatorStyle = signal<{ left: string; width: string; opacity: number }>({ left: '0px', width: '0px', opacity: 0 });

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

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.navLinkElements.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateIndicator());
    queueMicrotask(() => this.updateIndicator());

    fromEvent(window, 'resize')
      .pipe(auditTime(120), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateIndicator());
  }

  onNavigate(fragment: string, event?: Event): void {
    event?.preventDefault();
    this.currentFragment.set(fragment);
    this.updateIndicator();

    void this.router.navigate(['/'], { fragment }).then(() => {
      this.scrollToFragment(fragment);
    });
  }

  private scrollToFragment(fragment: string): void {
    // ViewportScroller's offset (set globally in App) keeps sections clear of the
    // floating navbar; scrollToAnchor already scrolls smoothly via CSS `scroll-behavior`.
    this.viewportScroller.scrollToAnchor(fragment);
  }

  openMobileMenu(): void {
    if (this.mobileDrawerRef) {
      return;
    }

    this.mobileOpen.set(true);
    this.mobileDrawerRef = this.drawerService.create<MobileMenuComponent>({
      nzContent: MobileMenuComponent,
      nzPlacement: 'right',
      nzWidth: '100vw',
      nzClosable: false,
      nzMaskClosable: true,
      nzKeyboard: true,
      nzCloseOnNavigation: true,
      nzBodyStyle: {
        padding: '0',
        height: '100%',
        overflow: 'hidden',
        background: 'transparent',
      },
      nzWrapClassName: 'portfolio-mobile-drawer',
      nzZIndex: 1200,
    });

    this.mobileDrawerRef.afterClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.mobileOpen.set(false);
      this.mobileDrawerRef = null;
    });
  }

  closeMobileMenu(): void {
    this.mobileDrawerRef?.close();
    this.mobileOpen.set(false);
  }

  private syncCurrentFragment(): void {
    const routeFragment = this.router.parseUrl(this.router.url).fragment;

    if (routeFragment) {
      this.currentFragment.set(routeFragment);
      this.updateIndicator();
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

    fromEvent(window, 'resize')
      .pipe(auditTime(120), takeUntilDestroyed(this.destroyRef))
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
      this.updateIndicator();
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
    this.updateIndicator();
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

  /** Measures the active nav link's position so the sliding pill indicator can follow it. */
  private updateIndicator(): void {
    if (!isPlatformBrowser(this.platformId) || !this.navLinkElements) {
      return;
    }

    const activeFragment = this.currentFragment();
    const activeIndex = this.links.findIndex((link) => link.fragment === activeFragment);
    const activeEl = this.navLinkElements.get(activeIndex)?.nativeElement;

    if (!activeEl) {
      this.indicatorStyle.set({ left: '0px', width: '0px', opacity: 0 });
      return;
    }

    this.indicatorStyle.set({
      left: `${activeEl.offsetLeft}px`,
      width: `${activeEl.offsetWidth}px`,
      opacity: 1,
    });
  }
}
