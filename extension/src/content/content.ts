// Content script — tracks clicks and scroll on every page.
// Does NOT track input values or sensitive fields.

let scrollTimer: ReturnType<typeof setTimeout> | null = null;

const SENSITIVE_PATTERNS = /password|passwd|pwd|credit|card|cvv|ssn|secret|token|auth|key|pin/i;

function isSensitiveElement(el: Element | null): boolean {
  if (!el) return false;
  if (el instanceof HTMLInputElement && el.type === 'password') return true;
  const name = (el instanceof HTMLElement) ? (el.getAttribute('name') || el.id || '') : '';
  if (name && SENSITIVE_PATTERNS.test(name)) return true;
  const placeholder = (el instanceof HTMLInputElement) ? (el.placeholder || '') : '';
  if (placeholder && SENSITIVE_PATTERNS.test(placeholder)) return true;
  return false;
}

function buildClickPayload(target: Element): Record<string, unknown> {
  const tag = target.tagName?.toLowerCase() || 'unknown';
  const text = (target.textContent || '').trim().slice(0, 100);
  const classList = (target as HTMLElement).className
    ? (target as HTMLElement).className.toString().slice(0, 80)
    : '';
  const elId = target.id || '';

  return {
    clickTarget: tag,
    clickText: text || null,
    clickClass: classList || null,
    clickId: elId || null,
    clickX: (target as HTMLElement).offsetLeft,
    clickY: (target as HTMLElement).offsetTop,
  };
}

document.addEventListener('click', (event) => {
  const target = event.target as Element;
  if (isSensitiveElement(target)) return;

  chrome.runtime.sendMessage({
    kind: 'tabtrail-activity',
    type: 'click',
    payload: buildClickPayload(target),
  }).catch(() => {});
}, { passive: true });

document.addEventListener('scroll', () => {
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    const percent = scrollHeight > 0 ? Math.round((scrollY / scrollHeight) * 100) : 0;

    chrome.runtime.sendMessage({
      kind: 'tabtrail-activity',
      type: 'scroll',
      payload: {
        scrollY,
        scrollHeight,
        scrollPercent: percent,
      },
    }).catch(() => {});
  }, 500);
}, { passive: true });