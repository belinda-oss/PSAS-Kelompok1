/**
 * download-assets.cjs — GSU Web Project Image Downloader
 * Downloads verified free-commercial-use images from Pexels CDN.
 * Run: node download-assets.cjs
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, 'public', 'assets', 'images');

// All Pexels images — Free for commercial use (Pexels License, no attribution required)
const IMAGES = [
    // Recruit hero - diverse professional team (Fauxels / Pexels)
    { url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=2000', file: 'recruit-hero.jpg' },
    // Recruit Grow With Us - professional woman smiling (Christina Morillo / Pexels)
    { url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1200', file: 'recruit-grow.jpg' },
    // Distribution hero - beauty/makeup flatlay
    { url: 'https://images.pexels.com/photos/8558528/pexels-photo-8558528.jpeg?auto=compress&cs=tinysrgb&w=2000', file: 'distribution-hero.jpg' },
    // Distribution operations - cosmetic products flatlay
    { url: 'https://images.pexels.com/photos/3552894/pexels-photo-3552894.jpeg?auto=compress&cs=tinysrgb&w=1000', file: 'distribution-products.jpg' },
    // Distribution Product Readiness - assorted cosmetics
    { url: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1200', file: 'distribution-readiness.jpg' },
];

function downloadFile(url, destPath, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) { reject(new Error('Too many redirects')); return; }
        if (fs.existsSync(destPath)) {
            const stats = fs.statSync(destPath);
            if (stats.size > 10000) {
                console.log(`  SKIP (exists ${Math.round(stats.size/1024)}KB): ${path.basename(destPath)}`);
                resolve(); return;
            }
        }
        const file = fs.createWriteStream(destPath);
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
                file.close(); if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                return downloadFile(res.headers.location, destPath, redirectCount + 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                file.close(); if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                reject(new Error(`HTTP ${res.statusCode}`)); return;
            }
            res.pipe(file);
            file.on('finish', () => file.close(() => {
                const size = fs.statSync(destPath).size;
                console.log(`  OK ${Math.round(size/1024)}KB: ${path.basename(destPath)}`);
                resolve();
            }));
        });
        req.on('error', (err) => { file.close(); if (fs.existsSync(destPath)) fs.unlinkSync(destPath); reject(err); });
        file.on('error', reject);
    });
}

async function main() {
    if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`\nDownloading ${IMAGES.length} images...\n`);
    for (const img of IMAGES) {
        process.stdout.write(`  Downloading ${img.file}... `);
        try { await downloadFile(img.url, path.join(TARGET_DIR, img.file)); }
        catch (err) { console.error(`FAILED: ${err.message}`); }
    }
    console.log('\nAll done!\n');
}
main();
