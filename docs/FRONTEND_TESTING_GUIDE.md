# 🧪 Frontend Testing Guide

## Quick Manual Testing Checklist

### 1. Homepage (index.html) Testing

#### Visual Elements
- [ ] **Hero Section**
  - [ ] Profile photo loads correctly
  - [ ] Name and title display properly
  - [ ] Social links work (GitHub, LinkedIn, Email)
  - [ ] CTA button "View My Work" navigates to projects

- [ ] **About Section**
  - [ ] Bio text is readable
  - [ ] Skills list displays correctly
  - [ ] Section spacing looks good

- [ ] **Featured Projects**
  - [ ] 3-6 featured projects display
  - [ ] Project cards show:
    - [ ] AI-generated images (FLUX Pro)
    - [ ] AI-generated titles (clear, concise)
    - [ ] AI-generated descriptions
    - [ ] Technology tags
    - [ ] GitHub link works
  - [ ] Hover effects work
  - [ ] Click opens project details

- [ ] **Contact Section**
  - [ ] Email link works (mailto:)
  - [ ] Social links work
  - [ ] Form (if present) submits correctly

#### Responsive Design
- [ ] **Desktop (1920x1080)**
  - [ ] Layout looks professional
  - [ ] Images are crisp
  - [ ] Text is readable
  - [ ] No horizontal scroll

- [ ] **Laptop (1366x768)**
  - [ ] Content adapts properly
  - [ ] No overflow issues

- [ ] **Tablet (768x1024)**
  - [ ] Grid adjusts to 2 columns
  - [ ] Navigation works
  - [ ] Images scale correctly

- [ ] **Mobile (375x667)**
  - [ ] Single column layout
  - [ ] Touch targets are large enough
  - [ ] Text is readable without zoom
  - [ ] Images load efficiently

#### Performance
- [ ] **Page Load**
  - [ ] Initial load < 3 seconds
  - [ ] Images load progressively
  - [ ] No layout shift (CLS)

- [ ] **Interactions**
  - [ ] Smooth scrolling
  - [ ] Animations don't lag
  - [ ] Hover effects are instant

---

### 2. Projects Page (projects.html) Testing

#### Project Display
- [ ] **All 16 Projects Show**
  - [ ] hackathonblackbox42 (AI-Based Code Review Bot)
  - [ ] website (Personal Portfolio Website)
  - [ ] portfolio-florid (Artistic Portfolio Showcase)
  - [ ] eugeniackathon (Automated Workflow)
  - [ ] presence-pulse-events (Real-Time Event Tracker)
  - [ ] hackathon_doctolib (AI Pathology Assistant)
  - [ ] 2024-2025-project-3-quickest-path-team-7 (Optimal Route Finder)
  - [ ] GenAI_hackaton (AI Client Profile Generator)
  - [ ] 2023-2024-project-3-virtual-processor-team-2 (Virtual Processor)
  - [ ] 2024-2025-project-2-serious-game-team-3 (Green City Game)
  - [ ] 2023-2024-project-4-sportshield-team-6 (SportShield)
  - [ ] 2024-2025-project-1-fpga-team-4 (Frogger FPGA)
  - [ ] hackaton-blockchain-vierzon-2024 (Blockchain Platform)
  - [ ] 2023-2024-project-5-flutter-team-1 (Flutter App)
  - [ ] video-game-project (Super Chicken Boy)
  - [ ] 2023-2024-project-2-x86-retrogaming-team-5 (Retro Gaming)

#### Project Cards
- [ ] **Each Card Shows**
  - [ ] FLUX Pro generated image (high quality)
  - [ ] AI-generated clear title (not repo name)
  - [ ] AI-generated concise description
  - [ ] Technology tags
  - [ ] Year badge
  - [ ] Star count (if > 0)
  - [ ] GitHub link icon

#### Filtering
- [ ] **By Year**
  - [ ] "All" shows 16 projects
  - [ ] "2025" shows 8 projects
  - [ ] "2024" shows 7 projects
  - [ ] "2023" shows 1 project
  - [ ] Count updates correctly

- [ ] **By Technology**
  - [ ] Filter by Python
  - [ ] Filter by JavaScript
  - [ ] Filter by C++
  - [ ] Filter by TypeScript
  - [ ] Multiple filters work together

- [ ] **Search**
  - [ ] Search by title works
  - [ ] Search by description works
  - [ ] Search by technology works
  - [ ] Clear search resets results

#### Interactions
- [ ] **Click Project Card**
  - [ ] Opens modal/detail view
  - [ ] Shows full description
  - [ ] Shows all technologies
  - [ ] GitHub link works
  - [ ] Homepage link works (if available)
  - [ ] Close button works

- [ ] **External Links**
  - [ ] GitHub links open in new tab
  - [ ] Homepage links open in new tab
  - [ ] Links have correct URLs

#### Responsive Design
- [ ] **Desktop**: 3-4 columns
- [ ] **Tablet**: 2 columns
- [ ] **Mobile**: 1 column
- [ ] Filters work on all devices
- [ ] Search works on mobile

---

### 3. Image Quality Testing

#### FLUX Pro Images
Check these new images for quality:
- [ ] 2024-2025-project-3-quickest-path-team-7.webp
- [ ] 2024-2025-project-2-serious-game-team-3.webp
- [ ] GenAI_hackaton.webp
- [ ] hackaton-blockchain-vierzon-2024.webp
- [ ] video-game-project.webp
- [ ] Blackbox_AI_Hackathon.webp (if exists)

#### Quality Checklist
- [ ] **Resolution**: Sharp, not pixelated
- [ ] **Style**: Modern, minimalist, tech-focused
- [ ] **Colors**: Purple/cyan gradient background
- [ ] **Composition**: Clean, professional
- [ ] **Loading**: Fast, progressive
- [ ] **Format**: WebP (check file extension)

#### Fallback Images
- [ ] Default image shows if generation fails
- [ ] No broken image icons
- [ ] Alt text displays if image fails

---

### 4. Content Quality Testing

#### AI-Generated Titles
Verify these are clear and professional:
- [ ] "AI-Based Code Review Bot" (not "hackathonblackbox42")
- [ ] "Personal Portfolio Website" (not "website")
- [ ] "Optimal Route Finder" (not "2024-2025-project-3-quickest-path-team-7")
- [ ] "Virtual Processor Development in C" (not "2023-2024-project-3-virtual-processor-team-2")
- [ ] "Green City Management Game" (not "2024-2025-project-2-serious-game-team-3")

#### AI-Generated Descriptions
Check for:
- [ ] **Clarity**: Easy to understand
- [ ] **Conciseness**: 1-2 sentences, ~120 chars
- [ ] **Specificity**: Explains what it does
- [ ] **Professionalism**: No generic phrases
- [ ] **Accuracy**: Matches project purpose

#### Technology Tags
- [ ] Relevant to project
- [ ] Properly formatted
- [ ] Clickable for filtering
- [ ] Consistent styling

---

### 5. Navigation Testing

#### Header/Navigation
- [ ] Logo/name links to homepage
- [ ] "About" scrolls to about section
- [ ] "Projects" navigates to projects page
- [ ] "Contact" scrolls to contact section
- [ ] Mobile menu works (hamburger icon)
- [ ] Active page highlighted

#### Footer
- [ ] Social links work
- [ ] Copyright year is current
- [ ] Links open in new tabs
- [ ] Responsive on mobile

#### Internal Links
- [ ] All internal links work
- [ ] Smooth scrolling enabled
- [ ] Back button works correctly
- [ ] No 404 errors

---

### 6. Cross-Browser Testing

#### Chrome (Primary)
- [ ] All features work
- [ ] Images load correctly
- [ ] Animations smooth
- [ ] No console errors

#### Firefox
- [ ] Layout consistent
- [ ] Images display
- [ ] Filters work
- [ ] No warnings

#### Safari
- [ ] WebP images supported
- [ ] Styles render correctly
- [ ] Touch events work (iOS)
- [ ] No compatibility issues

#### Edge
- [ ] Modern Edge (Chromium)
- [ ] All features functional
- [ ] Performance good

---

### 7. Performance Testing

#### Lighthouse Audit
Run in Chrome DevTools:
- [ ] **Performance**: > 90
- [ ] **Accessibility**: > 90
- [ ] **Best Practices**: > 90
- [ ] **SEO**: > 90

#### Key Metrics
- [ ] **FCP** (First Contentful Paint): < 1.8s
- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **CLS** (Cumulative Layout Shift): < 0.1
- [ ] **TTI** (Time to Interactive): < 3.8s

#### Network
- [ ] Images optimized (WebP)
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] No unnecessary requests

---

### 8. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals

#### Screen Reader
- [ ] Alt text on all images
- [ ] ARIA labels on buttons
- [ ] Semantic HTML structure
- [ ] Headings in logical order

#### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Links distinguishable
- [ ] Buttons have sufficient contrast
- [ ] No color-only information

---

### 9. SEO Testing

#### Meta Tags
- [ ] Title tag present and descriptive
- [ ] Meta description present
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] Canonical URL set

#### Content
- [ ] H1 tag on each page
- [ ] Heading hierarchy logical
- [ ] Alt text on images
- [ ] Internal linking structure

#### Technical
- [ ] robots.txt present
- [ ] sitemap.xml present
- [ ] 404 page exists
- [ ] HTTPS enabled (when deployed)

---

### 10. Data Integrity Testing

#### Projects Data
- [ ] All 16 projects in projects-data.js
- [ ] No duplicates (Blackbox_AI_Hackathon removed)
- [ ] Guillaume18100 filtered out
- [ ] Dates correct (2023-2025)
- [ ] URLs valid

#### Backup
- [ ] projects-data.backup.js exists
- [ ] Contains previous version
- [ ] Can restore if needed

---

## Testing Tools

### Browser DevTools
```javascript
// Check for console errors
console.log('No errors should appear');

// Test project count
console.log(projects.length); // Should be 16

// Verify no duplicates
const names = projects.map(p => p.name);
console.log(names.length === new Set(names).size); // Should be true
```

### Lighthouse
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Generate report"
5. Review scores and recommendations

### Responsive Testing
1. Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different devices:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)

---

## Common Issues & Fixes

### Images Not Loading
- Check file paths in projects-data.js
- Verify images exist in images/projects/
- Check browser console for 404 errors
- Ensure WebP support in browser

### Filters Not Working
- Check JavaScript console for errors
- Verify projects-data.js is loaded
- Test with browser DevTools debugger
- Check event listeners attached

### Layout Issues
- Clear browser cache
- Check CSS file loaded
- Verify no conflicting styles
- Test in incognito mode

### Performance Issues
- Optimize images (already WebP)
- Minify CSS/JS
- Enable caching
- Use CDN for assets

---

## Quick Test Commands

### Open in Browser
```bash
# macOS
open index.html
open projects.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Local Server (Better for testing)
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# Then open: http://localhost:8000
```

---

## Test Results Template

```markdown
## Test Results - [Date]

### Homepage
- ✅ Hero section displays correctly
- ✅ Featured projects load (6 shown)
- ✅ Images are high quality (FLUX Pro)
- ✅ Responsive on mobile
- ⚠️ Minor: Hover effect delay on Safari

### Projects Page
- ✅ All 16 projects display
- ✅ Filtering works (year, tech, search)
- ✅ AI titles are clear and professional
- ✅ AI descriptions are concise
- ❌ Issue: Modal doesn't close on mobile

### Performance
- ✅ Lighthouse: 95/100
- ✅ Load time: 1.8s
- ✅ No console errors

### Browser Compatibility
- ✅ Chrome: Perfect
- ✅ Firefox: Perfect
- ✅ Safari: Minor hover issue
- ✅ Edge: Perfect

### Issues Found
1. Modal close button not working on mobile - FIXED
2. Safari hover effect delay - ACCEPTABLE

### Overall Status
✅ READY FOR PRODUCTION
```

---

## Next Steps After Testing

1. **Fix any issues found**
2. **Optimize performance** (if needed)
3. **Deploy to production**
4. **Monitor GitHub Actions** (weekly syncs)
5. **Enjoy your automated portfolio!** 🎉
