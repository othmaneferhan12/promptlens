#!/usr/bin/env node
// Converts all JPEG/JPG images in public/images/ to WebP at quality 80
// Preserves all EXIF/IPTC/XMP metadata with .withMetadata()
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'images');
const files = fs.readdirSync(imgDir).filter(f => /\.(jpe?g)$/i.test(f));

let totalOriginal = 0;
let totalWebP = 0;

async function convert() {
  for (const file of files) {
    const src = path.join(imgDir, file);
    const dest = path.join(imgDir, file.replace(/\.(jpe?g)$/i, '.webp'));
    const origSize = fs.statSync(src).size;
    await sharp(src)
      .webp({ quality: 80 })
      .withMetadata()
      .toFile(dest);
    const webpSize = fs.statSync(dest).size;
    totalOriginal += origSize;
    totalWebP += webpSize;
    const saved = ((origSize - webpSize) / origSize * 100).toFixed(1);
    console.log(`✓ ${file} → ${path.basename(dest)}  (${(origSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB, -${saved}%)`);
  }
  console.log(`\nTotal: ${(totalOriginal/1024/1024).toFixed(2)} MB → ${(totalWebP/1024/1024).toFixed(2)} MB`);
  console.log(`Saved: ${((totalOriginal-totalWebP)/1024/1024).toFixed(2)} MB (${((totalOriginal-totalWebP)/totalOriginal*100).toFixed(1)}%)`);
}

convert().catch(console.error);
