#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Convert markdown to HTML and write as a typescript module

const aboutMd = readFileSync(join(projectRoot, 'src/assets/about.md'), 'utf-8');
const aboutHtml = marked.parse(aboutMd);
const output = `// Auto-generated from about.md - do not edit directly

export const aboutHtml = ${JSON.stringify(aboutHtml)};
`;

const outputDir = join(projectRoot, 'src', 'generated');
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'about.ts'), output);

console.log('Generated src/generated/about.ts from about.md');
