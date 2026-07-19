import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface SkillCategory {
  readonly title: string;
  readonly description: string;
  readonly proficiencyLabel: string;
  readonly proficiency: number;
  readonly icon: string;
  readonly skills: string[];
}

@Component({
  selector: 'app-skills-section',
  imports: [NzIconModule],
  templateUrl: './skills-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsSectionComponent {
  readonly sectionHeading: string = 'Technical Expertise';

  readonly introParagraphs: string[] = [
    'I build scalable digital products across frontend interfaces, backend services, and operational infrastructure with a strong focus on maintainability and delivery speed.',
    'My capability set combines architecture thinking, implementation discipline, and product-first execution to deliver performant systems that support real business growth.',
  ];

  readonly supportPoints: string[] = [
    'Designing robust frontend systems with Angular, Tailwind, and accessibility-first patterns.',
    'Developing secure backend APIs and business services for enterprise workflows.',
    'Operationalizing deployments through CI/CD, observability, and cloud-native practices.',
  ];

  readonly categories: SkillCategory[] = [
    {
      title: 'Frontend Engineering',
      description: 'Modern UI architecture, reusable design systems, and responsive user experiences.',
      proficiencyLabel: 'Advanced',
      proficiency: 94,
      icon: 'appstore',
      skills: ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS', 'Ng-Zorro', 'Responsive Design'],
    },
    {
      title: 'Mobile & Cross-Platform',
      description: 'Cross-platform mobile applications with offline-first patterns and performant native-like UX.',
      proficiencyLabel: 'Advanced',
      proficiency: 90,
      icon: 'mobile',
      skills: ['Flutter', 'Dart', 'GetX', 'Offline-First', 'SQLite', 'Cross-Platform UI'],
    },
    {
      title: 'Backend & APIs',
      description: 'High-performance service development, integration patterns, and secure API design.',
      proficiencyLabel: 'Advanced',
      proficiency: 91,
      icon: 'api',
      skills: ['.NET Core', 'ASP.NET MVC', 'REST APIs', 'Auth & RBAC', 'Integration Services', 'Caching'],
    },
    {
      title: 'Cloud & DevOps',
      description: 'Deployment automation and production-readiness for reliable software delivery.',
      proficiencyLabel: 'Strong',
      proficiency: 87,
      icon: 'cloud',
      skills: ['Docker', 'CI/CD Pipelines', 'Azure', 'Linux', 'Release Strategies', 'Monitoring'],
    },
    {
      title: 'Databases & Persistence',
      description: 'Schema design, query optimization, and persistence strategies for scalable data layers.',
      proficiencyLabel: 'Strong',
      proficiency: 89,
      icon: 'database',
      skills: ['SQL Server', 'PostgreSQL', 'MongoDB', 'Entity Framework', 'Indexing', 'Data Modeling'],
    },
    {
      title: 'Architecture & Quality',
      description: 'Engineering standards, code quality practices, and long-term maintainability.',
      proficiencyLabel: 'Advanced',
      proficiency: 90,
      icon: 'code',
      skills: ['Clean Architecture', 'SOLID Principles', 'Testing Strategy', 'Code Reviews', 'Performance Tuning', 'Refactoring'],
    },
    {
      title: 'Tooling & Delivery',
      description: 'Developer tooling and workflow orchestration that accelerates product iteration.',
      proficiencyLabel: 'Strong',
      proficiency: 86,
      icon: 'tool',
      skills: ['GitHub Actions', 'Postman', 'Swagger', 'VS Code', 'Linting', 'Automation Scripts'],
    },
  ];

}
