import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CONTACT } from '../../contact.constants';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../../core/services/language.service';

interface ChatMessage {
  readonly sender: 'assistant' | 'visitor';
  readonly text: string;
  readonly germanText?: string;
}

interface QuickQuestion {
  readonly label: string;
  readonly germanLabel: string;
  readonly prompt: string;
  readonly germanPrompt: string;
}

@Component({
  selector: 'app-portfolio-assistant',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './portfolio-assistant.html',
  styleUrl: './portfolio-assistant.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioAssistantComponent {
  readonly language = inject(LanguageService);
  readonly isOpen = signal(false);
  readonly draft = signal('');
  readonly messages = signal<readonly ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hi! I’m Sheheryar’s portfolio assistant. Ask me about his skills, experience, projects, or availability.",
      germanText: 'Hallo! Ich bin Sheheryars Portfolio-Assistent. Fragen Sie mich nach seinen Kenntnissen, seiner Erfahrung, seinen Projekten oder seiner Verfügbarkeit.',
    },
  ]);

  readonly quickQuestions: readonly QuickQuestion[] = [
    { label: 'Top skills', germanLabel: 'Top-Kenntnisse', prompt: 'What are Sheheryar’s top skills?', germanPrompt: 'Was sind Sheheryars wichtigste Kenntnisse?' },
    { label: 'Experience', germanLabel: 'Erfahrung', prompt: 'Tell me about his experience.', germanPrompt: 'Erzählen Sie mir von seiner Erfahrung.' },
    { label: 'Projects', germanLabel: 'Projekte', prompt: 'Show me his key projects.', germanPrompt: 'Zeigen Sie mir seine wichtigsten Projekte.' },
    { label: 'Availability', germanLabel: 'Verfügbarkeit', prompt: 'Is he available for work?', germanPrompt: 'Ist er für eine neue Position verfügbar?' },
  ];

  private readonly whatsappNumber = CONTACT.phone.replace(/\D/g, '');
  readonly whatsappUrl = computed(() => {
    const visitorMessage = this.lastVisitorMessage();
    const message = visitorMessage
      ? `Hi Sheheryar, I visited your portfolio and would like to discuss: ${visitorMessage}`
      : 'Hi Sheheryar, I visited your portfolio and would like to connect with you.';

    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  });

  toggle(): void {
    this.isOpen.update((value) => !value);
  }

  close(): void {
    this.isOpen.set(false);
  }

  ask(prompt: string): void {
    const question = prompt.trim();
    if (!question) {
      return;
    }

    this.messages.update((messages) => [
      ...messages,
      { sender: 'visitor', text: question },
      { sender: 'assistant', text: this.answer(question), germanText: this.answerGerman(question) },
    ]);
    this.draft.set('');
  }

  submit(): void {
    this.ask(this.draft());
  }

  private lastVisitorMessage(): string {
    return [...this.messages()]
      .reverse()
      .find((message) => message.sender === 'visitor')?.text ?? '';
  }

  private answer(question: string): string {
    const normalized = question.toLowerCase();

    if (this.includesAny(normalized, ['skill', 'stack', 'technology', 'technologies', '.net', 'angular', 'flutter'])) {
      return 'Sheheryar specializes in .NET Core, C#, Angular, TypeScript, Flutter, SQL Server, REST APIs, offline-first architecture, ERP integrations, Docker, Azure, and CI/CD.';
    }

    if (this.includesAny(normalized, ['experience', 'career', 'year', 'company', 'work history'])) {
      return 'He has 4+ years of professional experience delivering enterprise web, mobile, and backend systems, including logistics, payment, POS, accounting, and food-distribution products.';
    }

    if (this.includesAny(normalized, ['project', 'portfolio', 'product', 'built', 'work'])) {
      return 'Featured work includes Logistic Hub, 7AG Food Distribution, SA-POS, Order Booker, Splendid Accounts, and PayMyTuition. Open the Projects section for product details and live links.';
    }

    if (this.includesAny(normalized, ['available', 'availability', 'hire', 'job', 'role', 'freelance', 'opportunity'])) {
      return 'Yes. Sheheryar is open to full-time software engineering roles, product collaborations, and selected freelance opportunities in Germany or remote.';
    }

    if (this.includesAny(normalized, ['location', 'where', 'germany', 'nuremberg', 'nürnberg'])) {
      return 'Sheheryar is based in Nuremberg, Germany, and is open to suitable local, hybrid, and remote opportunities.';
    }

    if (this.includesAny(normalized, ['contact', 'email', 'phone', 'whatsapp', 'message', 'talk'])) {
      return `You can email him at ${CONTACT.email}, use the contact form, or continue this conversation on WhatsApp using the button below.`;
    }

    if (this.includesAny(normalized, ['cv', 'resume', 'download'])) {
      return 'His latest CV is available from the “Download CV” button in the navigation and contact section.';
    }

    if (this.includesAny(normalized, ['hello', 'hi', 'hey', 'salam'])) {
      return 'Hello! I can help you explore Sheheryar’s skills, experience, projects, availability, CV, and contact options.';
    }

    return 'I can answer questions about Sheheryar’s skills, experience, projects, availability, CV, and contact details. For anything specific, continue on WhatsApp and your question will be pre-filled.';
  }

  private answerGerman(question: string): string {
    const normalized = question.toLowerCase();

    if (this.includesAny(normalized, ['kenntnis', 'skill', 'stack', 'technologie', '.net', 'angular', 'flutter'])) {
      return 'Sheheryar spezialisiert sich auf .NET Core, C#, Angular, TypeScript, Flutter, SQL Server, REST APIs, Offline-First-Architektur, ERP-Integrationen, Docker, Azure und CI/CD.';
    }
    if (this.includesAny(normalized, ['erfahrung', 'experience', 'karriere', 'beruf', 'unternehmen'])) {
      return 'Er verfügt über mehr als vier Jahre Berufserfahrung mit Enterprise-Web-, Mobile- und Backend-Systemen in den Bereichen Logistik, Zahlung, POS, Buchhaltung und Lebensmittelvertrieb.';
    }
    if (this.includesAny(normalized, ['projekt', 'portfolio', 'produkt'])) {
      return 'Zu seinen Projekten zählen Logistic Hub, 7AG Food Distribution, SA-POS, Order Booker, Splendid Accounts und PayMyTuition. Im Projektbereich finden Sie Details und Live-Links.';
    }
    if (this.includesAny(normalized, ['verfügbar', 'verfügbarkeit', 'position', 'job', 'freelance', 'arbeit'])) {
      return 'Ja. Sheheryar ist offen für Festanstellungen als Softwareentwickler, Produktkooperationen und ausgewählte Freelance-Projekte in Deutschland oder remote.';
    }
    if (this.includesAny(normalized, ['standort', 'wo', 'deutschland', 'nuremberg', 'nürnberg'])) {
      return 'Sheheryar lebt in Nürnberg und ist offen für passende lokale, hybride und Remote-Positionen.';
    }
    if (this.includesAny(normalized, ['kontakt', 'email', 'telefon', 'whatsapp', 'nachricht'])) {
      return `Sie erreichen ihn per E-Mail unter ${CONTACT.email}, über das Kontaktformular oder direkt über den WhatsApp-Button.`;
    }
    if (this.includesAny(normalized, ['lebenslauf', 'cv', 'resume', 'download'])) {
      return 'Sein aktueller Lebenslauf steht über den Button „Lebenslauf herunterladen“ in der Navigation und im Kontaktbereich bereit.';
    }
    return 'Ich beantworte Fragen zu Sheheryars Kenntnissen, Erfahrung, Projekten, Verfügbarkeit, Lebenslauf und Kontaktdaten. Für weitere Fragen können Sie direkt auf WhatsApp fortsetzen.';
  }

  private includesAny(value: string, keywords: readonly string[]): boolean {
    return keywords.some((keyword) => value.includes(keyword));
  }
}
