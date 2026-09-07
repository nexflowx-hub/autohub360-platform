import fs from 'node:fs';
import path from 'node:path';
import { builtinModules } from 'node:module';

const root = process.cwd();
const workspaceRoots = ['apps', 'packages'];
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const extraFiles = new Set([
  'next.config.ts',
  'next.config.js',
  'next.config.mjs',
  'eslint.config.mjs',
  'postcss.config.mjs',
]);
const builtins = new Set([
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listWorkspaceDirs() {
  const dirs = [];
  for (const base of workspaceRoots) {
    const abs = path.join(root, base);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      const dir = path.join(abs, name);
      if (fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, 'package.json'))) {
        dirs.push(dir);
      }
    }
  }
  return dirs;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'dist', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    const ext = path.extname(entry.name);
    if (sourceExtensions.has(ext) || extraFiles.has(entry.name)) out.push(full);
  }
  return out;
}

function packageRoot(specifier) {
  if (
    !specifier ||
    specifier.startsWith('.') ||
    specifier.startsWith('/') ||
    specifier.startsWith('#') ||
    specifier === '@' ||
    specifier.startsWith('@/')
  ) {
    return null;
  }
  if (builtins.has(specifier)) return null;
  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/');
    return scope && name ? `${scope}/${name}` : specifier;
  }
  return specifier.split('/')[0];
}

function importsFrom(source) {
  const specs = new Set();
  const patterns = [
    /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    let match;
    while ((match = re.exec(source))) specs.add(match[1]);
  }
  return [...specs];
}

const workspaces = listWorkspaceDirs();
const failures = [];

for (const dir of workspaces) {
  const manifestPath = path.join(dir, 'package.json');
  const pkg = readJson(manifestPath);
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ]);

  const missing = new Map();
  for (const file of walk(dir)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const specifier of importsFrom(source)) {
      const dep = packageRoot(specifier);
      if (!dep || declared.has(dep)) continue;
      const rel = path.relative(root, file);
      if (!missing.has(dep)) missing.set(dep, new Set());
      missing.get(dep).add(rel);
    }
  }

  if (missing.size) failures.push({ name: pkg.name, missing });
}

if (failures.length) {
  console.error('\nWorkspace dependency audit failed. Direct imports must be declared by the importing workspace.\n');
  for (const { name, missing } of failures) {
    console.error(name);
    for (const [dep, files] of missing) {
      console.error(`  - ${dep}`);
      for (const file of [...files].sort()) console.error(`      ${file}`);
    }
  }
  console.error('\nFix the relevant package.json files instead of relying on pnpm transitive/hoisted dependencies.\n');
  process.exit(1);
}

console.log(`Workspace dependency audit passed for ${workspaces.length} workspaces.`);
