import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { ApiOutline, AppstoreOutline, BuildOutline, CheckOutline, CloudOutline, CodeOutline, CloseOutline, DatabaseOutline, DownloadOutline, ExperimentOutline, GithubFill, LinkedinFill, MailFill, MenuOutline, MoonOutline, RocketOutline, SafetyCertificateOutline, SunOutline, TeamOutline, ToolOutline, UserOutline } from '@ant-design/icons-angular/icons';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    provideNzIcons([ApiOutline, AppstoreOutline, BuildOutline, CheckOutline, CloudOutline, CodeOutline, CloseOutline, DatabaseOutline, DownloadOutline, ExperimentOutline, GithubFill, LinkedinFill, MailFill, MenuOutline, MoonOutline, RocketOutline, SafetyCertificateOutline, SunOutline, TeamOutline, ToolOutline, UserOutline]),
  ],
};
