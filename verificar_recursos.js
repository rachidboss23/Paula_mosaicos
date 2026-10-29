const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const htmlFiles = ['index.html', 'galeria.html', 'blog.html'];
const cssFiles = fs.readdirSync(path.join(ROOT, 'css'))
  .filter(f => f.endsWith('.css'))
  .map(f => path.join('css', f));

function checkExactCase(filePath) {
  const parts = path.normalize(filePath).split(path.sep);
  let current = ROOT;
  for (const part of parts) {
    if (!part || part === '.') continue;
    if (!fs.existsSync(current)) return { exists: false };
    const entries = fs.readdirSync(current);
    const exact = entries.find(e => e === part);
    if (!exact) {
      const caseInsensitive = entries.find(e => e.toLowerCase() === part.toLowerCase());
      if (caseInsensitive) {
        return { exists: true, exactCase: false, actual: caseInsensitive, requested: part };
      }
      return { exists: false };
    }
    current = path.join(current, exact);
  }
  return { exists: true, exactCase: true };
}

const report = [];

// 1. Check HTML
for (const hf of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, hf), 'utf8');
  
  // Find src="..."
  const srcRegex = /src="([^"#?]+)"/g;
  let m;
  while ((m = srcRegex.exec(content)) !== null) {
    const src = m[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    
    const decoded = decodeURIComponent(src);
    const caseCheck = checkExactCase(decoded);
    report.push({
      file: hf,
      attr: 'src',
      raw: src,
      hasSpace: src.includes(' '),
      decoded,
      exists: caseCheck.exists,
      exactCase: caseCheck.exactCase,
      details: caseCheck
    });
  }

  // Find href="..."
  const hrefRegex = /href="([^"#?]+)"/g;
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) continue;
    
    const decoded = decodeURIComponent(href);
    const caseCheck = checkExactCase(decoded);
    report.push({
      file: hf,
      attr: 'href',
      raw: href,
      hasSpace: href.includes(' '),
      decoded,
      exists: caseCheck.exists,
      exactCase: caseCheck.exactCase,
      details: caseCheck
    });
  }
}

// 2. Check CSS
for (const cf of cssFiles) {
  const content = fs.readFileSync(path.join(ROOT, cf), 'utf8');
  const urlRegex = /url\((?:['"]?)([^'")#?]+)(?:['"]?)\)/g;
  let m;
  while ((m = urlRegex.exec(content)) !== null) {
    const rawUrl = m[1].trim();
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('data:')) continue;

    const decoded = decodeURIComponent(rawUrl);
    const relFromRoot = path.normalize(path.join(path.dirname(cf), decoded));
    const caseCheck = checkExactCase(relFromRoot);
    report.push({
      file: cf,
      attr: 'url()',
      raw: rawUrl,
      hasSpace: rawUrl.includes(' '),
      decoded: relFromRoot,
      exists: caseCheck.exists,
      exactCase: caseCheck.exactCase,
      details: caseCheck
    });
  }
}

console.log(`Total local resources checked: ${report.length}`);
const missing = report.filter(r => !r.exists);
const caseMismatches = report.filter(r => r.exists && !r.exactCase);
const withSpaces = report.filter(r => r.hasSpace);

console.log(`Existing and exact case: ${report.length - missing.length - caseMismatches.length}`);
console.log(`Missing: ${missing.length}`);
console.log(`Case mismatches: ${caseMismatches.length}`);
console.log(`Unencoded spaces in reference: ${withSpaces.length}`);

if (withSpaces.length > 0) {
  console.log('\nRESOURCES WITH UNENCODED SPACES:');
  withSpaces.forEach(s => console.log(`- In ${s.file} (${s.attr}): "${s.raw}"`));
}
