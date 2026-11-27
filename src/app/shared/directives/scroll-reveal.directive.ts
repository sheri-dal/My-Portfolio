import { Directive, ElementRef, PLATFORM_ID, inject, input, output, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adds `.is-visible` to the host once it scrolls into view, triggering the
 * fade/slide-up CSS defined for `.scroll-reveal` in styles.scss, and emits
 * `appScrollRevealed` once so components can drive their own JS animations
 * (e.g. animating a skill bar's width) off the same trigger.
 * Falls back to immediately-visible on the server and for reduced-motion users.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
  host: {
    class: 'scroll-reveal',
  },
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  /** Optional stagger delay in ms, applied as a CSS custom property. Accepts a bare
   *  attribute (`appScrollReveal`, which Angular passes as `""`) or a bound number. */
  readonly revealDelay = input<number | string>(0, { alias: 'appScrollReveal' });
  readonly appScrollRevealed = output<void>();

  ngOnInit(): void {
    const el = this.element.nativeElement;

    if (!isPlatformBrowser(this.platformId)) {
      el.classList.add('is-visible');
      this.appScrollRevealed.emit();
      return;
    }

    const delay = Number(this.revealDelay()) || 0;
    if (delay) {
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    }

    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      this.appScrollRevealed.emit();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            this.appScrollRevealed.emit();
            this.observer?.unobserve(el);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
