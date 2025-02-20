import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About',
        projects: 'Projects',
        experience: 'Experience',
        contact: 'Contact'
      },
      hero: {
        title: 'Full Stack Developer',
        intro: 'Building digital experiences that matter'
      }
      // Add more translations
    }
  },
  de: {
    translation: {
      nav: {
        about: 'Über mich',
        projects: 'Projekte',
        experience: 'Erfahrung',
        contact: 'Kontakt'
      },
      hero: {
        title: 'Fullstack-Entwickler',
        intro: 'Entwicklung digitaler Erlebnisse, die wichtig sind'
      }
      // Add more translations
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;