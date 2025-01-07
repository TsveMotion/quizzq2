const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix prisma imports
  if (content.includes("import { prisma } from '@/lib/prisma'") || 
      content.includes('import { prisma } from "@/lib/prisma"')) {
    content = content
      .replace("import { prisma } from '@/lib/prisma'", "import prisma from '@/lib/prisma'")
      .replace('import { prisma } from "@/lib/prisma"', 'import prisma from "@/lib/prisma"');
    modified = true;
  }

  // Fix implicit any types in transactions
  if (content.includes('$transaction(async (tx)')) {
    content = content.replace(
      /\$transaction\(async \(tx\)/g,
      '$transaction(async (tx: typeof prisma)'
    );
    modified = true;
  }

  // Fix implicit any types in array methods
  const arrayMethodFixes = [
    {
      pattern: /\.map\((assignment)\s*=>/g,
      replacement: '.map((assignment: any) =>'
    },
    {
      pattern: /\.map\((sub)\s*=>/g,
      replacement: '.map((sub: any) =>'
    },
    {
      pattern: /\.map\((ans)\s*=>/g,
      replacement: '.map((ans: any) =>'
    },
    {
      pattern: /\.map\((answer)\s*=>/g,
      replacement: '.map((answer: any) =>'
    },
    {
      pattern: /\.map\((submission)\s*=>/g,
      replacement: '.map((submission: any) =>'
    },
    {
      pattern: /\.map\((classItem)\s*=>/g,
      replacement: '.map((classItem: any) =>'
    },
    {
      pattern: /\.filter\((user)\s*=>/g,
      replacement: '.filter((user: any) =>'
    },
    {
      pattern: /\.find\((sub)\s*=>/g,
      replacement: '.find((sub: any) =>'
    }
  ];

  arrayMethodFixes.forEach(({ pattern, replacement }) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!['.ts', '.tsx'].some(ext => file.name.endsWith(ext))) {
      continue;
    }

    fixFile(fullPath);
  }
}

processDirectory('./app');
processDirectory('./lib');
