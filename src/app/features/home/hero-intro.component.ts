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
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

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
  readonly focusAreas: readonly string[];
  readonly proofPoints: readonly { value: string; label: string }[];
  // readonly stats: readonly HeroStat[];
  readonly darkBackgroundImagePath: string;
  readonly lightBackgroundImagePath: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
}

@Component({
  selector: 'app-hero-intro',
  imports: [NzBadgeModule, NzIconModule, AboutSectionComponent, SkillsSectionComponent, ExperienceSectionComponent, ProjectsSectionComponent, ContactSectionComponent, TranslatePipe],
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
      'I design and deliver production-ready web, mobile, and backend systems for complex business workflows—from scalable .NET APIs to offline-first Flutter applications and ERP integrations.',
    primaryCtaText: 'View My Work',
    primaryCtaUrl: '#projects',
    secondaryCtaText: 'Get In Touch',
    secondaryCtaUrl: '#contact',
    socialLinks: [
      { label: 'GitHub', url: CONTACT.github, nzIcon: 'github' },
      { label: 'LinkedIn', url: CONTACT.linkedIn, nzIcon: 'linkedin' },
      { label: 'Email', url: `mailto:${CONTACT.email}`, nzIcon: 'mail' },
    ],
    focusAreas: ['.NET Core & C#', 'Angular', 'Flutter', 'System Architecture'],
    proofPoints: [
      { value: '4+', label: 'Years building products' },
      { value: '10+', label: 'Projects delivered' },
      { value: '3', label: 'Platforms: web, mobile & API' },
    ],
    darkBackgroundImagePath: 'assets/icons/Hero-sec-img.png',
    lightBackgroundImagePath: 'assets/icons/Hero-sec-img-light.png',
    seoTitle: 'Sheheryar Hussain | Full-Stack .NET, Angular & Flutter Developer in Nuremberg',
    seoDescription:
      'Sheheryar Hussain, Full-Stack Software Engineer in Nuremberg (Nürnberg), Germany: .NET Core / C#, ASP.NET Core APIs, Angular, Flutter and SQL Server for ERP, POS and logistics systems. Available for jobs and freelance projects.',
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
      : `https://sheri-dal.github.io/My-Portfolio/${activeBackgroundImagePath}`;

    this.title.setTitle(this.profile.seoTitle);
    this.meta.updateTag({ name: 'description', content: this.profile.seoDescription });
    this.meta.updateTag({ property: 'og:title', content: this.profile.seoTitle });
    this.meta.updateTag({ property: 'og:description', content: this.profile.seoDescription });
    this.meta.updateTag({ property: 'og:image', content: absoluteImageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: `${this.profile.fullName} hero background` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://sheri-dal.github.io/My-Portfolio/' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Sheheryar Hussain Portfolio' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.profile.seoTitle });
    this.meta.updateTag({ name: 'twitter:description', content: this.profile.seoDescription });
    this.meta.updateTag({ name: 'twitter:image', content: absoluteImageUrl });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    const canonicalUrl = isPlatformBrowser(this.platformId)
      ? new URL('.', this.document.baseURI).toString()
      : 'https://sheri-dal.github.io/My-Portfolio/';
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // JSON-LD Person + WebSite. Runs on the server too, so the prerendered HTML
    // that crawlers read already contains it (not only after JavaScript runs).
    try {
      const ldId = 'hero-ld-json';
      const siteUrl = 'https://sheri-dal.github.io/My-Portfolio/';
      const sameAs = this.profile.socialLinks
        .map(s => s.url)
        .filter(u => u.startsWith('http'));
      const graph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': `${siteUrl}#person`,
            name: this.profile.fullName,
            jobTitle: this.profile.jobTitle,
            description: this.profile.seoDescription,
            url: siteUrl,
            image: `${siteUrl}assets/icons/logo.png`,
            email: `mailto:${CONTACT.email}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Nürnberg',
              addressRegion: 'Bayern',
              addressCountry: 'DE',
            },
            alumniOf: {
              '@type': 'CollegeOrUniversity',
              name: 'ILMA University',
            },
            knowsLanguage: ['English', 'Urdu', 'German'],
            knowsAbout: [
              'C#', '.NET Core', 'ASP.NET Core', 'REST APIs', 'Entity Framework',
              'SQL Server', 'Angular', 'TypeScript', 'Flutter', 'Dart',
              'Offline-first mobile apps', 'ERP integration', 'Docker', 'Azure', 'CI/CD',
            ],
            sameAs,
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}#website`,
            url: siteUrl,
            name: 'Sheheryar Hussain Portfolio',
            inLanguage: 'en',
            publisher: { '@id': `${siteUrl}#person` },
          },
        ],
      };
      const json = JSON.stringify(graph);
      const existing = this.document.getElementById(ldId) as HTMLScriptElement | null;
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
