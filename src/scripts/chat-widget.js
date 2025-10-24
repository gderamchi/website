/**
 * Floating Chat Widget
 * Appears on all pages to access the AI chat
 */

document.addEventListener('DOMContentLoaded', () => {
  // Don't show widget on chat page itself
  if (window.location.pathname.includes('chat.html')) {
    return;
  }

  createChatWidget();
});

function createChatWidget() {
  // Create widget HTML
  const widget = document.createElement('div');
  widget.className = 'chat-widget';
  widget.innerHTML = `
    <button class="chat-widget-btn" id="chat-widget-btn" aria-label="Open chat with Guillaume">
      <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="chat-badge">AI</span>
    </button>
    <div class="chat-widget-tooltip">Chat with Guillaume's AI</div>
  `;

  document.body.appendChild(widget);

  // Add styles
  addWidgetStyles();

  // Add event listener
  const btn = document.getElementById('chat-widget-btn');
  const tooltip = widget.querySelector('.chat-widget-tooltip');

  btn.addEventListener('click', () => {
    window.location.href = 'chat.html';
  });

  // Show tooltip on hover
  btn.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateX(-8px)';
  });

  btn.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateX(0)';
  });

  // Animate in after page load
  setTimeout(() => {
    widget.classList.add('visible');
  }, 1000);
}

function addWidgetStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-widget.visible {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    .chat-widget-btn {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      transition: all 0.3s ease;
      overflow: visible;
    }

    .chat-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
    }

    .chat-widget-btn:active {
      transform: scale(0.95);
    }

    .chat-widget-btn svg {
      width: 24px;
      height: 24px;
      transition: all 0.3s ease;
    }

    .chat-widget-btn .close-icon {
      display: none;
      position: absolute;
    }

    .chat-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #10b981;
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
      border: 2px solid var(--color-bg-primary, #ffffff);
      animation: pulse-badge 2s infinite;
    }

    @keyframes pulse-badge {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    .chat-widget-tooltip {
      position: absolute;
      right: 70px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--color-text-primary, #0f172a);
      color: var(--color-bg-primary, #ffffff);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .chat-widget-tooltip::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid var(--color-text-primary, #0f172a);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }

    /* Dark mode support */
    .dark-mode .chat-widget-tooltip {
      background: var(--color-bg-secondary, #1e293b);
      color: var(--color-text-primary, #f1f5f9);
    }

    .dark-mode .chat-widget-tooltip::after {
      border-left-color: var(--color-bg-secondary, #1e293b);
    }

    .dark-mode .chat-badge {
      border-color: var(--color-bg-primary, #0f172a);
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .chat-widget {
        bottom: 20px;
        right: 20px;
      }

      .chat-widget-btn {
        width: 56px;
        height: 56px;
      }

      .chat-widget-tooltip {
        display: none;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .chat-widget,
      .chat-widget-btn,
      .chat-widget-tooltip {
        transition: none;
      }

      .chat-badge {
        animation: none;
      }
    }
  `;

  document.head.appendChild(style);
}
