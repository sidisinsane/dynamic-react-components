import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

/**
 *
 */
const log = console.log.bind(console);

/**
 *
 * @param {*} bytes
 * @param {*} decimals
 * @returns
 */
const formatBytes = (bytes, decimals) => {
  if (bytes == 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 *
 * @param {*} filePath
 * @param {*} extArray
 * @returns
 */
const hasValidExt = (filePath, extArray = []) => {
  if (extArray.length < 1) {
    return true;
  }

  const ext = path.extname(filePath).substring(1);
  return extArray.includes(ext);
}

/**
 *
 * @param {*} filePath
 * @param {*} extArray
 * @param {*} srcDir
 * @param {*} destDir
 * @param {*} event
 * @param {*} stats
 * @returns
 */
const copyValidFiles = (
  filePath,
  extArray = [],
  srcDir = 'src',
  destDir = 'public',
  event = false,
  stats = false,
) => {
  if (!hasValidExt(filePath, extArray)) {
    return;
  }

  const destPath = filePath.replace(srcDir, destDir);

  fs.copyFile(filePath, destPath, (err) => {
    if (err) {
      log(`${chalk.red(err)}`);
      return;
    }

    const ext = path.extname(filePath).substring(1);

    let msg = event ? `${chalk.blue(ext.toUpperCase() + ' ' + event + ' detected')} ${destPath}` : destPath;
    msg += stats && stats.size ? ` ${chalk.blue(formatBytes(stats.size))}` : '';

    log(msg);
  });
}

/**
 *
 * @param {*} timestamp
 * @returns
 */
const getDatetime = (timestamp) => {
  const ts = timestamp || Date.now();

  const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(ts);
  const month = new Intl.DateTimeFormat('en-GB', { month: '2-digit' }).format(ts);
  const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(ts);
  const time = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(ts);

  return `${year}-${month}-${day}T${time}`;
}

/**
 *
 * @param {*} generator
 * @param {*} version
 * @param {*} author
 * @param {*} license
 * @returns
 */
const getJsdocBanner = (
  generator = 'esbuild',
  version = null,
  author = null,
  license = null
) => {
  const datetime = getDatetime();

  let banner = '/**\n';
  banner += ` * Generated with ${generator} ${datetime}\n`;
  banner += version ? ` * @version ${version}\n` : '';
  banner += author ? ` * @author ${author}\n` : '';
  banner += license ? ` * @license ${license}\n` : '';
  banner += ` */`;

  return banner;
}

export {
  log,
  formatBytes,
  hasValidExt,
  copyValidFiles,
  getDatetime,
  getJsdocBanner
}
