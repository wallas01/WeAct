import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import en from '../../../assets/i18n/en.json';
import it from '../../../assets/i18n/it.json';

export class SsrTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    switch (lang) {
      case 'it':
        return of(it);
      case 'en':
      default:
        return of(en);
    }
  }
}
