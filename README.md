# Guillaume Deramchi - Personal Portfolio Website

This repository contains the code for my personal portfolio website, showcasing my projects, skills, and experience as a Software & AI Prompt Engineer.

## 🌐 Live Demo

Visit the [website](https://gderamchi.vercel.app/)

## ✨ Features

- **Responsive Design**: Mobile-first approach ensuring perfect display on all devices
- **Dark/Light Mode**: User preference-based theme switching
- **Bilingual**: English and French language support
- **Fast Loading**: Optimized assets and lazy loading for better performance
- **Offline Capabilities**: Service worker implementation for offline browsing
- **Accessibility**: WCAG compliance for better accessibility
- **SEO Optimized**: Meta tags and structured data for better search engine ranking

## 🛠️ Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design using CSS Grid and Flexbox
- Service Workers for offline functionality
- Font Awesome for icons
- Structured data (schema.org) for SEO

## 📂 Project Structure

```
/
├── index.html                # Main landing page
├── projects.html             # Projects showcase page
├── 404.html                  # Custom 404 error page
├── style.css                 # Main stylesheet
├── projects-page.css         # Projects page specific styles
├── overscroll-fix.css        # Fixes for overscroll behavior
├── common.js                 # Shared JavaScript functionality
├── script.js                 # Main JavaScript file
├── projects-page.js          # Projects page specific JavaScript
├── projects-data.js          # Projects data
├── service-worker.js         # Service worker for offline caching
├── site.webmanifest          # Web app manifest
├── robots.txt                # Instructions for web crawlers
├── sitemap.xml               # XML sitemap for search engines
├── .htaccess                 # Server configuration (for Apache)
├── images/                   # Image assets
│   ├── profile-photo.webp    # Profile photo
│   ├── projects/             # Project screenshots
│   └── favicon files         # Various favicon formats
├── api/                      # Vercel serverless functions
│   └── chat.js               # Secure chat proxy
└── vercel.json               # Vercel routing and security headers
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Guillaume18100/website.git
   ```

2. Open the project in your code editor

3. Launch with a local server:
   ```bash
   # Using Python
   python -m http.server

   # Using Vercel, including /api routes
   npm run dev
   ```

4. Visit the local URL printed by Vercel

## 🚀 Deployment

This site is deployed on Vercel. GitHub Pages is disabled, and Netlify builds
are intentionally ignored through `netlify.toml` if the old Netlify project is
still connected.

Required production environment variable for the chat API:

```bash
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-5.4-mini # optional
```

The runtime also accepts the old `BLACKBOX_API` secret name as a compatibility
fallback if it already stores an OpenAI key.

## 🌙 Dark Mode

The website includes dark mode support that:
- Respects user system preferences
- Allows manual toggling
- Persists user choice across sessions

## 🔄 Language Support

- English (default)
- French
- Language preference is saved in localStorage

## 🔍 SEO Implementation

- Meta tags optimized for search engines
- Open Graph and Twitter card support
- Structured data using Schema.org
- XML sitemap
- Canonical URLs

## 📱 PWA Support

The website can be installed as a Progressive Web App with:
- Custom icons
- Offline functionality
- App-like experience

## 👨‍💻 Author

**Guillaume Deramchi**
- GitHub: [@Guillaume18100](https://github.com/Guillaume18100)
- LinkedIn: [Guillaume Deramchi](https://www.linkedin.com/in/guillaume-deramchi/)

## 📄 License

This project is licensed under the MIT License
