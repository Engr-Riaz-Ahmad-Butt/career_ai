export type Language = 'en' | 'ar' | 'de' | 'fr';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    flag: '🇩🇪',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    flag: '🇫🇷',
  },
];

// Translation mappings
export const translations: Record<Language, Record<string, string>> = {
  en: {
    'resume.title': 'Resume',
    'resume.contact': 'Contact Information',
    'resume.summary': 'Professional Summary',
    'resume.experience': 'Experience',
    'resume.education': 'Education',
    'resume.skills': 'Skills',
    'resume.certifications': 'Certifications',
    'job.title': 'Job Title',
    'job.company': 'Company',
    'job.duration': 'Duration',
    'job.description': 'Description',
    'education.degree': 'Degree',
    'education.school': 'School/University',
    'education.year': 'Graduation Year',
  },
  ar: {
    'resume.title': 'السيرة الذاتية',
    'resume.contact': 'معلومات التواصل',
    'resume.summary': 'الملخص المهني',
    'resume.experience': 'الخبرة',
    'resume.education': 'التعليم',
    'resume.skills': 'المهارات',
    'resume.certifications': 'الشهادات',
    'job.title': 'المسمى الوظيفي',
    'job.company': 'الشركة',
    'job.duration': 'المدة',
    'job.description': 'الوصف',
    'education.degree': 'الدرجة',
    'education.school': 'الجامعة/المدرسة',
    'education.year': 'سنة التخرج',
  },
  de: {
    'resume.title': 'Lebenslauf',
    'resume.contact': 'Kontaktinformationen',
    'resume.summary': 'Berufliche Zusammenfassung',
    'resume.experience': 'Berufserfahrung',
    'resume.education': 'Bildung',
    'resume.skills': 'Fähigkeiten',
    'resume.certifications': 'Zertifizierungen',
    'job.title': 'Jobtitel',
    'job.company': 'Unternehmen',
    'job.duration': 'Dauer',
    'job.description': 'Beschreibung',
    'education.degree': 'Abschluss',
    'education.school': 'Schule/Universität',
    'education.year': 'Abschlussjahr',
  },
  fr: {
    'resume.title': 'CV',
    'resume.contact': 'Informations de Contact',
    'resume.summary': 'Résumé Professionnel',
    'resume.experience': 'Expérience',
    'resume.education': 'Éducation',
    'resume.skills': 'Compétences',
    'resume.certifications': 'Certifications',
    'job.title': 'Intitulé du Poste',
    'job.company': 'Entreprise',
    'job.duration': 'Durée',
    'job.description': 'Description',
    'education.degree': 'Diplôme',
    'education.school': 'École/Université',
    'education.year': 'Année de Graduation',
  },
};

export function translate(key: string, language: Language): string {
  return translations[language]?.[key] || key;
}
