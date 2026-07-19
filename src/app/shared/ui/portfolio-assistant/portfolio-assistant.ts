import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CONTACT } from '../../contact.constants';

interface ChatMessage {
  readonly sender: 'assistant' | 'visitor';
  readonly text: string;
}

interface QuickQuestion {
  readonly label: string;
  readonly prompt: string;
}

@Component({
  selector: 'app-portfolio-assistant',
  imports: [FormsModule],
  templateUrl: './portfolio-assistant.html',
  styleUrl: './portfolio-assistant.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioAssistantComponent {
  readonly isOpen = signal(false);
  readonly draft = signal('');
  readonly messages = signal<readonly ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hi! I’m Sheheryar’s portfolio assistant. Ask me about his skills, experience, projects, or availability.",
    },
  ]);

  readonly quickQuestions: readonly QuickQuestion[] = [
    { label: 'Top skills', prompt: 'What are Sheheryar’s top skills?' },
    { label: 'Experience', prompt: 'Tell me about his experience.' },
    { label: 'Projects', prompt: 'Show me his key projects.' },
    { label: 'Availability', prompt: 'Is he available for work?' },
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
      { sender: 'assistant', text: this.answer(question) },
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

  private includesAny(value: string, keywords: readonly string[]): boolean {
    return keywords.some((keyword) => value.includes(keyword));
  }
}
