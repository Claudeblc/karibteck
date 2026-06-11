// Cal.com inline embed bootstrap.
// Reads the booking link from the mount node's `data-cal-link` attribute,
// loads the official embed.js, then renders the inline calendar.
declare global {
  interface Window {
    Cal?: (action: string, options?: Record<string, unknown>) => void;
  }
}

const SELECTOR = '#cal-inline';
const EMBED_SRC = 'https://app.cal.com/embed/embed.js';

function render(calLink: string): void {
  if (typeof window.Cal !== 'function') {
    window.setTimeout(() => render(calLink), 120);
    return;
  }
  window.Cal('init', { origin: 'https://cal.com' });
  window.Cal('inline', {
    elementOrSelector: SELECTOR,
    calLink,
    layout: 'month_view',
  });
}

const mount = document.querySelector<HTMLElement>(SELECTOR);
const calLink = mount?.dataset.calLink;

if (mount && calLink) {
  if (!document.querySelector(`script[src="${EMBED_SRC}"]`)) {
    const script = document.createElement('script');
    script.src = EMBED_SRC;
    script.async = true;
    document.head.appendChild(script);
  }
  render(calLink);
}

export {};
