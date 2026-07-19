import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

/** Data models used by the About section — keep the UI fully data-driven */
export interface AboutMetric {
  readonly value: string;
  readonly label: string;
}

export interface AboutValue {
  readonly name: string;
  readonly description: string;
  readonly nzIcon: string;
}

export interface CareerMilestone {
  readonly year: string;
  readonly companyTitle: string;
  readonly roleDescription: string;
}

@Component({
  selector: 'app-about-section',
  imports: [NzIconModule],
  templateUrl: './about-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSectionComponent {
  readonly sectionHeading = 'About Me';

  readonly mainParagraphs = [
    'Results-driven Full-Stack Software Engineer with 4+ years of experience building scalable enterprise-grade web, mobile, and backend systems using .NET Core, C#, Flutter, and SQL Server. I deliver end-to-end solutions including APIs, offline-first mobile apps, and ERP integrations.',
    'I balance strong software architecture and engineering practices with practical delivery — owning features end-to-end, optimizing performance, and mentoring junior engineers in Agile teams.',
  ] as const;

  readonly metrics = [
    { value: '4+', label: 'Years of Experience' },
    { value: '10+', label: 'Projects Delivered' },
    { value: '2+', label: 'Leadership & Mentoring' },
    { value: 'Trusted', label: 'Freelance & Enterprise Work' },
  ] as readonly AboutMetric[];

  readonly coreValues: readonly AboutValue[] = [
    { name: 'Leadership', description: 'Led cross-functional teams to deliver product outcomes.', nzIcon: 'team' },
    { name: 'Ownership', description: 'Drive initiatives end-to-end from idea to production.', nzIcon: 'user' },
    { name: 'Impact Driven', description: 'Prioritize measurable business impact and quality.', nzIcon: 'rocket' },
  ];

readonly careerMilestones: readonly CareerMilestone[] = [
  {
    year: '04/2025 – Present',
    companyTitle: 'Freelance Full-Stack Software Engineer',
    roleDescription: 'Lead full-stack projects; architecture, APIs, and performance optimization.'
  },
  {
    year: '04/2025 – Present',
    companyTitle: 'Software Developer (Remote) @ I-SPLENDID',
    roleDescription: 'Built cross-platform apps and backend APIs with offline sync.'
  },
  {
    year: '12/2024 – 02/2025',
    companyTitle: 'Software Engineer @ Hub 360',
    roleDescription: 'Worked on payment features and integrations.'
  },
  {
    year: '01/2023 – 12/2024',
    companyTitle: 'Software Developer @ I-SPLENDID',
    roleDescription: 'Led development of an offline-capable POS integrated with ERP.'
  },
  {
    year: '07/2022 – 12/2022',
    companyTitle: 'Dot Net Developer @ Objectual Systems LTD',
    roleDescription: 'Built and optimized backend services for high-concurrency systems.'
  },
  {
    year: '10/2021 – 06/2022',
    companyTitle: 'Dot Net Developer @ Office Automation Service',
    roleDescription: 'Implemented .NET Core APIs for logistics automation.'
  }
];

  // Expose a computed flag for layout tweaks if needed in future
  readonly hasMilestones = computed(() => this.careerMilestones.length > 0);
}
