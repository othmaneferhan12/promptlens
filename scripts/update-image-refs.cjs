#!/usr/bin/env node
// Replaces all /images/*.jpeg references with /images/*.webp in static HTML files
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '..', 'public');

// Find all index.html files in public/
const files = execSync('find ' + publicDir + ' -name "index.html"', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

let totalFiles = 0;
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace /images/filename.jpeg and /images/filename.jpg with .webp
  content = content.replace(/\/images\/([^"'\s]+)\.(jpe?g)/gi, '/images/$1.webp');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    const count = (original.match(/\/images\/[^"'\s]+\.(jpe?g)/gi) || []).length;
    totalReplacements += count;
    totalFiles++;
    console.log(`✓ ${path.relative(publicDir, file)} (${count} refs)`);
  }
}

console.log(`\nUpdated ${totalFiles} files, ${totalReplacements} total image references.`);
