// Projects data in a separate file to be shared between pages

// Projects data with multilingual support - ordered by year (newest first)
const projects = [
  // 2025 Projects
  {
    name: "Doctolib AI Hackathon",
    description: {
      en: "AI chatbot which helps general health practitioners with prevention strategies based on data it will have collected from the patient",
      fr: "Chatbot IA qui aide les médecins généralistes avec des stratégies de prévention basé sur les données qu'il aura récupérées du patient"
    },
    date: "2025",
    image: "images/projects/doctolib.webp",
    topics: ["AI", "Healthcare", "Python", "Chatbot", "Website"],
    html_url: "https://github.com/Guillaume18100/hackathon_doctolib"
  },
  {
    name: "Sia GenAI Hackathon",
    description: {
      en: "AI solution to automate customer file generation with AWS",
      fr: "Solution IA pour automatiser la génération de fiches clients avec AWS"
    },
    date: "2025",
    image: "images/projects/genai-hackathon.webp",
    topics: ["AI", "Hackathon", "Python", "Website", "AWS"],
    html_url: "https://github.com/GuillotSamuel/GenAI_hackaton"
  },
  {
    name: "Quickest Path Algorithm",
    description: {
      en: "A high-performance software solution to calculate the quickest path between two landmarks in the United States, exposed as a REST API with response time under 1 second",
      fr: "Une solution logicielle haute performance pour calculer le chemin le plus rapide entre deux points de repère aux États-Unis, exposée comme une API REST avec un temps de réponse inférieur à 1 seconde"
    },
    date: "2025",
    image: "images/projects/quickest-path.webp",
    topics: ["pathfinding", "A* algorithm", "Dijkstra", "REST API", "JSON", "XML", "C++", "performance optimization", "Website"],
    html_url: "https://github.com/algosup/2024-2025-project-3-quickest-path-team-7"
  },
  
  // 2024 Projects
  {
    name: "Adopte un Candidat",
    description: {
      en: "Flutter mobile/web application connecting job candidates with companies",
      fr: "Application mobile/web Flutter connectant les candidats aux entreprises"
    },
    date: "2024",
    image: "images/projects/adopte-candidate.webp",
    topics: ["Flutter", "Dart", "Job Matching", "Mobile Development"],
    html_url: "https://github.com/algosup/2023-2024-project-5-flutter-team-1"
  },
  {
    name: "Blockchain Hackathon",
    description: {
      en: "Real wrold asset tokenization using Avalanche blockchain",
      fr: "Tokenisation d'actifs réels en utilisant la blockchain Avalanche"
    },
    date: "2024",
    image: "images/projects/blockchain-hackathon.webp",
    topics: ["Blockchain", "JavaScript", "Hackathon", "Website"],
    html_url: "https://github.com/0xBelnadris/hackaton-blockchain-vierzon-2024"
  },
  {
    name: "Virtual Processor",
    description: {
      en: "Building a virtual processor with assembler and interpreter for a custom assembly language",
      fr: "Création d'un processeur virtuel avec assembleur et interpréteur pour un langage d'assembler personnalisé"
    },
    date: "2024",
    image: "images/projects/virtual-processor.webp",
    topics: ["assembler", "interpreter", "virtual-processor", "c", "c++", "cmake"],
    html_url: "https://github.com/algosup/2023-2024-project-3-virtual-processor-team-2"
  },
  {
    name: "Green City",
    description: {
      en: "A serious game challenging players to build and manage a thriving city while balancing economic growth and environmental sustainability in the context of climate change",
      fr: "Un jeu sérieux défiant les joueurs de construire et gérer une ville prospère tout en équilibrant croissance économique et durabilité environnementale dans le contexte du changement climatique"
    },
    date: "2024",
    image: "images/projects/green-city.webp",
    topics: ["serious game", "Godot 4", "climate change", "city builder", "sustainability", "game development"],
    html_url: "https://github.com/algosup/2024-2025-project-2-serious-game-team-3"
  },
  {
    name: "SportShield",
    description: {
      en: "Connected protection device for snowboards and skis",
      fr: "Dispositif de protection connecté pour snowboards et skis"
    },
    date: "2024",
    image: "images/projects/sportshield.webp",
    topics: ["sports technology", "athlete safety", "hardware", "sensors", "real-time monitoring", "protection systems"],
    html_url: "https://github.com/algosup/2023-2024-project-4-sportshield-team-6"
  },
  {
    name: "FPGA Project",
    description: {
      en: "Implementation of digital logic circuits using Field-Programmable Gate Arrays for custom hardware acceleration applications",
      fr: "Implémentation de circuits logiques numériques utilisant des FPGA (Field-Programmable Gate Arrays) pour des applications d'accélération matérielle personnalisées"
    },
    date: "2024",
    image: "images/projects/fpga-project.webp",
    topics: ["FPGA", "hardware design", "digital logic", "Verilog", "VHDL", "circuit design", "hardware acceleration"],
    html_url: "https://github.com/algosup/2024-2025-project-1-fpga-team-4"
  },
  
  // 2023 Projects
  {
    name: "x86 Retrogaming",
    description: {
      en: "Recreating Pac-Man in Assembly",
      fr: "Recréation de Pac-Man en Assembly"
    },
    date: "2023",
    image: "images/projects/retrogaming.webp",
    topics: ["assembly", "x86", "retrogaming", "pacman", "dosbox"],
    html_url: "https://github.com/algosup/2023-2024-project-2-x86-retrogaming-team-5"
  }
];
