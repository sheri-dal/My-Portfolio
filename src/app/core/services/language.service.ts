import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

export type AppLanguage = 'en' | 'de';

const GERMAN: Record<string, string> = {
  Home: 'Start',
  About: 'Über mich',
  Skills: 'Kenntnisse',
  Projects: 'Projekte',
  Experience: 'Erfahrung',
  Contact: 'Kontakt',
  'Download CV': 'Lebenslauf herunterladen',
  'Available for new opportunities': 'Offen für neue Möglichkeiten',
  'Hello, I am': 'Hallo, ich bin',
  'Full-Stack Software Engineer': 'Full-Stack Softwareentwickler',
  'building dependable digital products.': 'entwickelt zuverlässige digitale Produkte.',
  'View My Work': 'Meine Projekte',
  'Get In Touch': 'Kontakt aufnehmen',
  '.NET Core & C#': '.NET Core & C#',
  Angular: 'Angular',
  Flutter: 'Flutter',
  'System Architecture': 'Systemarchitektur',
  '4+': '4+',
  'Years building products': 'Jahre Produktentwicklung',
  '10+': '10+',
  'Projects delivered': 'Projekte umgesetzt',
  'Platforms: web, mobile & API': 'Plattformen: Web, Mobile & API',
  'Based in Nuremberg, Germany': 'Standort Nürnberg, Deutschland',
  'Available for full-time roles, product collaborations, and high-impact freelance work.':
    'Verfügbar für Festanstellungen, Produktkooperationen und ausgewählte Freelance-Projekte.',
  'I design and deliver production-ready web, mobile, and backend systems for complex business workflows—from scalable .NET APIs to offline-first Flutter applications and ERP integrations.':
    'Ich konzipiere und entwickle produktionsreife Web-, Mobile- und Backend-Systeme für komplexe Geschäftsprozesse – von skalierbaren .NET-APIs bis zu Offline-First-Flutter-Apps und ERP-Integrationen.',
  'About Me': 'Über mich',
  Leadership: 'Führung',
  Ownership: 'Verantwortung',
  'Impact Driven': 'Wirkungsorientiert',
  'Years of Experience': 'Jahre Erfahrung',
  'Projects Delivered': 'Projekte umgesetzt',
  'Leadership & Mentoring': 'Führung & Mentoring',
  'Freelance & Enterprise Work': 'Freelance & Enterprise',
  'Career Journey': 'Beruflicher Werdegang',
  'Results-driven Full-Stack Software Engineer with 4+ years of experience building scalable enterprise-grade web, mobile, and backend systems using .NET Core, C#, Flutter, and SQL Server. I deliver end-to-end solutions including APIs, offline-first mobile apps, and ERP integrations.':
    'Ergebnisorientierter Full-Stack-Softwareentwickler mit über vier Jahren Erfahrung in skalierbaren Web-, Mobile- und Backend-Systemen mit .NET Core, C#, Flutter und SQL Server. Ich liefere End-to-End-Lösungen einschließlich APIs, Offline-First-Apps und ERP-Integrationen.',
  'I balance strong software architecture and engineering practices with practical delivery — owning features end-to-end, optimizing performance, and mentoring junior engineers in Agile teams.':
    'Ich verbinde solide Softwarearchitektur und Engineering-Praktiken mit pragmatischer Umsetzung, übernehme Features Ende-zu-Ende, optimiere Performance und unterstütze Junior-Entwickler in agilen Teams.',
  'Led cross-functional teams to deliver product outcomes.': 'Leitung funktionsübergreifender Teams zur erfolgreichen Produktumsetzung.',
  'Drive initiatives end-to-end from idea to production.': 'Verantwortung für Initiativen von der Idee bis zum Produktivbetrieb.',
  'Prioritize measurable business impact and quality.': 'Fokus auf messbaren Geschäftsnutzen und Qualität.',
  Capabilities: 'Kompetenzen',
  'Technical Expertise': 'Technische Expertise',
  Advanced: 'Fortgeschritten',
  Strong: 'Sehr gut',
  'Frontend Engineering': 'Frontend-Entwicklung',
  'Mobile & Cross-Platform': 'Mobile & Cross-Platform',
  'Backend & APIs': 'Backend & APIs',
  'Cloud & DevOps': 'Cloud & DevOps',
  'Databases & Persistence': 'Datenbanken & Persistenz',
  'Architecture & Quality': 'Architektur & Qualität',
  'Tooling & Delivery': 'Tools & Delivery',
  'I build scalable digital products across frontend interfaces, backend services, and operational infrastructure with a strong focus on maintainability and delivery speed.':
    'Ich entwickle skalierbare digitale Produkte über Frontend, Backend-Services und Betriebsinfrastruktur hinweg – mit Fokus auf Wartbarkeit und schnelle Auslieferung.',
  'My capability set combines architecture thinking, implementation discipline, and product-first execution to deliver performant systems that support real business growth.':
    'Meine Kompetenzen verbinden Architekturdenken, disziplinierte Umsetzung und Produktorientierung für leistungsfähige Systeme, die nachhaltiges Wachstum unterstützen.',
  'Designing robust frontend systems with Angular, Tailwind, and accessibility-first patterns.':
    'Robuste Frontend-Systeme mit Angular, Tailwind und barrierefreien Designmustern.',
  'Developing secure backend APIs and business services for enterprise workflows.':
    'Sichere Backend-APIs und Business-Services für Enterprise-Prozesse.',
  'Operationalizing deployments through CI/CD, observability, and cloud-native practices.':
    'Zuverlässige Deployments durch CI/CD, Observability und Cloud-native Praktiken.',
  'Modern UI architecture, reusable design systems, and responsive user experiences.':
    'Moderne UI-Architektur, wiederverwendbare Designsysteme und responsive Nutzererlebnisse.',
  'Cross-platform mobile applications with offline-first patterns and performant native-like UX.':
    'Plattformübergreifende Mobile-Apps mit Offline-First-Ansätzen und nativer User Experience.',
  'High-performance service development, integration patterns, and secure API design.':
    'Leistungsfähige Services, Integrationsmuster und sicheres API-Design.',
  'Deployment automation and production-readiness for reliable software delivery.':
    'Deployment-Automatisierung und Produktionsreife für zuverlässige Softwarebereitstellung.',
  'Schema design, query optimization, and persistence strategies for scalable data layers.':
    'Schemadesign, Abfrageoptimierung und Persistenzstrategien für skalierbare Datenschichten.',
  'Engineering standards, code quality practices, and long-term maintainability.':
    'Engineering-Standards, Codequalität und langfristige Wartbarkeit.',
  'Developer tooling and workflow orchestration that accelerates product iteration.':
    'Entwicklerwerkzeuge und Workflows für schnellere Produktiterationen.',
  Work: 'Projekte',
  'Selected Client Engagements': 'Ausgewählte Kundenprojekte',
  'Key Contributions': 'Wichtige Beiträge',
  Technologies: 'Technologien',
  'View Live Platform': 'Live-Plattform öffnen',
  'View on Google Play': 'Bei Google Play ansehen',
  'Tech Lead & Solution Architect': 'Tech Lead & Lösungsarchitekt',
  'Full-Stack Developer': 'Full-Stack-Entwickler',
  'Software Engineer': 'Softwareentwickler',
  'Mobile Application Developer': 'Mobile-App-Entwickler',
  'Backend Developer & Integration Engineer': 'Backend- & Integrationsentwickler',
  'Software Engineer (Feature Development)': 'Softwareentwickler (Feature-Entwicklung)',
  'Enterprise logistics and transportation management platform that streamlines shipment operations and automates workflows. Led architecture and development of scalable backend services, secure authentication, and workflow modules for logistics and supply chain operations.':
    'Enterprise-Plattform für Logistik- und Transportmanagement zur Optimierung von Versandprozessen und Automatisierung von Workflows. Verantwortlich für Architektur und Entwicklung skalierbarer Backend-Services, sicherer Authentifizierung sowie Logistik- und Supply-Chain-Module.',
  'Designed and implemented scalable RESTful APIs.': 'Skalierbare RESTful APIs konzipiert und implementiert.',
  'Architected authentication and authorization using JWT-based security.': 'JWT-basierte Authentifizierung und Autorisierung entworfen.',
  'Developed business workflow and operational management modules.': 'Module für Geschäftsprozesse und operatives Management entwickelt.',
  'Optimized database performance and API response times.': 'Datenbankleistung und API-Antwortzeiten optimiert.',
  'Established deployment and infrastructure strategies.': 'Deployment- und Infrastrukturstrategien etabliert.',
  'Developed mobile and backend application features.': 'Mobile- und Backend-Funktionen entwickelt.',
  'Implemented order processing and inventory management workflows.': 'Workflows für Auftragsabwicklung und Bestandsverwaltung implementiert.',
  'Built secure APIs and business service layers.': 'Sichere APIs und Business-Service-Schichten entwickelt.',
  'Integrated real-time notifications and user management features.': 'Echtzeit-Benachrichtigungen und Benutzerverwaltung integriert.',
  'Contributed to system optimization and ongoing platform enhancements.': 'Zur Systemoptimierung und kontinuierlichen Plattformverbesserung beigetragen.',
  'Implemented offline-first architecture and synchronization workflows.': 'Offline-First-Architektur und Synchronisierungsprozesse implementiert.',
  'Developed transaction processing and inventory management modules.': 'Module für Transaktionsverarbeitung und Bestandsverwaltung entwickelt.',
  'Integrated POS operations with ERP systems.': 'POS-Prozesse in ERP-Systeme integriert.',
  'Optimized local storage and background synchronization processes.': 'Lokale Speicherung und Hintergrundsynchronisierung optimiert.',
  'Enhanced system reliability for low-connectivity environments.': 'Systemzuverlässigkeit bei schwacher Verbindung verbessert.',
  'Developed mobile application features and user workflows.': 'Mobile App-Funktionen und Nutzerabläufe entwickelt.',
  'Implemented offline order processing capabilities.': 'Offline-Auftragsverarbeitung implementiert.',
  'Designed synchronization mechanisms for reliable data transfer.': 'Synchronisierungsmechanismen für zuverlässige Datenübertragung entwickelt.',
  'Enhanced application performance and usability for field operations.': 'Performance und Bedienbarkeit für den Außendienst verbessert.',
  'Developed integration services and backend APIs.': 'Integrationsdienste und Backend-APIs entwickelt.',
  'Implemented inventory and accounting synchronization workflows.': 'Synchronisierung für Bestand und Buchhaltung implementiert.',
  'Automated reconciliation and data processing operations.': 'Abstimmung und Datenverarbeitung automatisiert.',
  'Improved reliability and consistency of enterprise data exchange.': 'Zuverlässigkeit und Konsistenz des Enterprise-Datenaustauschs verbessert.',
  'Contributed feature development and frontend integration for an international tuition-payment platform. Improved user experience, workflow efficiency, and platform reliability across payment flows.':
    'Feature-Entwicklung und Frontend-Integration für eine internationale Studiengebühren-Plattform. Verbesserte User Experience, Workflow-Effizienz und Zuverlässigkeit der Zahlungsprozesse.',
  'Developed and integrated frontend features.': 'Frontend-Funktionen entwickelt und integriert.',
  'Improved payment workflow usability and reliability.': 'Bedienbarkeit und Zuverlässigkeit der Zahlungsabläufe verbessert.',
  'Collaborated with cross-functional teams on platform enhancements.': 'Mit funktionsübergreifenden Teams an Plattformverbesserungen gearbeitet.',
  'Supported testing and quality assurance initiatives.': 'Tests und Qualitätssicherungsmaßnahmen unterstützt.',
  'Published production app on Google Play': 'Produktive App bei Google Play',
  '10K+ downloads on Google Play': 'Über 10.000 Downloads bei Google Play',
  'Production food-distribution ordering app with product browsing, offers, account ledgers, order history, multilingual support, and real-time order updates.':
    'Produktive Bestell-App für den Lebensmittelvertrieb mit Produktsuche, Angeboten, Kontenübersicht, Bestellhistorie, Mehrsprachigkeit und Echtzeit-Updates.',
  'Sales-order booking app for field teams with customer profiles, product catalog, dashboards, reports, user-level security, and full offline availability with Splendid Accounts synchronization.':
    'Auftragserfassungs-App für Außendienstteams mit Kundenprofilen, Produktkatalog, Dashboards, Berichten, Benutzerrechten und vollständiger Offline-Nutzung samt Splendid-Accounts-Synchronisierung.',
  'Enterprise Point-of-Sale solution integrated with ERP systems and designed for offline-first retail environments. Enables uninterrupted transactions, local persistence, and reliable synchronization between distributed stores and central systems.':
    'Enterprise-POS-Lösung mit ERP-Integration für Offline-First-Handelsumgebungen. Ermöglicht unterbrechungsfreie Transaktionen, lokale Datenspeicherung und zuverlässige Synchronisierung.',
  'ERP and accounting integration work focused on financial operations, inventory management, and automation. Delivered secure integration services and reliable data-exchange workflows between enterprise systems and external applications.':
    'ERP- und Buchhaltungsintegration für Finanzprozesse, Bestandsverwaltung und Automatisierung mit sicheren Integrationsdiensten und zuverlässigem Datenaustausch.',
  'Career Path': 'Berufserfahrung',
  'Designed and developed a complete logistics management platform using .NET Core and SQL Server. Built scalable REST APIs, authentication, and workflow modules. Managed deployment, VPS hosting, and CI/CD pipelines while optimizing API performance for high-volume workflows.':
    'Konzeption und Entwicklung einer vollständigen Logistikplattform mit .NET Core und SQL Server, skalierbaren REST-APIs, Authentifizierung, Workflow-Modulen, VPS-Hosting und CI/CD.',
  'Develop cross-platform applications with Flutter and backend APIs in .NET Core. Implement offline-first patterns, synchronization strategies, and enterprise integrations.':
    'Entwicklung plattformübergreifender Flutter-Apps und .NET-Core-APIs mit Offline-First-Mustern, Synchronisierung und Enterprise-Integrationen.',
  'Contributed to PayMyTuition platform features, worked on integrations, testing, and frontend improvements focused on user experience.':
    'Mitarbeit an PayMyTuition-Funktionen, Integrationen, Tests und Frontend-Verbesserungen mit Fokus auf die User Experience.',
  'Led development of SA-POS, an enterprise offline Point-of-Sale solution integrated with ERP systems. Implemented synchronization strategies and optimized application architecture for high throughput.':
    'Leitung der Entwicklung von SA-POS, einer ERP-integrierten Offline-POS-Lösung, einschließlich Synchronisierung und Architektur-Optimierung.',
  'Built backend services for high-concurrency platforms and optimized server-side components for performance and scalability.':
    'Entwicklung von Backend-Services für hochparallele Plattformen und Optimierung serverseitiger Komponenten.',
  'Implemented .NET Core APIs for shipping automation and package tracking systems, optimizing database queries and background processing workflows.':
    'Implementierung von .NET-Core-APIs für Versandautomatisierung und Sendungsverfolgung sowie Optimierung von Datenbankabfragen und Hintergrundprozessen.',
  Collaboration: 'Zusammenarbeit',
  "Let's Work Together": 'Lassen Sie uns zusammenarbeiten',
  "Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something exceptional together.":
    'Sie planen ein Projekt oder möchten zusammenarbeiten? Ich freue mich auf Ihre Nachricht. Lassen Sie uns gemeinsam etwas Besonderes schaffen.',
  Email: 'E-Mail',
  Phone: 'Telefon',
  Location: 'Standort',
  'Full Name': 'Vollständiger Name',
  Subject: 'Betreff',
  Message: 'Nachricht',
  'Your name': 'Ihr Name',
  'How can I help?': 'Wie kann ich helfen?',
  'Tell me about your project or opportunity...': 'Erzählen Sie mir von Ihrem Projekt oder Ihrer Position...',
  'Send Message': 'Nachricht senden',
  'Sending...': 'Wird gesendet...',
  Theme: 'Darstellung',
  'Switch appearance': 'Darstellung wechseln',
  Language: 'Sprache',
  'Portfolio Assistant': 'Portfolio-Assistent',
  'Online • Instant answers': 'Online • Sofortige Antworten',
  'Top skills': 'Top-Kenntnisse',
  'Ask me': 'Frag mich',
  'Continue on WhatsApp': 'Auf WhatsApp fortsetzen',
  'Automated answers • No chat data is stored': 'Automatische Antworten • Keine Chatdaten werden gespeichert',
  'Ask about skills or projects...': 'Fragen Sie nach Kenntnissen oder Projekten...',
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly current = signal<AppLanguage>('en');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('portfolio-language');
      if (saved === 'de') this.current.set('de');
    }

    effect(() => {
      const language = this.current();
      this.document.documentElement.setAttribute('lang', language);
      this.document.title = language === 'de'
        ? 'Sheheryar Hussain | Full-Stack .NET-, Angular- & Flutter-Entwickler'
        : 'Sheheryar Hussain | Full-Stack .NET, Angular & Flutter Engineer';
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          'content',
          language === 'de'
            ? 'Full-Stack Softwareentwickler in Nürnberg mit Fokus auf .NET Core, Angular, Flutter, SQL Server, skalierbare APIs und Enterprise-Integrationen.'
            : 'Full-Stack Software Engineer in Nuremberg specializing in .NET Core, Angular, Flutter, SQL Server, scalable APIs, and enterprise integrations.',
        );
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('portfolio-language', language);
      }
    });
  }

  set(language: AppLanguage): void {
    this.current.set(language);
  }

  translate(value: string | null | undefined): string {
    if (!value) return '';
    if (this.current() !== 'de') return value;
    return GERMAN[value] ?? value.replace(/\bPresent\b/g, 'Heute');
  }

  pick(english: string, german: string): string {
    return this.current() === 'de' ? german : english;
  }
}
