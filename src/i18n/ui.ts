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
    'about.skills.title': 'Skills & Expertise',
    'about.skills.webDev': 'Web Development',
    'about.skills.webDev.desc': 'Building responsive, performant web applications with modern frameworks and best practices.',
    'about.skills.mobile': 'Mobile Development',
    'about.skills.mobile.desc': 'Creating cross-platform mobile apps with React Native and Flutter for seamless user experiences.',
    'about.skills.ai': 'AI & Prompt Engineering',
    'about.skills.ai.desc': 'Crafting intelligent AI prompts and fine-tuning language models for context-aware responses.',
    'about.skills.backend': 'Backend Development',
    'about.skills.backend.desc': 'Designing scalable server architectures and APIs with focus on performance and security.',
    'accordion.expand': 'Expand section',
    'accordion.collapse': 'Collapse section',
    'accordion.toggle': 'Toggle section',
    'button.loading': 'Loading...',
    'button.success': 'Success!',
    'animation.play': 'Play animation',
    'animation.pause': 'Pause animation',
    'animation.reset': 'Reset animation',
    'microInteraction.magnetic': 'Magnetic effect active',
    'microInteraction.ripple': 'Ripple effect triggered',
    'microInteraction.breathing': 'Breathing animation active',
    'microInteraction.stagger': 'Staggered reveal animation',
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
    'about.skills.title': 'Compétences & Expertise',
    'about.skills.webDev': 'Développement Web',
    'about.skills.webDev.desc': 'Création d\'applications web responsives et performantes avec des frameworks modernes et les meilleures pratiques.',
    'about.skills.mobile': 'Développement Mobile',
    'about.skills.mobile.desc': 'Création d\'applications mobiles multiplateformes avec React Native et Flutter pour des expériences utilisateur fluides.',
    'about.skills.ai': 'IA & Prompt Engineering',
    'about.skills.ai.desc': 'Création de prompts IA intelligents et ajustement de modèles de langage pour des réponses contextuelles.',
    'about.skills.backend': 'Développement Backend',
    'about.skills.backend.desc': 'Conception d\'architectures serveur évolutives et d\'APIs avec un focus sur la performance et la sécurité.',
    'accordion.expand': 'Développer la section',
    'accordion.collapse': 'Réduire la section',
    'accordion.toggle': 'Basculer la section',
    'button.loading': 'Chargement...',
    'button.success': 'Succès !',
    'animation.play': 'Lancer l\'animation',
    'animation.pause': 'Mettre en pause l\'animation',
    'animation.reset': 'Réinitialiser l\'animation',
    'microInteraction.magnetic': 'Effet magnétique actif',
    'microInteraction.ripple': 'Effet d\'ondulation déclenché',
    'microInteraction.breathing': 'Animation de respiration active',
    'microInteraction.stagger': 'Animation de révélation échelonnée',
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
