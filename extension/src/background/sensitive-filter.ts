const SENSITIVE_PATTERNS = /password|passwd|pwd|credit|card|cvv|ssn|secret|token|auth|key|pin/i;

export function isSensitiveElement(el: Element | null): boolean {
  if (!el) return false;
  if (el instanceof HTMLInputElement) {
    if (el.type === 'password') return true;
    const name = el.name || el.id || '';
    if (SENSITIVE_PATTERNS.test(name)) return true;
    const placeholder = el.placeholder || '';
    if (SENSITIVE_PATTERNS.test(placeholder)) return true;
    const ariaLabel = el.getAttribute('aria-label') || '';
    if (SENSITIVE_PATTERNS.test(ariaLabel)) return true;
  }
  let parent = el.parentElement;
  while (parent) {
    const label = parent.getAttribute('aria-label') || '';
    if (SENSITIVE_PATTERNS.test(label)) return true;
    parent = parent.parentElement;
  }
  return false;
}

export function shouldBlockClick(target: Element | null): boolean {
  return isSensitiveElement(target);
}