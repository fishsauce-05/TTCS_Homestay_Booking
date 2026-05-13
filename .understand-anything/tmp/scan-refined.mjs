import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.argv[2];
const DEFAULT_IGNORES = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'target', 'obj'];

function getFileStats(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;
  return {
    path: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/'),
    sizeLines: lines,
    sizeBytes: content.length
  };
}

function getFileCategory(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath).toLowerCase();
  
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cs', '.rb', '.php'].includes(ext)) {
    return 'code';
  } else if (['.json', '.yaml', '.yml', '.toml', '.ini', '.conf', '.env', '.properties'].includes(ext) || name.includes('config')) {
    return 'config';
  } else if (['.md', '.rst', '.txt'].includes(ext)) {
    return 'docs';
  } else if (name === 'dockerfile' || name.includes('docker-compose')) {
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

function shouldIgnore(relPath) {
  for (const ignore of DEFAULT_IGNORES) {
    if (relPath.includes(ignore + '/') || relPath.startsWith(ignore + '/') || relPath.endsWith(ignore)) {
      return true;
    }
  }
  return false;
}

function walkProject(dir) {
  const files = [];
  const readdir = (d) => {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = path.join(d, entry.name);
        const relPath = path.relative(PROJECT_ROOT, fullPath).replace(/\\/g, '/');
        
        if (shouldIgnore(relPath)) return;
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
  const allFiles = walkProject(PROJECT_ROOT);
  const languages = new Set();
  
  allFiles.forEach(f => {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.ts' || ext === '.tsx') languages.add('typescript');
    if (ext === '.js' || ext === '.jsx') languages.add('javascript');
    if (ext === '.py') languages.add('python');
    if (ext === '.json') languages.add('json');
    if (ext === '.yaml' || ext === '.yml') languages.add('yaml');
    if (ext === '.html') languages.add('html');
    if (ext === '.css' || ext === '.scss') languages.add('css');
    if (ext === '.md') languages.add('markdown');
    if (ext === '.sql') languages.add('sql');
  });
  
  const result = {
    projectName: 'Homestay Booking',
    projectDescription: 'A full-stack homestay booking platform with NestJS backend and HTML/CSS frontend',
    languages: Array.from(languages),
    frameworks: ['NestJS', 'TypeORM', 'Passport', 'JWT'],
    files: []
  };
  
  allFiles.forEach(file => {
    try {
      const stats = getFileStats(file);
      result.files.push({
        ...stats,
        fileCategory: getFileCategory(file)
      });
    } catch (e) {
      // skip
    }
  });
  
  result.filteredByIgnore = 0;
  result.totalFilesScanned = result.files.length;
  
  fs.writeFileSync(
    path.join(PROJECT_ROOT, '.understand-anything', 'intermediate', 'scan-result.json'),
    JSON.stringify(result, null, 2)
  );
  
  console.log('✓ Scan complete:', result.files.length, 'files');
  console.log('  Languages:', result.languages.join(', '));
  console.log('  Frameworks:', result.frameworks.join(', '));
} catch (error) {
  console.error('✗ Scan error:', error.message);
  process.exit(1);
}
