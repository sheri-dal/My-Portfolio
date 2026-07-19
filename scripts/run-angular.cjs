const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const requiredNodeVersion = '22.12.0';
const currentMajor = Number(process.versions.node.split('.')[0]);
const angularCli = join(__dirname, '..', 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

if (!existsSync(angularCli)) {
  console.error('Angular CLI is not installed. Run "npm ci" first.');
  process.exit(1);
}

const candidates = [
  currentMajor >= 22 ? process.execPath : null,
  process.env.NVM_HOME ? join(process.env.NVM_HOME, `v${requiredNodeVersion}`, 'node.exe') : null,
  process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, 'nvm', `v${requiredNodeVersion}`, 'node.exe')
    : null,
].filter(Boolean);

const nodeExecutable = candidates.find((candidate) => existsSync(candidate));

if (!nodeExecutable) {
  console.error(
    `Node ${requiredNodeVersion} was not found. Install it with "nvm install ${requiredNodeVersion}".`,
  );
  process.exit(1);
}

const result = spawnSync(nodeExecutable, [angularCli, ...process.argv.slice(2)], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
