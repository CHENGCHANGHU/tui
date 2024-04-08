import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { cp, opendir, readFile, rename, writeFile } from 'node:fs/promises';
import readline from 'node:readline';
import { camelString, gracefullyExit } from './utils.mjs';
import { createLog } from './print.mjs';

readline.Interface.prototype._insertString = function(c) {
  if (this.cursor < this.line.length) {
    var beg = this.line.slice(0, this.cursor);
    var end = this.line.slice(this.cursor, this.line.length);
    this.line = beg + c + end;
    this.cursor += c.length;
    this._refreshLine();
  } else {
    this.line += c;
    this.cursor += c.length;
    this.output.write(c);
    this._moveCursor(0);
  }
};

process.on('unhandledRejection', error => {
  console.error(error);
  gracefullyExit();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log(process);

const RootPath = process.env.PWD;
// console.log(process.argv);
const {
  values: {
    name,
  },
  positionals: packageNames,
} = parseArgs({
  allowPositionals: true,
  args: process.argv.slice(2),
  options: {
    // name: {
    //   type: 'string',
    //   short: 'n',
    //   multiple: true,
    // },
  },
});

main();

async function main() {
  const { log, success, error, close } = createLog();
  log(`Start creating packages: ${packageNames.join(', ')}`);
  // console.log(rl.getCursorPos());
  for (const packageName of packageNames) {
    log(packageName + ' creating...');

    const camelPackageName = camelString(packageName);
    if (/^[^a-zA-Z]/.test(packageName)) {
      // readline.moveCursor(process.stdout, 0, -1);
      // readline.clearLine(process.stdout, -1);
      error(packageName + ' failed! Package name cannot be started with a non-word character.', { displace: true });
      continue;
    }
    const destinationPath = join(RootPath, 'packages', packageName);

    await cp(join(RootPath, 'package-template'), destinationPath, { recursive: true });
  
    let direntQueue = [];
    const dir = await opendir(destinationPath);
    for await (const dirent of dir) {
      direntQueue.push({
        parentPath: destinationPath,
        dirent,
      });
    }
    while (direntQueue.length !== 0) {
      const tempQueue = [];
      for (const { parentPath, dirent } of direntQueue) {
        if (dirent.isDirectory()) {
          const childDirPath = join(parentPath, dirent.name);
          const childDir = await opendir(childDirPath);
          for await (const dirent of childDir) {
            tempQueue.push({
              parentPath: childDirPath,
              dirent,
            });
          }
          continue;
        }
        const filePath = join(parentPath, dirent.name);
        const content = await readFile(filePath, { encoding: 'utf-8', flag: 'r' });
        const replacedContent = content
          .replaceAll(/<!-- package-name -->/g, packageName)
          .replaceAll(/<!-- camel-package-name -->/g, camelPackageName);
        await writeFile(filePath, replacedContent, { encoding: 'utf-8', flag: 'w' });
        if (dirent.name === 'Component.vue') {
          await rename(filePath, join(parentPath, camelPackageName + '.vue'));
        }
      }
      direntQueue = tempQueue;
    }

    // await sleep(3000);

    // readline.moveCursor(process.stdout, 0, -1);
    // readline.clearLine(process.stdout, -1);
    success(packageName + ' created!', { displace: true });
  }

  close();
  process.exit(0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
