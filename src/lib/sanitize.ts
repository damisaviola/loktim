/**
 * Lightweight, zero-dependency HTML & Text Sanitizer
 * Safe for all Next.js environments (Serverless, Edge, Node.js, Browser)
 * Eliminates ERR_REQUIRE_ESM / jsdom / canvas runtime dependency errors on Vercel/Lambda.
 */

// Tags that are completely safe for rich text content formatting
const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'i', 'li', 'ol', 'p', 'pre', 's', 'small', 'span', 'strong', 'sub', 'sup', 'u', 'ul'
]);

// Tags whose contents should be completely stripped along with the tag
const DANGEROUS_TAG_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^>]*>/gi,
  /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi,
  /<meta\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<base\b[^>]*>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
  /<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi,
];

/**
 * Sanitizes rich text HTML content for safe rendering with dangerouslySetInnerHTML.
 * Removes all script/iframe/embed/style tags, event handlers (on*), javascript: URIs,
 * and untrusted HTML elements.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== 'string') return '';

  let clean = dirty;

  // 1. Strip dangerous tags with their contents (script, style, iframe, etc.)
  for (const pattern of DANGEROUS_TAG_PATTERNS) {
    clean = clean.replace(pattern, '');
  }

  // 2. Remove all inline event handlers (onerror, onload, onclick, onmouseover, etc.)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Remove javascript:, vbscript:, data: URIs in href or src attributes
  clean = clean.replace(/(?:href|src)\s*=\s*(?:"\s*(?:javascript|vbscript|data):[^"]*"|'\s*(?:javascript|vbscript|data):[^']*'|(?:javascript|vbscript|data):[^\s>]+)/gi, '');

  // 4. Filter remaining HTML tags to only keep allowed tags
  clean = clean.replace(/<\/?([a-zA-Z0-9]+)(?:\s+([^>]*))?\/?>/g, (match, tagName, attributes) => {
    const lowerTag = tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(lowerTag)) {
      return ''; // Strip non-allowed tags
    }

    // If it's a closing tag
    if (match.startsWith('</')) {
      return `</${lowerTag}>`;
    }

    // If it's a self-closing or opening tag with attributes
    if (!attributes) {
      return `<${lowerTag}>`;
    }

    // Clean attributes - only allow safe attributes (href, target, rel, class)
    const cleanedAttrs: string[] = [];
    const attrRegex = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Skip any event handlers or dangerous attributes
      if (attrName.startsWith('on')) continue;

      if (lowerTag === 'a' && attrName === 'href') {
        const trimmedVal = attrValue.trim().toLowerCase();
        if (trimmedVal.startsWith('http://') || trimmedVal.startsWith('https://') || trimmedVal.startsWith('mailto:') || trimmedVal.startsWith('tel:') || trimmedVal.startsWith('/')) {
          cleanedAttrs.push(`href="${escapeAttr(attrValue)}"`);
          cleanedAttrs.push('rel="noopener noreferrer"');
          cleanedAttrs.push('target="_blank"');
        }
      } else if (attrName === 'class') {
        cleanedAttrs.push(`class="${escapeAttr(attrValue)}"`);
      }
    }

    return cleanedAttrs.length > 0 ? `<${lowerTag} ${cleanedAttrs.join(' ')}>` : `<${lowerTag}>`;
  });

  return clean;
}

/**
 * Escapes characters for HTML attributes
 */
function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Strips all HTML tags and leaves clean plain text
 */
export function sanitizeText(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== 'string') return '';
  return dirty
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Drop-in DOMPurify compatibility helper
 */
const DOMPurify = {
  sanitize: (input: string): string => sanitizeHtml(input),
};

export default DOMPurify;
