import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface Project {
  readonly id: string;
  readonly title: string;
  readonly timeframe: string;
  readonly summary?: string;
  readonly longDescription?: string;
  readonly contributions?: readonly string[];
  readonly technologies?: readonly string[];
  readonly role?: string;
  readonly impact?: string;
  readonly tech?: readonly string[];
  readonly demoUrl?: string;
  readonly repoUrl?: string;
  readonly image?: string;
}

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzGridModule, NzTagModule, NzIconModule],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSectionComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  readonly sectionHeading = 'Selected Client Engagements';

  readonly projects: readonly Project[] = [
    {
      id: 'logistic-hub',
      title: 'Logistic Hub',
      timeframe: '04/2025 – Present',
      role: 'Tech Lead & Solution Architect',
      longDescription:
        'Enterprise logistics and transportation management platform that streamlines shipment operations and automates workflows. Led architecture and development of scalable backend services, secure authentication, and workflow modules for logistics and supply chain operations.',
      contributions: [
        'Designed and implemented scalable RESTful APIs.',
        'Architected authentication and authorization using JWT-based security.',
        'Developed business workflow and operational management modules.',
        'Optimized database performance and API response times.',
        'Established deployment and infrastructure strategies.',
      ],
      technologies: ['.NET Core', 'SQL Server', 'Docker', 'Azure', 'JWT Authentication', 'REST APIs'],
      demoUrl: '#',
      image: 'assets/projects/logistic-hub.png',
    },
    {
      id: '7ag-food-distribution',
      title: '7AG Food Distribution',
      timeframe: '2025 – Present',
      role: 'Full-Stack Developer',
      longDescription:
        'Food distribution and sales-management platform for distributors, sales agents, and retail partners. Built order management, inventory tracking, delivery workflows, and automation to increase operational efficiency across the distribution lifecycle.',
      contributions: [
        'Developed mobile and backend application features.',
        'Implemented order processing and inventory management workflows.',
        'Built secure APIs and business service layers.',
        'Integrated real-time notifications and user management features.',
        'Contributed to system optimization and ongoing platform enhancements.',
      ],
      technologies: ['Flutter', '.NET Core', 'SQL Server', 'Entity Framework Core', 'GetX', 'REST APIs', 'Firebase Cloud Messaging', 'JWT Authentication'],
      demoUrl: '#',
      image: 'assets/projects/7AG.png',
    },
    {
      id: 'sa-pos',
      title: 'SA-POS (Enterprise Point of Sale)',
      timeframe: '01/2023 – 12/2024',
      role: 'Software Engineer',
      longDescription:
        'Enterprise Point-of-Sale solution integrated with ERP systems and designed for offline-first retail environments. Enables uninterrupted transactions, local persistence, and reliable synchronization between distributed stores and central systems.',
      contributions: [
        'Implemented offline-first architecture and synchronization workflows.',
        'Developed transaction processing and inventory management modules.',
        'Integrated POS operations with ERP systems.',
        'Optimized local storage and background synchronization processes.',
        'Enhanced system reliability for low-connectivity environments.',
      ],
      technologies: ['Flutter', 'SQLite', 'REST APIs', 'ERP Integration', 'Offline Synchronization'],
      demoUrl: '#',
      image: 'assets/projects/POS.png',
    },
    {
      id: 'order-booker',
      title: 'Order Booker',
      timeframe: '2023',
      role: 'Mobile Application Developer',
      longDescription:
        'Sales-force automation and order-management app for field teams. Provides customer management, product catalog, order booking, and reliable synchronization between mobile devices and central systems.',
      contributions: [
        'Developed mobile application features and user workflows.',
        'Implemented offline order processing capabilities.',
        'Designed synchronization mechanisms for reliable data transfer.',
        'Enhanced application performance and usability for field operations.',
      ],
      technologies: ['Flutter', 'SQLite', 'REST APIs', 'Offline Storage', 'Data Synchronization'],
      demoUrl: '#',
      image: 'assets/projects/ordre-booker-app.png',
    },
    {
      id: 'splendid-accounts',
      title: 'Splendid Accounts (ERP Integration)',
      timeframe: '2022 – 2024',
      role: 'Backend Developer & Integration Engineer',
      longDescription:
        'ERP and accounting integration work focused on financial operations, inventory management, and automation. Delivered secure integration services and reliable data-exchange workflows between enterprise systems and external applications.',
      contributions: [
        'Developed integration services and backend APIs.',
        'Implemented inventory and accounting synchronization workflows.',
        'Automated reconciliation and data processing operations.',
        'Improved reliability and consistency of enterprise data exchange.',
      ],
      technologies: ['.NET Core', 'C#', 'SQL Server', 'Entity Framework Core', 'REST APIs', 'ERP Integration'],
      demoUrl: '#',
      image: 'assets/projects/splendid.png',
    },
    {
      id: 'paymytuition',
      title: 'PayMyTuition',
      timeframe: '12/2024 – 02/2025',
      role: 'Software Engineer (Feature Development)',
      longDescription:
        'Contributed feature development and frontend integration for an international tuition-payment platform. Improved user experience, workflow efficiency, and platform reliability across payment flows.',
      contributions: [
        'Developed and integrated frontend features.',
        'Improved payment workflow usability and reliability.',
        'Collaborated with cross-functional teams on platform enhancements.',
        'Supported testing and quality assurance initiatives.',
      ],
      technologies: ['Frontend Development', 'API Integration', 'Payment Systems', 'Testing & Quality Assurance'],
      demoUrl: '#',
      image: 'assets/projects/pay-my-tuition.png',
    },
  ];

  ngOnInit(): void {
    this.title.setTitle('Projects — ' + 'Sheheryar Hussain');
    this.meta.updateTag({ name: 'description', content: 'Selected projects and case studies: Logistic Hub, SA-POS, Order Booker, Splendid Accounts, PayMyTuition.' });

    // JSON-LD for projects (SoftwareApplication / Project snippets)
    try {
      const ldId = 'projects-ld-json';
      const existing = this.doc.getElementById(ldId) as HTMLScriptElement | null;
      const projectSchemas = this.projects.map(p => ({
        '@type': 'SoftwareApplication',
        name: p.title,
        description: p.summary,
        applicationCategory: 'BusinessApplication',
        url: p.demoUrl || p.repoUrl || this.doc.location?.origin || '',
      }));

      const container = {
        '@context': 'https://schema.org',
        '@graph': projectSchemas,
      };

      const json = JSON.stringify(container, null, 2);
      if (existing) existing.textContent = json;
      else {
        const script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = ldId;
        script.text = json;
        this.doc.head.appendChild(script);
      }
    } catch {
      // non-blocking
    }
  }
}
