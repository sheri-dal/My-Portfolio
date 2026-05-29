import { ChangeDetectionStrategy, Component } from '@angular/core';

interface WorkHistoryItem {
  readonly dateRange: string;
  readonly roleTitle: string;
  readonly company: string;
  readonly description: string;
  readonly tags: readonly string[];
}

@Component({
  selector: 'app-experience-section',
  templateUrl: './experience-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSectionComponent {
  readonly sectionHeading: string = 'Experience';

readonly workHistory: readonly WorkHistoryItem[] = [
    {
      dateRange: '04/2025 – Present',
      roleTitle: 'Freelance Full-Stack Software Engineer',
      company: 'Logistic Hub (Freelance)',
      description:
        'Designed and developed a complete logistics management platform using .NET Core and SQL Server. Built scalable REST APIs, authentication, and workflow modules. Managed deployment, VPS hosting, and CI/CD pipelines while optimizing API performance for high-volume workflows.',
      tags: ['.NET Core', 'C#', 'SQL Server', 'APIs', 'Deployment', 'Performance'],
    },
    {
      dateRange: '04/2025 – Present',
      roleTitle: 'Software Developer (Remote)',
      company: 'I-SPLENDID',
      description:
        'Develop cross-platform applications with Flutter and backend APIs in .NET Core. Implement offline-first patterns, synchronization strategies, and enterprise integrations.',
      tags: ['Flutter', 'Dart', '.NET Core', 'Offline Sync', 'API Design'],
    },
    {
      dateRange: '12/2024 – 02/2025',
      roleTitle: 'Software Engineer',
      company: 'Hub 360',
      description:
        'Contributed to PayMyTuition platform features, worked on integrations, testing, and frontend improvements focused on user experience.',
      tags: ['Frontend', 'Integration', 'Testing'],
    },
    {
      dateRange: '01/2023 – 12/2024',
      roleTitle: 'Software Developer',
      company: 'I-SPLENDID',
      description:
        'Led development of SA-POS, an enterprise offline Point-of-Sale solution integrated with ERP systems. Implemented synchronization strategies and optimized application architecture for high throughput.',
      tags: ['Flutter', 'Offline Sync', 'ERP Integration', 'SQL Server'],
    },
    {
      dateRange: '07/2022 – 12/2022',
      roleTitle: 'Dot Net Developer',
      company: 'Objectual Systems LTD',
      description:
        'Built backend services for high-concurrency platforms and optimized server-side components for performance and scalability.',
      tags: ['.NET Core', 'C#', 'Performance'],
    },
    {
      dateRange: '10/2021 – 06/2022',
      roleTitle: 'Dot Net Developer',
      company: 'Office Automation Service',
      description:
        'Implemented .NET Core APIs for shipping automation and package tracking systems, optimizing database queries and background processing workflows.',
      tags: ['.NET Core', 'Web API', 'SQL Server'],
    }
  ];
}