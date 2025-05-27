export const languages = {
  en: 'English',
  fr: 'Français',
}

export const defaultLang = 'en'

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.title': 'Guillaume Deramchi',
    'hero.subtitle': 'Software & Prompt Engineer',
    'hero.description': 'Specializing in creating elegant, high-performance applications and crafting intelligent AI prompts that solve real-world problems.',
    'hero.cta.projects': 'View Projects',
    'hero.cta.contact': 'Get in Touch',
    'about.title': 'About Me',
    'about.description': 'Passionate software engineer with expertise in modern web technologies, mobile development, and AI solutions.',
    'projects.title': 'Featured Projects',
    'projects.viewAll': 'View All Projects',
    'project.viewCode': 'View Code',
    'project.viewDemo': 'View Demo',
    'contact.title': 'Get in Touch',
    'contact.description': 'Let\'s discuss your next project or collaboration.',
    'footer.rights': 'All rights reserved.',
    'theme.toggle': 'Toggle theme',
    'lang.toggle': 'Switch language',
    'skip.content': 'Skip to main content',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'hero.title': 'Guillaume Deramchi',
    'hero.subtitle': 'Ingénieur Logiciel & Prompt Engineer',
    'hero.description': 'Spécialisé dans la création d\'applications élégantes et performantes et la conception de prompts IA intelligents qui résolvent des problèmes réels.',
    'hero.cta.projects': 'Voir les Projets',
    'hero.cta.contact': 'Me Contacter',
    'about.title': 'À Propos',
    'about.description': 'Ingénieur logiciel passionné avec une expertise en technologies web modernes, développement mobile et solutions IA.',
    'projects.title': 'Projets Sélectionnés',
    'projects.viewAll': 'Voir Tous les Projets',
    'project.viewCode': 'Voir le Code',
    'project.viewDemo': 'Voir la Démo',
    'contact.title': 'Me Contacter',
    'contact.description': 'Discutons de votre prochain projet ou collaboration.',
    'footer.rights': 'Tous droits réservés.',
    'theme.toggle': 'Changer le thème',
    'lang.toggle': 'Changer la langue',
    'skip.content': 'Aller au contenu principal',
  },
} as const

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in languages) return lang as keyof typeof languages
  return defaultLang
}

export function useTranslations(lang: keyof typeof languages) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}
