import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../../core/services/theme.service';
import { AboutSectionComponent } from '../about';
import { ExperienceSectionComponent } from '../experience';
import { SkillsSectionComponent } from '../skills';
import { ContactSectionComponent } from '../contact/contact-section.component';
import { ProjectsSectionComponent } from '../projects/projects-section.component';
import { CONTACT } from '../../shared/contact.constants';

interface HeroSocialLink {
  readonly label: string;
  readonly url: string;
  readonly nzIcon: string;
}

// interface HeroStat {
//   readonly value: string;
//   readonly label: string;
// }

interface HeroProfile {
  readonly badgeText: string;
  readonly salutation: string;
  readonly fullName: string;
  readonly jobTitle: string;
  readonly bioDescription: string;
  readonly primaryCtaText: string;
  readonly primaryCtaUrl: string;
  readonly secondaryCtaText: string;
  readonly secondaryCtaUrl: string;
  readonly socialLinks: readonly HeroSocialLink[];
  // readonly stats: readonly HeroStat[];
  readonly darkBackgroundImagePath: string;
  readonly lightBackgroundImagePath: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
}

@Component({
  selector: 'app-hero-intro',
  imports: [NzBadgeModule, NzIconModule, AboutSectionComponent, SkillsSectionComponent, ExperienceSectionComponent, ProjectsSectionComponent, ContactSectionComponent],
  templateUrl: './hero-intro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroIntroComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      this.syncSeoMetadata();
    });
  }

  readonly profile: HeroProfile = {
    badgeText: 'Available for new opportunities',
    salutation: 'Hello, I am',
    fullName: 'Sheheryar Hussain',
    jobTitle: 'Full-Stack Software Engineer',
    bioDescription:
      'Results-driven Full-Stack Software Engineer with 4+ years building scalable enterprise-grade web, mobile, and backend systems using .NET Core, C#, Flutter, and SQL Server. Experienced in ERP-integrated platforms, logistics systems, offline-first applications, and high-performance APIs used in production. Strong background in software architecture, authentication, data synchronization, and cross-platform development. Currently based in Nürnberg, Germany — improving German (A1).',
    primaryCtaText: 'View My Work',
    primaryCtaUrl: '#projects',
    secondaryCtaText: 'Get In Touch',
    secondaryCtaUrl: '#contact',
    socialLinks: [
      { label: 'GitHub', url: CONTACT.github, nzIcon: 'github' },
      { label: 'LinkedIn', url: CONTACT.linkedIn, nzIcon: 'linkedin' },
      { label: 'Email', url: `mailto:${CONTACT.email}`, nzIcon: 'mail' },
    ],
    darkBackgroundImagePath: '/assets/icons/Hero-sec-img.png',
    lightBackgroundImagePath: '/assets/icons/Hero-sec-img-light.png',
    seoTitle: 'Sheheryar Hussain | Full-Stack Software Engineer',
    seoDescription:
      'Full-Stack Software Engineer (.NET Core, C#, Flutter, SQL Server) — building enterprise web and mobile systems.',
  };

  readonly backgroundImage = computed(() =>
    this.isDark()
      ? `url('${this.profile.darkBackgroundImagePath}')`
      : `url('${this.profile.lightBackgroundImagePath}')`,
  );

  ngOnInit(): void {
    this.syncSeoMetadata();
  }

  private syncSeoMetadata(): void {
    const activeBackgroundImagePath = this.theme() === 'dark'
      ? this.profile.darkBackgroundImagePath
      : this.profile.lightBackgroundImagePath;

    const absoluteImageUrl = isPlatformBrowser(this.platformId)
      ? new URL(activeBackgroundImagePath, this.document.baseURI).toString()
      : activeBackgroundImagePath;

    this.title.setTitle(this.profile.seoTitle);
    this.meta.updateTag({ name: 'description', content: this.profile.seoDescription });
    this.meta.updateTag({ property: 'og:title', content: this.profile.seoTitle });
    this.meta.updateTag({ property: 'og:description', content: this.profile.seoDescription });
    this.meta.updateTag({ property: 'og:image', content: absoluteImageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: `${this.profile.fullName} hero background` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });

    // Inject or update JSON-LD structured data for improved SEO (Person)
    if (isPlatformBrowser(this.platformId)) {
      try {
        const ldId = 'hero-ld-json';
        const existing = this.document.getElementById(ldId) as HTMLScriptElement | null;
        const sameAs = this.profile.socialLinks.map(s => s.url);
        const personSchema = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: this.profile.fullName,
          jobTitle: this.profile.jobTitle,
          description: this.profile.seoDescription,
          url: this.document.baseURI,
          sameAs,
        };

        const json = JSON.stringify(personSchema, null, 2);

        if (existing) {
          existing.textContent = json;
        } else {
          const script = this.document.createElement('script');
          script.type = 'application/ld+json';
          script.id = ldId;
          script.textContent = json;
          this.document.head.appendChild(script);
        }
      } catch {
        // non-blocking: best-effort JSON-LD injection
      }
    }
  }
}