import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import 'dotenv/config';
import express from 'express';
import { join } from 'node:path';
import nodemailer from 'nodemailer';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

let mailTransporter: nodemailer.Transporter | undefined;

app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body ?? {};

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required contact fields.' });
  }

  const smtpHost = process.env['SMTP_HOST'];
  const smtpPort = Number(process.env['SMTP_PORT'] || 587);
  const smtpUser = process.env['SMTP_USER'];
  const smtpPass = process.env['SMTP_PASS'];
  const contactTo = process.env['CONTACT_TO_EMAIL'] || smtpUser;
  const contactFrom = process.env['CONTACT_FROM_EMAIL'] || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(500).json({
      message:
        'Mail service is not configured. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to your .env file. CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL default to SMTP_USER when omitted.',
    });
  }

  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      pool: true,
      maxConnections: 1,
      maxMessages: 20,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }

  try {
    await mailTransporter.sendMail({
      from: `Portfolio Contact <${contactFrom}>`,
      to: contactTo,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2 style="margin:0 0 12px">Portfolio contact form submission</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="white-space:pre-wrap"><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact email send failed:', error);
    return res.status(500).json({ message: 'Failed to send message.' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
