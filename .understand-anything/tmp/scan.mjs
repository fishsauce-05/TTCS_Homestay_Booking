import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = process.argv[2];

// Helper to get file stats
function getFileStats(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;
  return {
    path: path.relative(PROJECT_ROOT, filePath),
    sizeLines: lines,
    sizeBytes: content.length
  };
}

// Detect file category
function getFileCategory(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath).toLowerCase();
  
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cs', '.rb', '.php'].includes(ext)) {
    return 'code';
  } else if (['.json', '.yaml', '.yml', '.toml', '.ini', '.conf', '.env', '.properties'].includes(ext) || name.includes('config') || name.includes('Dockerfile')) {
    return 'config';
  } else if (['.md', '.rst', '.txt'].includes(ext)) {
    return 'docs';
  } else if (name.includes('Dockerfile') || name.endsWith('docker-compose.yml') || ['.dockerfile'].includes(ext)) {
    return 'infra';
  } else if (['.sql'].includes(ext)) {
    return 'data';
  } else if (['.sh', '.bash', '.bat'].includes(ext)) {
    return 'script';
  } else if (['.html', '.css', '.scss', '.less', '.xml'].includes(ext)) {
    return 'markup';
  }
  return 'code';
}

// Detect languages
const languages = new Set();
function detectLanguages(dir) {
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  files.forEach(f => {
    if (!f.isDirectory()) {
      const ext = path.extname(f.name).toLowerCase();
      if (ext === '.ts' || ext === '.tsx') languages.add('typescript');
      if (ext === '.js' || ext === '.jsx') languages.add('javascript');
      if (ext === '.py') languages.add('python');
      if (ext === '.go') languages.add('go');
      if (ext === '.json') languages.add('json');
      if (ext === '.yaml' || ext === '.yml') languages.add('yaml');
      if (ext === '.html') languages.add('html');
      if (ext === '.css' || ext === '.scss') languages.add('css');
      if (ext === '.md') languages.add('markdown');
      if (ext === '.sql') languages.add('sql');
    }
  });
}

// Walk project
function walkProject(dir, ignore = new Set()) {
  const files = [];
  const readdir = (d) => {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = path.join(d, entry.name);
        const relPath = path.relative(PROJECT_ROOT, fullPath);
        
        // Skip ignored dirs
        if (ignore.has(relPath) || ignore.has(relPath + '/')) return;
        if (entry.name.startsWith('.') && entry.name !== '.env') return;
        
        if (entry.isDirectory()) {
          readdir(fullPath);
        } else {
          files.push(fullPath);
        }
      });
    } catch (e) {
      // Skip permission errors
    }
  };
  readdir(dir);
  return files;
}

try {
  const ignoreFile = path.join(PROJECT_ROOT, '.understand-anything', '.understandignore');
  const ignorePatterns = new Set();
  if (fs.existsSync(ignoreFile)) {
    fs.readFileSync(ignoreFile, 'utf8').split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) ignorePatterns.add(line);
    });
  }
  
  detectLanguages(PROJECT_ROOT);
  const allFiles = walkProject(PROJECT_ROOT, ignorePatterns);
  
  const result = {
    projectName: 'Homestay Booking',
    projectDescription: 'A full-stack booking system for homestays with backend NestJS API and frontend',
    languages: Array.from(languages),
    frameworks: ['NestJS', 'TypeORM', 'Passport', 'JWT'],
    files: [],
    filteredByIgnore: 0,
    totalFilesScanned: allFiles.length
  };
  
  allFiles.forEach(file => {
    try {
      const stats = getFileStats(file);
      result.files.push({
        ...stats,
        fileCategory: getFileCategory(file)
      });
    } catch (e) {
      // Skip files with read errors
    }
  });
  
  fs.writeFileSync(
    path.join(PROJECT_ROOT, '.understand-anything', 'intermediate', 'scan-result.json'),
    JSON.stringify(result, null, 2)
  );
  
  console.log('Scan complete:', result.files.length, 'files');
} catch (error) {
  console.error('Scan error:', error.message);
  process.exit(1);
}
