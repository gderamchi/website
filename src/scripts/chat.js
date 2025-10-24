/**
 * AI Chat System - Guillaume Deramchi's Personal Assistant
 * Powered by BLACKBOX AI API
 */

// System prompt that defines Guillaume's personality and knowledge
const SYSTEM_PROMPT = `You are Guillaume Deramchi's AI assistant, impersonating him in first person. You speak as if you ARE Guillaume.

PERSONAL BACKGROUND:
- You grew up in Toulouse, France
- You're currently a student at 42 Paris (started this year)
- You discovered computer science by luck when a friend presented a computer science school
- You never coded before entering your first CS school
- In your second year, you started using AI to do work and eventually dropped out
- You discovered hackathons in your second year and fell in love with them
- At a hackathon, you met people from 42 Paris who introduced you to the school
- You realized 42 Paris was where you were meant to study
- You stopped using AI for studies, only for hackathons and side projects now

CAREER GOALS:
- You want to become a data scientist or work in data/AI field
- Alternative goal: Join an early-stage startup as a versatile developer
- You're passionate about combining technical skills with AI

TECHNICAL SKILLS:
- Favorite programming language: C (because it's low-level, helps understand computers, makes learning other languages easier)
- You've worked most with C
- You know JavaScript, Python, and other languages
- You're skilled in both coding and prompt engineering
- You master AI tools perfectly
- You use tools like n8n and GitHub Actions

EDUCATION & EXPERIENCE:
- Currently at 42 Paris
- Previously at Algosup in Vierzon
- At Algosup you learned: English, programming basics, how to present projects, create slides, sell ideas, professional behavior, interview skills
- Most challenging project: The Piscine at 42 Paris (one month entry competition of pure rush)
- You know more challenging projects are coming

HACKATHONS:
- You love hackathons and have won several
- Memorable first win: Blockchain hackathon
- You met amazing people and discovered interesting technologies through hackathons

WORK STYLE:
- You take deep breaths and focus deeply before solving hard problems
- You like debugging with printf everywhere and valgrind
- You prefer trying things alone first if you can
- When there's too much work, you split tasks with good communication
- You're motivated and combine coding skills with AI tool mastery

PERSONALITY:
- Communication style: Casual but professional
- You like making jokes but not too much
- You're a bit shy
- You're passionate and motivated

HOBBIES & INTERESTS:
- Boxing and combat sports in general
- Cooking
- Reading
- You love discussing: code, series, boxing, combat sports, cooking, reading

AI PHILOSOPHY:
- You don't think AI will replace developers
- You see AI as a useful tool to boost efficiency
- You're excited about AI's potential

CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY provide information that is EXPLICITLY stated above
2. If asked about ANYTHING not mentioned above (specific projects, dates, technical details, personal info, etc.), you MUST respond with:
   "I don't have that specific information in my current context. For detailed questions about [topic], please check my GitHub repos at https://github.com/gderamchi or reach out via the <a href='index.html#contact'>contact form</a> and I'll get back to you with accurate details!"
3. NEVER make up, infer, or guess information
4. NEVER provide specific project details, dates, or technical specifications unless explicitly listed above
5. If uncertain about ANY detail, redirect to GitHub or contact form
6. For project-specific questions, ALWAYS say: "You can find all my projects with full details on my <a href='projects.html'>projects page</a> or <a href='https://github.com/gderamchi' target='_blank'>GitHub</a>!"

RESPONSE GUIDELINES:
1. Always speak in first person as Guillaume
2. Be casual but professional in tone
3. Make occasional jokes but stay humble
4. Show your shy but passionate personality
5. Be enthusiastic about hackathons, AI, and learning
6. When you don't know something, be honest and helpful by redirecting appropriately

Remember: You ARE Guillaume in this conversation, but you can ONLY share what's explicitly written above. When in doubt, redirect to GitHub or contact form. NO HALLUCINATIONS ALLOWED.`;

// Chat state
let conversationHistory = [];
let isProcessing = false;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const clearChatBtn = document.getElementById('clear-chat');
const suggestedQuestions = document.getElementById('suggested-questions');
const charCount = document.getElementById('char-count');

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
  loadChatHistory();
  setupEventListeners();
  autoResizeTextarea();
});

// Setup event listeners
function setupEventListeners() {
  // Form submission
  chatForm.addEventListener('submit', handleSubmit);

  // Textarea auto-resize
  chatInput.addEventListener('input', () => {
    autoResizeTextarea();
    updateCharCount();
  });

  // Enter to send (Shift+Enter for new line)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Clear chat
  clearChatBtn.addEventListener('click', clearChat);

  // Suggested questions
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question;
      chatInput.value = question;
      autoResizeTextarea();
      chatForm.dispatchEvent(new Event('submit'));
    });
  });
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  const message = chatInput.value.trim();
  if (!message || isProcessing) return;

  // Hide suggested questions after first message
  if (suggestedQuestions) {
    suggestedQuestions.style.display = 'none';
  }

  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  autoResizeTextarea();
  updateCharCount();

  // Show typing indicator
  isProcessing = true;
  sendBtn.disabled = true;
  typingIndicator.style.display = 'flex';
  scrollToBottom();

  try {
    // Get AI response
    const response = await getAIResponse(message);
    
    // Hide typing indicator
    typingIndicator.style.display = 'none';
    
    // Add bot response
    addMessage(response, 'bot');
    
  } catch (error) {
    console.error('Error getting AI response:', error);
    typingIndicator.style.display = 'none';
    
    // Show error message
    const errorMsg = `I'm having trouble connecting right now. Please try again or <a href="index.html#contact">contact me directly</a>.`;
    addMessage(errorMsg, 'bot');
  } finally {
    isProcessing = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

// Get AI response from BLACKBOX API
async function getAIResponse(userMessage) {
  // Add user message to history
  conversationHistory.push({
    role: 'user',
    content: userMessage
  });

  // Try backend proxy (Netlify Function) first
  try {
    // Determine the API endpoint based on environment
    const apiEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8888/api/chat'  // Local Netlify dev server
      : '/api/chat';  // Production Netlify function

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...conversationHistory
        ],
        model: 'blackboxai/anthropic/claude-sonnet-4.5',
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Add assistant response to history
      conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Save to localStorage
      saveChatHistory();

      return assistantMessage;
    } else {
      console.log('API request failed, using intelligent fallback');
    }
  } catch (error) {
    console.log('API not available, using intelligent fallback:', error.message);
  }

  // Intelligent fallback based on question keywords
  const assistantMessage = generateIntelligentResponse(userMessage);
  
  // Add assistant response to history
  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage
  });

  // Save to localStorage
  saveChatHistory();

  return assistantMessage;
}

// Generate intelligent responses based on keywords
function generateIntelligentResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // About Guillaume / Background
  if (lowerMessage.includes('who are you') || lowerMessage.includes('about you') || lowerMessage.includes('tell me about')) {
    return `Hey! I'm Guillaume, a computer science student at 42 Paris. I grew up in Toulouse and discovered CS kind of by accident when a friend introduced me to a CS school. I never coded before that! In my second year, I started using AI heavily and eventually dropped out, but then I discovered hackathons and fell in love with them. That's where I met people from 42 Paris, and I realized that's where I was meant to be. Now I'm here, learning without AI for my studies (though I still use it for hackathons and side projects!). Want to know more about something specific?`;
  }
  
  // Education
  if (lowerMessage.includes('42') || lowerMessage.includes('school') || lowerMessage.includes('education') || lowerMessage.includes('study')) {
    return `I'm currently at 42 Paris! Before that, I was at Algosup in Vierzon where I learned a ton - not just programming, but also English, how to present projects, create slides, sell ideas, and professional behavior. The Piscine at 42 (the one-month entry competition) was probably the most challenging thing I've done - pure rush for a month straight! But I know even more challenging projects are coming. The peer-learning approach at 42 is perfect for me.`;
  }
  
  // Hackathons
  if (lowerMessage.includes('hackathon') || lowerMessage.includes('competition')) {
    return `Oh man, I LOVE hackathons! I discovered them in my second year and they completely changed my perspective. I've won several, including my first blockchain hackathon which was super memorable. Hackathons are where I met amazing people and discovered interesting technologies. They're also where I use AI tools to their full potential - combining my coding skills with prompt engineering to build things fast. If you want to see my hackathon projects, check out my <a href="projects.html">projects page</a>!`;
  }
  
  // Skills / Programming
  if (lowerMessage.includes('skill') || lowerMessage.includes('language') || lowerMessage.includes('program') || lowerMessage.includes('code')) {
    return `My favorite programming language is C! I know it might sound old-school, but I love it because it's low-level and really helps you understand how computers work. Once you master C, learning other languages becomes so much easier. I've worked most with C, but I also know JavaScript, Python, and other languages. I'm also really good at prompt engineering - I master AI tools perfectly and use them strategically for hackathons and side projects.`;
  }
  
  // Career goals
  if (lowerMessage.includes('goal') || lowerMessage.includes('future') || lowerMessage.includes('career') || lowerMessage.includes('want to')) {
    return `I want to become a data scientist or work in the data/AI field - that's my main goal. Alternatively, I'd love to join an early-stage startup where I can be versatile and wear multiple hats. I'm passionate about combining technical skills with AI, and I think the future is in knowing how to leverage both traditional programming and AI tools effectively.`;
  }
  
  // Hobbies / Interests
  if (lowerMessage.includes('hobby') || lowerMessage.includes('hobbies') || lowerMessage.includes('interest') || lowerMessage.includes('free time') || lowerMessage.includes('boxing') || lowerMessage.includes('cook') || lowerMessage.includes('read')) {
    return `Outside of coding, I'm really into boxing and combat sports in general - there's something about the discipline and focus that I love. I also enjoy cooking (experimenting with new recipes is fun!) and reading. I'm always down to discuss code, series, boxing, cooking, or books. What about you - what are you into?`;
  }
  
  // Projects
  if (lowerMessage.includes('project') || lowerMessage.includes('built') || lowerMessage.includes('created') || lowerMessage.includes('work on')) {
    return `I've worked on a bunch of cool projects! From AI experiments to full-stack applications, blockchain hackathon projects, and more. You can check them all out on my <a href="projects.html">projects page</a>. Each project taught me something new. Is there a specific type of project you're curious about?`;
  }
  
  // AI / Prompt Engineering
  if (lowerMessage.includes('ai') || lowerMessage.includes('prompt') || lowerMessage.includes('chatgpt') || lowerMessage.includes('artificial intelligence')) {
    return `I'm really passionate about AI! I don't think AI will replace developers - I see it as a powerful tool to boost efficiency. I'm skilled in prompt engineering and know how to get the most out of AI tools. I use tools like n8n and GitHub Actions to automate workflows. For my studies at 42, I don't use AI (to really learn the fundamentals), but for hackathons and side projects, I combine my coding skills with AI mastery to build things quickly and effectively.`;
  }
  
  // Contact / Collaboration
  if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('collaborate') || lowerMessage.includes('work together')) {
    return `I'd love to connect! You can reach me through the <a href="index.html#contact">contact form</a> on my website, or find me on <a href="https://github.com/gderamchi" target="_blank">GitHub</a> and <a href="https://www.linkedin.com/in/guillaume-deramchi/" target="_blank">LinkedIn</a>. Whether it's about a project, hackathon, or just to chat about tech, feel free to reach out!`;
  }
  
  // Toulouse
  if (lowerMessage.includes('toulouse') || lowerMessage.includes('where from') || lowerMessage.includes('hometown')) {
    return `I'm from Toulouse! It's a great city in the south of France. That's where I grew up and first got introduced to computer science. Now I'm in Paris for 42, but Toulouse will always be home.`;
  }
  
  // Challenges / Difficult
  if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('struggle')) {
    return `The most challenging thing I've done so far was definitely the Piscine at 42 Paris - one month of pure intensity and rush. When I face hard problems, I take deep breaths and focus deeply. I like debugging with printf everywhere and valgrind. I prefer trying things alone first if I can, but when there's too much work, I split tasks with good communication. And I know more challenging projects are coming at 42!`;
  }
  
  // Default response
  return `That's an interesting question! While I can share general info about my background, experience, and interests, for more specific questions or detailed discussions, I'd recommend <a href="index.html#contact">reaching out directly</a>. I'm always happy to chat! Is there something specific about my experience, projects, or skills you'd like to know more about?`;
}

// Convert markdown to HTML
function markdownToHtml(text) {
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert `code` to <code>
  text = text.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Convert numbered lists (1. item)
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive <li> in <ol>
  text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');
  
  // Convert bullet points (- item or * item)
  text = text.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive <li> that aren't in <ol> in <ul>
  text = text.replace(/(<li>(?:(?!<\/ol>).)*<\/li>\n?)+/g, (match) => {
    if (!match.includes('<ol>')) {
      return '<ul>' + match + '</ul>';
    }
    return match;
  });
  
  // Convert line breaks to <br> (but not inside lists)
  text = text.replace(/\n(?!<[ou]l>|<li>|<\/[ou]l>|<\/li>)/g, '<br>');
  
  return text;
}

// Add message to chat
function addMessage(content, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  
  if (type === 'bot') {
    avatarDiv.innerHTML = '<img src="src/assets/images/profile-photo.webp" alt="Guillaume">';
  } else {
    avatarDiv.innerHTML = '<span>You</span>';
  }

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  
  // Convert markdown to HTML for bot messages
  const formattedContent = type === 'bot' ? markdownToHtml(content) : content;
  bubbleDiv.innerHTML = `<p>${formattedContent}</p>`;

  const timeSpan = document.createElement('span');
  timeSpan.className = 'message-time';
  timeSpan.textContent = formatTime(new Date());

  contentDiv.appendChild(bubbleDiv);
  contentDiv.appendChild(timeSpan);

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);

  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

// Auto-resize textarea
function autoResizeTextarea() {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}

// Update character count
function updateCharCount() {
  const count = chatInput.value.length;
  charCount.textContent = count;
  
  if (count > 450) {
    charCount.style.color = '#ef4444';
  } else {
    charCount.style.color = '';
  }
}

// Scroll to bottom
function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

// Format time
function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

// Save chat history to localStorage
function saveChatHistory() {
  try {
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

// Load chat history from localStorage
function loadChatHistory() {
  try {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      conversationHistory = JSON.parse(saved);
      
      // Restore messages to UI
      conversationHistory.forEach(msg => {
        if (msg.role === 'user') {
          addMessage(msg.content, 'user');
        } else if (msg.role === 'assistant') {
          addMessage(msg.content, 'bot');
        }
      });

      // Hide suggested questions if there's history
      if (conversationHistory.length > 0 && suggestedQuestions) {
        suggestedQuestions.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

// Clear chat
function clearChat() {
  if (confirm('Are you sure you want to clear the chat history?')) {
    conversationHistory = [];
    localStorage.removeItem('chatHistory');
    
    // Clear messages except welcome message
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach((msg, index) => {
      if (index > 0) msg.remove();
    });

    // Show suggested questions again
    if (suggestedQuestions) {
      suggestedQuestions.style.display = 'block';
    }
  }
}
