const fs = require('fs');
const path = require('path');


const ROOT = path.join(process.cwd(), 'public');

// Get all HTML files using find
function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name === 'index.html') results.push(full);
  }
  return results;
}
const files = findHtmlFiles(ROOT);

console.log(`Found ${files.length} HTML files`);

// The Tools dropdown menu (shared across all nav types)
const TOOLS_DROPDOWN = `<div class="nav-dropdown">
          <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false">Tools <span class="nav-chevron" aria-hidden="true">&#9660;</span></button>
          <div class="nav-dropdown-menu" role="menu">
            <a href="/midjourney-prompt-generator/" role="menuitem">&#127912; Midjourney</a>
            <a href="/stable-diffusion-prompt-generator/" role="menuitem">&#9881;&#65039; Stable Diffusion</a>
            <a href="/flux-prompt-generator/" role="menuitem">&#9889; Flux AI</a>
            <a href="/dall-e-prompt-generator/" role="menuitem">&#129504; DALL&#xB7;E 3</a>
            <a href="/adobe-firefly-prompt-generator/" role="menuitem">&#129419; Adobe Firefly</a>
            <a href="/leonardo-ai-prompt-generator/" role="menuitem">&#127918; Leonardo AI</a>
            <a href="/ideogram-prompt-generator/" role="menuitem">&#9997;&#65039; Ideogram</a>
          </div>
        </div>`;

function getPageType(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  if (rel.includes('/public/fr/')) return 'fr';
  if (rel.includes('/public/ar/')) return 'ar';
  if (rel.includes('/public/es/')) return 'es';
  if (rel.includes('/public/ja/')) return 'ja';
  if (rel.includes('/public/ko/')) return 'ko';
  if (rel.includes('/public/blog/')) return 'en-blog';
  return 'en';
}

function isBlogPage(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  return rel.includes('/blog/') && !rel.endsWith('/blog/index.html');
}

function buildNav(filePath) {
  const type = getPageType(filePath);
  const inBlog = isBlogPage(filePath);

  if (type === 'fr') {
    const inFrBlog = filePath.replace(/\\/g, '/').includes('/fr/blog/');
    return `<nav class="site-nav" aria-label="Navigation principale">
        ${TOOLS_DROPDOWN}
        <a href="/fr/blog/"${inFrBlog ? ' class="active"' : ''}>Blog</a>
        <a href="/fr/" class="nav-try-free">Essayer &#8594;</a>
      </nav>`;
  }

  if (type === 'ar') {
    const inArBlog = filePath.replace(/\\/g, '/').includes('/ar/blog/');
    return `<nav class="site-nav" aria-label="&#1575;&#1604;&#1578;&#1606;&#1602;&#1604; &#1575;&#1604;&#1585;&#1574;&#1610;&#1587;&#1610;">
        ${TOOLS_DROPDOWN}
        <a href="/ar/blog/"${inArBlog ? ' class="active"' : ''}>&#1575;&#1604;&#1605;&#1583;&#1608;&#1606;&#1577;</a>
        <a href="/ar/" class="nav-try-free">&#1580;&#1585;&#1617;&#1576; &#8594;</a>
      </nav>`;
  }

  // ES/JA/KO — same as EN
  return `<nav class="site-nav" aria-label="Main navigation">
        ${TOOLS_DROPDOWN}
        <a href="/blog/"${inBlog ? ' class="active"' : ''}>Blog</a>
        <a href="/" class="nav-try-free">Try Free &#8594;</a>
      </nav>`;
}

function buildLogoHtml(href, subtitle) {
  return `<a href="${href}" class="site-logo"><img src="/favicon.svg" alt="ImageToPrompt" width="40" height="40"><div class="site-logo-text">Image<span class="accent">To</span>Prompt<span class="site-logo-sub">${subtitle}</span></div></a>`;
}

const FOOTER_LANG = `<div class="footer-lang">
        <span class="footer-lang-label">Language:</span>
        <a href="/">English</a><span class="footer-lang-sep">&#xB7;</span><a href="/fr/">Fran&#231;ais</a><span class="footer-lang-sep">&#xB7;</span><a href="/ar/">&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;</a>
      </div>`;

let updated = 0;
let skipped = 0;

for (const filePath of files) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const type = getPageType(filePath);

  // ── 1. Update logo ──────────────────────────────────────────────────────────
  // Match: <a href="HREF" class="site-logo"><img ...>Image<span class="accent">To</span>Prompt</a>
  // Some pages already have .site-logo-text wrapper — skip those
  if (!html.includes('site-logo-text')) {
    const logoRe = /<a href="([^"]*)" class="site-logo"><img[^>]*>Image<span class="accent">To<\/span>Prompt<\/a>/;
    if (logoRe.test(html)) {
      const match = html.match(logoRe);
      const href = match[1];
      let subtitle = 'Free AI Prompt Generator';
      if (type === 'fr') subtitle = 'G&#233;n&#233;rateur de Prompts IA Gratuit';
      if (type === 'ar') subtitle = '&#1605;&#1608;&#1604;&#1617;&#1583; &#1576;&#1585;&#1608;&#1605;&#1576;&#1578; &#1605;&#1580;&#1575;&#1606;&#1610;';
      html = html.replace(logoRe, buildLogoHtml(href, subtitle));
      changed = true;
    }
  }

  // ── 2. Replace nav ──────────────────────────────────────────────────────────
  const navRe = /<nav class="site-nav"[^>]*>[\s\S]*?<\/nav>/;
  const newNav = buildNav(filePath);
  if (navRe.test(html)) {
    html = html.replace(navRe, newNav);
    changed = true;
  }

  // ── 3. Add footer-lang ──────────────────────────────────────────────────────
  if (!html.includes('footer-lang')) {
    // For site-footer (blog posts, FR, AR): insert before </div>\n  </footer> (inner closing)
    // For site-footer-simple (model, vs pages): insert before <p class="footer-copy"> or before inline <p style=...>©
    if (html.includes('class="site-footer"')) {
      // Insert inside .inner, before its closing </div>
      html = html.replace(
        /(<\/nav>\s*\n\s*<\/div>\s*\n\s*<\/footer>)/,
        `${'</nav>'}\n      ${FOOTER_LANG}\n    </div>\n  </footer>`
      );
      // If above didn't match, try simpler pattern
      if (!html.includes('footer-lang')) {
        html = html.replace(
          /(\s*<\/div>\s*\n\s*<\/footer class="site-footer">|\s*<\/div>\s*\n\s*<\/footer>(?=\s*\n\s*<script|$))/,
          `\n      ${FOOTER_LANG}\n    </div>\n  </footer>`
        );
      }
      changed = true;
    } else if (html.includes('site-footer-simple')) {
      // Insert before <p class="footer-copy"> or before closing </div>
      if (html.includes('class="footer-copy"')) {
        html = html.replace(
          /(\s*<p class="footer-copy">)/,
          `\n      ${FOOTER_LANG}\n$1`
        );
      } else {
        // Insert before last </div></footer> combo
        html = html.replace(
          /(\s*<p [^>]*>&#169; 2026|\s*<p [^>]*>&copy; 2026|\s*<p style="[^"]*">&#169; 2026|\s*<p style="[^"]*">© 2026)/,
          `\n      ${FOOTER_LANG}\n$1`
        );
      }
      changed = true;
    }
  }

  // ── 4. Add nav.js script ────────────────────────────────────────────────────
  if (!html.includes('/nav.js')) {
    html = html.replace('</body>', '<script src="/nav.js" defer></script>\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    updated++;
    console.log('Updated:', path.relative(ROOT, filePath));
  } else {
    skipped++;
  }
}

console.log(`\nDone: updated ${updated}, skipped ${skipped}`);
