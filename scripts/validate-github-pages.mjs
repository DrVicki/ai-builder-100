import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docs = path.join(root, 'docs');
const requiredFiles = [
  'index.html',
  '404.html',
  '.nojekyll',
  'assets/css/styles.css',
  'assets/js/course-data.js',
  'assets/js/site.js',
  'DEPLOYMENT.md',
];

const failures = [];
for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(docs, relativePath))) {
    failures.push(`Missing required file: docs/${relativePath}`);
  }
}

const indexPath = path.join(docs, 'index.html');
const dataPath = path.join(docs, 'assets/js/course-data.js');
const guidePath = path.join(docs, 'DEPLOYMENT.md');

if (fs.existsSync(indexPath)) {
  const index = fs.readFileSync(indexPath, 'utf8');
  const expectedRelativeAssets = ['assets/css/styles.css', 'assets/js/course-data.js', 'assets/js/site.js'];
  for (const asset of expectedRelativeAssets) {
    if (!index.includes(asset)) failures.push(`index.html does not link ${asset}`);
  }
  if (/href=["']\/assets\//.test(index) || /src=["']\/assets\//.test(index)) {
    failures.push('index.html contains a root-relative asset path; use relative assets for project Pages.');
  }
  if (!index.includes('https://aibuilder-7jkvncr3.manus.space')) {
    failures.push('index.html does not link to the live interactive platform.');
  }
}

if (fs.existsSync(dataPath)) {
  const data = fs.readFileSync(dataPath, 'utf8');
  for (const requiredCourseText of ['AI Problem Solving', 'AI Agents and Automation', 'Module Assessment']) {
    if (!data.includes(requiredCourseText)) failures.push(`Course data is missing: ${requiredCourseText}`);
  }
}

if (fs.existsSync(guidePath)) {
  const guide = fs.readFileSync(guidePath, 'utf8');
  for (const requiredGuideText of ['DrVicki/ai-builder-100', '`main`', '`/docs`', 'https://drvicki.github.io/ai-builder-100/']) {
    if (!guide.includes(requiredGuideText)) failures.push(`Deployment guide is missing: ${requiredGuideText}`);
  }
}

if (failures.length) {
  console.error('GitHub Pages validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('GitHub Pages companion validation passed.');
