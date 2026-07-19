# Sheheryar Hussain — Portfolio

Personal portfolio of a Full-Stack Software Engineer based in Nuremberg, Germany, specializing in **.NET Core, Angular, Flutter, and SQL Server** for enterprise, ERP, logistics, and offline-first systems.

**Live:** [sheri-dal.github.io/My-Portfolio](https://sheri-dal.github.io/My-Portfolio/)

## Tech Stack

- **Framework:** Angular 21 with standalone components, signals, and OnPush change detection
- **Styling:** Tailwind CSS 4 and ng-zorro-antd
- **Rendering:** Angular SSR/static prerendering for GitHub Pages
- **Features:** Dark/light theme, SEO metadata, JSON-LD, contact form, portfolio assistant, and WhatsApp handoff

## Portfolio Sections

- Hero and professional overview
- Skills and technical capabilities
- Client projects with live product links
- Career experience and milestones
- Contact form and downloadable CV
- Automated portfolio assistant

## Local Development

Use the Node version declared in `.nvmrc`:

```bash
nvm use 22.12.0
npm ci
npm start
```

The development server runs at `http://localhost:4200`.

## Production Build

```bash
npm run build -- --configuration production --output-mode static --base-href /My-Portfolio/
```

Static output is generated in `dist/portfolio/browser`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy-github-pages.yml`, which builds and publishes the site to GitHub Pages.

---

Email: shaharyarhussain0@gmail.com

[LinkedIn](https://www.linkedin.com/in/sheheryar-hussain-dev/) · [GitHub](https://github.com/sheri-dal)
