import childProcess from 'child_process';

childProcess.execSync('vue-cli-service build');
childProcess.execSync(
  'babel --config-file ./.server.babelrc src/server.js --out-file ./server.js',
);
