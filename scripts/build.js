import childProcess from 'child_process';
import fs from 'fs';
import omit from 'lodash/omit';
import package_ from '../package.json';

childProcess.execSync('vue-cli-service build');
childProcess.execSync(
  'babel --config-file ./.server.babelrc src/server.js --out-file dist/server.js',
);
childProcess.execSync('cp Procfile dist/');
fs.writeFileSync(
  'dist/package.json',
  JSON.stringify(omit(package_, ['devDependencies', 'scripts'])),
);
