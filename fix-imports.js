const fs = require('fs');
const path = require('path');

function fixImports(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      fixImports(fullPath);
      continue;
    }

    if (!['.ts', '.tsx'].some(ext => file.name.endsWith(ext))) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes("import { prisma } from '@/lib/prisma'") || 
        content.includes('import { prisma } from "@/lib/prisma"')) {
      
      const newContent = content
        .replace("import { prisma } from '@/lib/prisma'", "import prisma from '@/lib/prisma'")
        .replace('import { prisma } from "@/lib/prisma"', 'import prisma from "@/lib/prisma"');
      
      fs.writeFileSync(fullPath, newContent);
      console.log(`Fixed imports in ${fullPath}`);
    }
  }
}

fixImports('./app');
fixImports('./lib');
