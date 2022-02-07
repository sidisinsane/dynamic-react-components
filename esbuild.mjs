import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import chokidar from 'chokidar';
import { build } from 'esbuild';
import { log, copyValidFiles, getJsdocBanner } from './utils/index.mjs';
import liveServer from '@compodoc/live-server';
import browserslistToEsbuild from "browserslist-to-esbuild";

const pkg = JSON.parse(await fs.promises.readFile(new URL(path.join(process.cwd(), 'package.json'), import.meta.url)));
const project = JSON.parse(await fs.promises.readFile(new URL(path.join(process.cwd(), 'project.json'), import.meta.url)));

const SRC_DIR = project.srcDir || 'src';
const DEST_DIR = process.argv.includes('--production') ?
  project.destDir.production : project.destDir.development;

/**
 * esbuild configuration
 * @see https://esbuild.github.io/api/#build-api
 * @type {{entryPoints: {app: string, style: string, bundle: string}, assetNames: string, charset: string, color: boolean, sourcemap: string, loader: {".svg": string, ".css": string, ".jsx": string, ".png": string, ".ts": string, ".tsx": string}, banner: {css: string, js: string}, incremental: boolean, outdir: *, metafile: boolean, target: *, minify: *, outbase: (*|string), logLevel: string, watch: *, entryNames: string, tsconfig: string, allowOverwrite: boolean, bundle: boolean, write: boolean}}
 */
const esbuildConfig = {
  // Uses incremental compilation (see `chokidar.on`).
  incremental: true,
  minify: process.argv.includes('--production'),
  sourcemap: 'external',
  watch: process.argv.includes('--watch'),
  entryPoints: {
    'bundle': `${SRC_DIR}/scripts/index.js`,
    'app': `${SRC_DIR}/index.tsx`,
    'style': `${SRC_DIR}/styles/style.css`,
  },
  entryNames: '[dir]/[name]',
  outbase: SRC_DIR,
  outdir: DEST_DIR,
  assetNames: 'assets/[name]',
  tsconfig: 'tsconfig.json',
  loader: {
    '.css': 'css',
    '.jsx': 'jsx',
    '.png': 'file',
    '.svg': 'text',
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  charset: 'utf8',
  bundle: true,
  metafile: true,
  write: true,
  allowOverwrite: false,
  logLevel: 'warning',
  color: true,
  target: browserslistToEsbuild(), // --> ["chrome79", "edge92", "firefox91", "safari13.1"]
  banner: {
    css: getJsdocBanner('esbuild', pkg.version, pkg.author, pkg.license),
    js: getJsdocBanner('esbuild', pkg.version, pkg.author, pkg.license),
  }
}

/**
 * chokidar watch patterns
 * @see https://github.com/paulmillr/chokidar#api
 * @type {string[]}
 */
const chokidarWatchPatterns = [
  'src/scripts/**/*.{js,jsx,mjs,cjs,ts,tsx}',
  'src/styles/**/*.css',
  'src/**/*.html',
];

/**
 * chokidar ignored patterns
 * @see https://github.com/paulmillr/chokidar#api
 * @type {(RegExp|string)[]}
 */
const chokidarIgnoredPatterns = [
  /(^|[\/\\])\../, // ignore dotfiles
  'src/scripts/index.js',
  'src/styles/style.css',
];

/**
 * chokidar configuration
 * @see https://github.com/paulmillr/chokidar#api
 * @type {{ignored: (RegExp|string)[], alwaysStat: boolean, interval: number, ignoreInitial: boolean, persistent: boolean}}
 */
const chokidarConfig = {
  interval: 0, // No delay
  ignored: chokidarIgnoredPatterns,
  ignoreInitial: false,
  persistent: true,
  alwaysStat: true,
}

/**
 * live-server configuration
 * @see https://github.com/compodoc/live-server#usage-from-node
 * @type {{port: (*|number), root: *, open: boolean}}
 */
const liveServerConfig = {
  open: project.open || true,
  port: project.serverPort || 8080,
  root: DEST_DIR,
}

/**
 * The actual build/watch process
 */
if (process.argv.includes('--watch')) {
  (async () => {
    const result = await build(esbuildConfig);
    const watcher = chokidar.watch(chokidarWatchPatterns, chokidarConfig);
    watcher
      .on('all', (event, srcPath, stats) => {
        // copy non entry-files
        copyValidFiles(srcPath, ['html'], SRC_DIR, DEST_DIR, event, stats);

        // rebuild entry-files
        result.rebuild();
      });

    liveServer.start(liveServerConfig);
  })();
} else {
  (async () => {
    const start = Date.now();
    const result = await build(esbuildConfig);
    const watcher = chokidar.watch(chokidarWatchPatterns, chokidarConfig);
    watcher
      .on('all', (event, srcPath, stats) => {
        // copy non entry-files
        copyValidFiles(srcPath, ['html'], SRC_DIR, DEST_DIR, event, stats);

        // rebuild entry-files
        result.rebuild();
      })
      .unwatch(chokidarWatchPatterns);

    await fs.promises.mkdir('./logs', { recursive: true });
    fs.writeFile('./logs/esbuild.meta.json', JSON.stringify(result.metafile, null, 2), (err) => {
      if (err) {
        log(chalk.red(err));
        log(`Build aborted after ${chalk.red((Date.now() - start) / 1000)} seconds.`);
        return;
      }

      log(`./logs/esbuild.meta.json ${chalk.green('written successfully')}.`);
      log(`Build in ${chalk.green((Date.now() - start) / 1000)} seconds.`);
    });
  })();
}
