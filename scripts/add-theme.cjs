/**
 * Add theme.css + theme-toggle.js + toggle button to all static HTML pages
 */
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const publicDir = path.join(__dirname, '../public');

// Find all HTML files
const htmlFiles = globSync('**/*.html', { cwd: publicDir, absolute: true });

let updated = 0;
let skipped = 0;

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already has theme.css
  if (html.includes('/theme.css')) {
    skipped++;
    continue;
  }

  let changed = false;

  // 1. Add theme-toggle.js right after <head> (or <head ...>)
  if (!html.includes('/theme-toggle.js')) {
    html = html.replace(
      /(<head[^>]*>)/i,
      '$1\n  <script src="/theme-toggle.js"></script>'
    );
    changed = true;
  }

  // 2. Add theme.css before the first CSS link (blog.css or model-pages.css or any .css)
  // Try to insert before blog.css first
  if (html.includes('/blog.css')) {
    html = html.replace(
      /(<link[^>]+\/blog\.css[^>]*>)/,
      '<link rel="stylesheet" href="/theme.css">\n  $1'
    );
    changed = true;
  } else if (html.includes('/model-pages.css')) {
    html = html.replace(
      /(<link[^>]+\/model-pages\.css[^>]*>)/,
      '<link rel="stylesheet" href="/theme.css">\n  $1'
    );
    changed = true;
  } else {
    // Insert before first <link rel="stylesheet"
    const cssMatch = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/);
    if (cssMatch) {
      html = html.replace(
        cssMatch[0],
        '<link rel="stylesheet" href="/theme.css">\n  ' + cssMatch[0]
      );
      changed = true;
    }
  }

  // 3. Add toggle button before </nav>
  if (!html.includes('id="theme-toggle"')) {
    html = html.replace(
      /<\/nav>/,
      '  <button id="theme-toggle" onclick="toggleTheme()" aria-label="Switch theme" title="Switch theme">&#9728;&#xFE0F;</button>\n  </nav>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    updated++;
    console.log('Updated:', path.relative(publicDir, filePath));
  }
}

console.log(`\nDone: ${updated} files updated, ${skipped} already had theme.css`);
