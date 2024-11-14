import log from 'encore.dev/log';
import L from './i18n-node';
import { Locales } from './i18n-types';
import { currentRequest } from 'encore.dev';
import { baseLocale } from './i18n-util';
// or
// import { typesafeI18nString } from 'typesafe-i18n'

/**
 * Localizer.
 * Check language passed by the caller a return the localized translator.
 * If no language passed, use the default language (baseLocale).
 * @returns translator setted with the right locale
 */
export const locz = () => {
  const request: any = currentRequest();
  const language: Locales = request && request.headers && request.headers['current-language'] ? request.headers['current-language'] : baseLocale;
  return L[language];
}; // locz
export default locz;
