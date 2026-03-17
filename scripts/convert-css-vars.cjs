/**
 * Convert hardcoded colors to CSS variables in blog.css and model-pages.css
 */
const fs = require('fs');
const path = require('path');

function convertColors(css) {
  // Order matters: more specific patterns first

  // Background colors
  css = css.replace(/background:\s*#080810\b/g, 'background: var(--bg-base)');
  css = css.replace(/background-color:\s*#080810\b/g, 'background-color: var(--bg-base)');

  css = css.replace(/background:\s*#0e0e1a\b/g, 'background: var(--bg-surface)');
  css = css.replace(/background-color:\s*#0e0e1a\b/g, 'background-color: var(--bg-surface)');
  css = css.replace(/background:\s*#0d0d1a\b/g, 'background: var(--bg-surface)');
  css = css.replace(/background-color:\s*#0d0d1a\b/g, 'background-color: var(--bg-surface)');

  // Footer gradient → use footer-bg as background-color
  css = css.replace(
    /background:\s*linear-gradient\(180deg,\s*#0e0e1a\s*0%,\s*#080810\s*100%\)/g,
    'background: var(--footer-bg)'
  );
  css = css.replace(
    /background:\s*linear-gradient\(180deg,\s*#0e0e1a,\s*#080810\)/g,
    'background: var(--footer-bg)'
  );

  // Nav background
  css = css.replace(/background:\s*rgba\(8,8,16,0\.9\)/g, 'background: var(--nav-bg)');
  css = css.replace(/background:\s*rgba\(8,8,16,0\.88\)/g, 'background: var(--nav-bg)');
  css = css.replace(/background:\s*rgba\(13,13,26,0\.95\)/g, 'background: var(--nav-bg)');

  // bg-card
  css = css.replace(/background:\s*rgba\(255,255,255,0\.025\)/g, 'background: var(--bg-card)');
  css = css.replace(/background:\s*rgba\(255,255,255,0\.02\)/g, 'background: var(--bg-card)');
  css = css.replace(/background:\s*rgba\(255,255,255,0\.03\)/g, 'background: var(--bg-card)');

  // bg-code (0.04, 0.05 - used for code backgrounds)
  css = css.replace(/background:\s*rgba\(255,255,255,0\.04\)/g, 'background: var(--bg-code)');
  css = css.replace(/background:\s*rgba\(255,255,255,0\.05\)/g, 'background: var(--bg-code)');
  css = css.replace(/background-color:\s*rgba\(255,255,255,0\.04\)/g, 'background-color: var(--bg-code)');

  // Text colors
  css = css.replace(/color:\s*#f5f5ff\b/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*#e0e0f5\b/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*#d0d0ff\b/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*#e8e8f8\b/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*#e0e0f0\b/g, 'color: var(--text-primary)');

  css = css.replace(/color:\s*#c0c0dd\b/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*#c0c0e0\b/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*#a0a0cc\b/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*#a0a0dd\b/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*#b0b0cc\b/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*#c8c8e8\b/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*#b0a8d0\b/g, 'color: var(--text-secondary)');

  css = css.replace(/color:\s*#9090bb\b/g, 'color: var(--text-muted)');
  css = css.replace(/color:\s*#9090cc\b/g, 'color: var(--text-muted)');
  css = css.replace(/color:\s*#8888bb\b/g, 'color: var(--text-muted)');
  css = css.replace(/color:\s*#7070aa\b/g, 'color: var(--text-muted)');

  css = css.replace(/color:\s*#6060aa\b/g, 'color: var(--text-dim)');
  css = css.replace(/color:\s*#6060bb\b/g, 'color: var(--text-dim)');
  css = css.replace(/color:\s*#6660a0\b/g, 'color: var(--text-dim)');
  css = css.replace(/color:\s*#3a3a66\b/g, 'color: var(--text-dim)');

  // Accent
  // Keep the logo gradient as-is (background: linear-gradient(135deg, #e040fb, #f06292))
  // We replace standalone color: #e040fb but not the logo gradient
  css = css.replace(/color:\s*#e040fb\b/g, 'color: var(--accent)');
  // border-left with accent
  css = css.replace(/border-left:\s*3px solid #e040fb\b/g, 'border-left: 3px solid var(--accent)');

  // accent-dim
  css = css.replace(/rgba\(224,64,251,0\.06\)/g, 'var(--accent-dim)');
  css = css.replace(/rgba\(224,64,251,0\.07\)/g, 'var(--accent-dim)');
  css = css.replace(/rgba\(224,64,251,0\.08\)/g, 'var(--accent-dim)');
  css = css.replace(/rgba\(224,64,251,0\.09\)/g, 'var(--accent-dim)');
  css = css.replace(/rgba\(224,64,251,0\.12\)/g, 'var(--accent-dim)');

  // accent-border
  css = css.replace(/rgba\(224,64,251,0\.2\)/g, 'var(--accent-border)');
  css = css.replace(/rgba\(224,64,251,0\.25\)/g, 'var(--accent-border)');
  css = css.replace(/rgba\(224,64,251,0\.3\)/g, 'var(--accent-border)');
  css = css.replace(/rgba\(224,64,251,0\.35\)/g, 'var(--accent-border)');
  css = css.replace(/rgba\(224,64,251,0\.4\)/g, 'var(--accent-border)');

  // code-text
  css = css.replace(/color:\s*#a78bfa\b/g, 'color: var(--code-text)');
  css = css.replace(/color:\s*#c084fc\b/g, 'color: var(--code-text)');
  css = css.replace(/color:\s*#c4b5fd\b/g, 'color: var(--code-text)');

  // Border colors
  // border-subtle (0.06)
  css = css.replace(/rgba\(255,255,255,0\.06\)/g, 'var(--border-subtle)');
  // border-card (0.07, 0.08)
  css = css.replace(/rgba\(255,255,255,0\.07\)/g, 'var(--border-card)');
  css = css.replace(/rgba\(255,255,255,0\.08\)/g, 'var(--border-card)');
  // border-mid (0.1, 0.10, 0.12)
  css = css.replace(/rgba\(255,255,255,0\.1\b\)/g, 'var(--border-mid)');
  css = css.replace(/rgba\(255,255,255,0\.10\)/g, 'var(--border-mid)');
  css = css.replace(/rgba\(255,255,255,0\.12\)/g, 'var(--border-mid)');

  // shadow-card
  css = css.replace(/0 8px 40px rgba\(0,0,0,0\.5\)/g, 'var(--shadow-card)');
  css = css.replace(/0 4px 24px rgba\(0,0,0,0\.3\)/g, 'var(--shadow-card)');

  return css;
}

// Process blog.css
const blogPath = path.join(__dirname, '../public/blog.css');
let blogCss = fs.readFileSync(blogPath, 'utf8');
blogCss = convertColors(blogCss);
fs.writeFileSync(blogPath, blogCss, 'utf8');
console.log('blog.css converted');

// Process model-pages.css
const modelPath = path.join(__dirname, '../public/model-pages.css');
let modelCss = fs.readFileSync(modelPath, 'utf8');
modelCss = convertColors(modelCss);
fs.writeFileSync(modelPath, modelCss, 'utf8');
console.log('model-pages.css converted');
