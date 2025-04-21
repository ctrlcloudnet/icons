import fs from 'fs/promises';
import path from 'path';
import { transform } from '@svgr/core';
const ICONS_DIR = path.join(process.cwd(), 'src/icons');
const OUT_DIR = path.join(process.cwd(), 'dist/icons');
const OUT_DIR_INDEX = path.join(process.cwd(), 'dist');

async function buildIcons() {
  try {
    await fs.mkdir(OUT_DIR, { recursive: true });
    
    const files = await fs.readdir(ICONS_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    
    for (const file of svgFiles) {
      const svgCode = await fs.readFile(path.join(ICONS_DIR, file), 'utf8');
      const componentName = path.basename(file, '.svg');
  
      const tsxCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
          typescript: true,
          icon: true,
          jsxRuntime: 'automatic',
        },
        { componentName }
      );
      await fs.writeFile(path.join(OUT_DIR, `${componentName}.tsx`), tsxCode);
      const indexTSXContent = svgFiles
      .map(file => {
        const componentName = path.basename(file, '.svg')
          .replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());
        return `export { default as ${componentName} } from './icons/${componentName}.tsx';`;
      })
      .join('\n');
      await fs.writeFile(path.join(OUT_DIR_INDEX, 'index.ts'), indexTSXContent);

      const jsxCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
          icon: true,
          replaceAttrValues: { '#000': 'currentColor' },
          jsxRuntime: 'automatic',
        },
        { componentName }
      );
      const outFile = path.join(OUT_DIR, `${componentName}.jsx`);
      await fs.writeFile(outFile, jsxCode);
    }
    const indexJSXContent = svgFiles
    .map(file => {
      const componentName = path.basename(file, '.svg')
        .replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());
      return `export { default as ${componentName} } from './icons/${componentName}.jsx';`;
    })
    .join('\n');
    await fs.writeFile(path.join(OUT_DIR_INDEX, 'index.js'), indexJSXContent);

    console.log(`Generated ${svgFiles.length} icon components`);
  } catch (error) {
    console.error('Error building icons:', error);
    process.exit(1);
  }
}

buildIcons();