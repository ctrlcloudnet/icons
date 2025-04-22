import fs from 'fs/promises';
import path from 'path';
import { transform } from '@svgr/core';

const ICONS_DIR = path.join(process.cwd(), 'src/icons');
const OUT_DIR = path.join(process.cwd(), 'dist/icons');
const OUT_DIR_INDEX = path.join(process.cwd(), 'dist');
interface IconExport {
  componentName: string;
  importPath: string;
}
async function processDirectory(dir: string, relativePath = ''): Promise<IconExport[]> {
  const files = await fs.readdir(dir);
  let allExports: IconExport[] = [];
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativeFilePath = path.join(relativePath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subDirExports = await processDirectory(fullPath, relativeFilePath);
      allExports = [...allExports, ...subDirExports];
    } else if (file.endsWith('.svg')) {
      const svgCode = await fs.readFile(fullPath, 'utf8');
      const componentName = path.basename(file, '.svg');
      const pascalCaseName = componentName
        .replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());

      // Generate TSX component
      const tsxCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
          typescript: true,  // Enable TypeScript output
          jsxRuntime: 'automatic',
          // Add these for better TS support:
          template: ({ componentName, jsx }, { tpl }) => tpl`
            import * as React from 'react';
            import type { SVGProps } from 'react';
            
            const ${componentName} = (props: SVGProps<SVGSVGElement>) => ${jsx};
            export default ${componentName};
          `
        },
        { componentName: pascalCaseName }
      );
      
      // Create output directory
      const outSubDir = path.join(OUT_DIR, relativePath);
      await fs.mkdir(outSubDir, { recursive: true });
      
      // Write TSX component file
      await fs.writeFile(
        path.join(outSubDir, `${pascalCaseName}.tsx`),
        tsxCode
      );

      // Update declaration file content
      const dtsContent = `import * as React from 'react';\nimport type { SVGProps } from 'react';\ndeclare const ${pascalCaseName}: React.FC<SVGProps<SVGSVGElement>>;\nexport default ${pascalCaseName};`;
      await fs.writeFile(path.join(outSubDir, `${pascalCaseName}.d.ts`), dtsContent);
      
      const exportPath = path.join('icons', relativePath, pascalCaseName);
      allExports.push({
        componentName: pascalCaseName,
        importPath: exportPath.replace(/\\/g, '/')
      });
    }
  }
  
  return allExports;
}

async function buildIcons() {
  try {
    await fs.mkdir(OUT_DIR, { recursive: true });

    const allExports = await processDirectory(ICONS_DIR);
    
    const indexContent = allExports
      .map(({ componentName, importPath }) => 
        `export { default as ${componentName} } from './${importPath}.tsx';`
      )
      .join('\n');
    
    await fs.writeFile(path.join(OUT_DIR_INDEX, 'index.js'), indexContent);

    const dtsContent = allExports
    .map(({ componentName,importPath }) => 
      `export { default as ${componentName} } from './${importPath}.tsx';`
    )
    .join('\n');
  
  await fs.writeFile(path.join(OUT_DIR_INDEX, 'index.d.ts'), dtsContent);


    console.log(`Generated ${allExports.length} icon components`);
  } catch (error) {
    console.error('Error building icons:', error);
    process.exit(1);
  }
}

buildIcons();