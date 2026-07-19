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
    seoTitle: 'Sheheryar Hussain | Full-Stack .NET, Angular & Flutter Engineer',
    seoDescription:
      'Full-Stack Software Engineer in Nuremberg specializing in .NET Core, Angular, Flutter, SQL Server, scalable APIs, offline-first apps, and enterprise integrations.',
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
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: this.profile.seoTitle });
    this.meta.updateTag({ property: 'twitter:description', content: this.profile.seoDescription });
    this.meta.updateTag({ property: 'twitter:image', content: absoluteImageUrl });
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
