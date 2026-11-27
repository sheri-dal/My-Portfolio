import { Directive, ElementRef, Input, PLATFORM_ID, inject, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Animates a numeric-looking string (e.g. "10+", "4+", "3") from 0 up to its
 * value once scrolled into view. Non-numeric strings (e.g. "Trusted") are
 * left untouched — the host's own text is restored as-is.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnChanges, OnDestroy {
  @Input('appCountUp') value = '';
  @Input() countDurationMs = 1400;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private started = false;

  ngOnInit(): void {
    const el = this.element.nativeElement;
    el.textContent = this.value;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const match = /^(\d+)(.*)$/.exec(this.value.trim());
    if (!match) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.started) {
            this.started = true;
            this.animateTo(Number(match[1]), match[2]);
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(el);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['value'] || changes['value'].isFirstChange()) {
      return;
    }
    this.element.nativeElement.textContent = this.value;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animateTo(target: number, suffix: string): void {
    const el = this.element.nativeElement;
    const start = performance.now();
    const duration = this.countDurationMs;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };
    requestAnimationFrame(tick);
  }
}
