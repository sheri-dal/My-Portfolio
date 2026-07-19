import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CONTACT } from '../../shared/contact.constants';
import { DownloadCvButtonComponent } from '../../shared/ui/download-cv-button/download-cv-button';

interface ContactInfo {
  icon: string;
  theme: 'fill' | 'outline';
  label: string;
  value: string;
  href?: string;
}

interface SocialProfile {
  type: string;
  theme: 'fill' | 'outline';
  url: string;
  label: string;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzIconModule, DownloadCvButtonComponent],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly doc = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);
  private readonly apiEndpoint = `https://formsubmit.co/ajax/${CONTACT.email}`;
  readonly locationTitle = 'Nuremberg, Germany';
  readonly email = CONTACT.email;
  readonly phone = CONTACT.phone;
  readonly linkedIn = CONTACT.linkedIn;
  readonly github = CONTACT.github;
  readonly twitter = '';
  readonly isSubmitting = signal(false);

  contactDetails: ContactInfo[] = [];
  socialProfiles: SocialProfile[] = [];

  readonly contactForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', [Validators.required, Validators.minLength(4)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.contactDetails = [
      { icon: 'mail', theme: 'fill', label: 'Email', value: this.email, href: `mailto:${this.email}` },
      { icon: 'user', theme: 'outline', label: 'Phone', value: this.phone },
      { icon: 'team', theme: 'outline', label: 'Location', value: this.locationTitle }
    ];

    this.socialProfiles = [
      { type: 'linkedin', theme: 'fill', url: this.linkedIn, label: 'LinkedIn' },
      { type: 'github', theme: 'fill', url: this.github, label: 'GitHub' },
      { type: 'mail', theme: 'fill', url: `mailto:${this.email}`, label: 'Email Contact' }
    ];

    this.title.setTitle('Contact — Let\'s Work Together — ' + this.locationTitle);
    this.meta.updateTag({ name: 'description', content: `Contact — send a message or download resume.` });

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Sheheryar Hussain',
      url: this.doc.location?.origin || '',
      telephone: this.phone,
      email: this.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nuremberg',
        addressRegion: 'Bavaria',
        postalCode: '',
        addressCountry: 'DE'
      }
    };

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(ld);
    this.doc.head.appendChild(script);
  }

  getControl(name: string) {
    return this.contactForm.get(name)!;
  }

  nzValidateStatus(controlName: string): 'success' | 'error' | 'validating' | '' {
    const c = this.getControl(controlName);
    if (!c) return '';
    if (c.pristine) return '';
    return c.valid ? 'success' : 'error';
  }

  async submit() {
    if (this.contactForm.invalid || this.isSubmitting()) {
      this.contactForm.markAllAsTouched();
      this.message.error('Please fix validation errors before sending.');
      return;
    }

    const payload = {
      fullName: this.getControl('fullName').value ?? '',
      email: this.getControl('email').value ?? '',
      phone: this.getControl('phone').value ?? '',
      subject: this.getControl('subject').value ?? '',
      message: this.getControl('message').value ?? '',
    };

    this.isSubmitting.set(true);
    this.message.loading('Sending message...', { nzDuration: 0 });

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          _subject: `[Portfolio] ${payload.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        success?: boolean | string;
      };

      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'Failed to send message.');
      }

      this.message.remove();
      this.message.success(result.message || 'Message sent — I will get back to you soon.');
      this.contactForm.reset();
    } catch (error) {
      this.message.remove();
      this.message.error(error instanceof Error ? error.message : 'Failed to send message.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Download handled by shared DownloadCvButtonComponent
}
