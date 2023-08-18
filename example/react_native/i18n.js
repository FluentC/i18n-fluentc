import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import FluentC from 'i18n-fluentc';

i18n
  .use(FluentC)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    debug: true,
    fallbackLng: 'en',
    backend: {
      environmentId: '',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
