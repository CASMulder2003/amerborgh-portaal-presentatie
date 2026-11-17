// Builds the actual portal components without copying or modifying the portal source.
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const here = path.dirname(fileURLToPath(import.meta.url));
const portal = process.env.PORTAL_SOURCE;
if (!portal) throw new Error('Set PORTAL_SOURCE to the portal frontend directory.');
const source = path.join(portal, 'src');
const { build } = await import(pathToFileURL(path.join(portal, 'node_modules/vite/dist/node/index.js')));
const { default: react } = await import(pathToFileURL(path.join(portal, 'node_modules/@vitejs/plugin-react/dist/index.js')));
const exportsFor = {
  'pages/reporting/overview/Dashboard.jsx': ['CompanyResults', 'CompanyDashboard'],
  'pages/reporting/forms/FormEditor.jsx': ['FormEditor'],
  'pages/reporting/imports/FileImport.jsx': ['FileReview'],
  'pages/reporting/reports/ReportReader.jsx': ['PublicationContent'],
};
await build({
  root: here, base: './',
  plugins: [{ name: 'presentation-local-data', enforce: 'pre',
    resolveId(id, importer) {
      if (importer && id.startsWith('.') && path.resolve(path.dirname(importer), id).replace(/\.js$/, '') === path.join(source, 'auth/api')) return path.join(here, 'local-api.js');
    },
    transform(code, id) {
      const relative = path.relative(source, id).split(path.sep).join('/');
      if (exportsFor[relative]) return code + '\nexport { ' + exportsFor[relative].join(', ') + ' };\n';
    },
  }, react()],
  resolve: { alias: {
    '@portal': source,
    'react-dom': path.join(portal, 'node_modules/react-dom'),
    'react': path.join(portal, 'node_modules/react'),
  } },
  build: { outDir: path.resolve(here, '../assets/portal'), emptyOutDir: true, sourcemap: false },
});
const commit = execFileSync('git', ['-C', portal, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await writeFile(path.join(here, 'portal-source.json'), JSON.stringify({ repository: 'CASMulder2003/amerborgh-portaal', commit, components: Object.keys(exportsFor), data: 'Synthetic Hotel A, Hotel B, Hotel C; no production API.' }, null, 2) + '\n');
