const conc = require('concurrently');
const ch = require('chalk');

const serve = {
  command: '$ENV $CMD $FLAGS $ARGS',
  name: 'serve',
  prefixColor: 'reset.green.dim',
};
const build = {
  command: '$ENV $CMD $FLAGS $ARGS',
  name: 'build',
  prefixColor: 'reset.blue.dim',
};

const args = process.argv.slice(2);
const pkgMgr = process.env.npm_config_user_agent.split('/')[0];

if (args.length === 0) {
  console.error(ch`{reset.yellow.dim main} {reset.red.bold Error: no arguments provided. Run "pnpm run help" for usage.}`);
  process.exit(1);
}

if (!args[2]) args[2] = '';
const actions = args[0].split(',');
const options = args[2].split(',');

const enableServe = actions.some(v => v === 'serve'),
  enableBuild = actions.some(v => v === 'build'),
  enableDev = args[1] === 'dev',
  enableDebug = args[1] === 'debug',
  enableProd = args[1] === 'prod',
  showTimestamps = options.some(v => v === 'timestamps');

if (!enableBuild && !enableServe) {
  console.error(
    ch`{reset.yellow.dim main} {reset.red.bold Error: action argument is invalid (must include at least one of "build" and "serve"). Run "pnpm run help" for usage.}`,
  );
  process.exit(1);
}

if (!enableDev && !enableProd) {
  console.error(
    ch`{reset.yellow.dim main} {reset.red.bold Error: environment argument is invalid (must be "dev" or "prod"). Run "${pkgMgr} run help" for usage.}`,
  );
  process.exit(1);
}

console.log(ch`{reset.yellow.dim main} {reset Starting [${actions.join(', ')}] in ${args[1]} mode with options [${options.join(', ')}]}`);

serve.command = serve.command
  .replace('$ENV', 'cross-env' + ` NODE_ENV=${enableDev ? 'development' : 'production'}`)
  .replace('$CMD', enableDev ? 'nodemon' : 'node')
  .replace('$FLAGS', enableDebug ? '--inspect' : '')
  .replace('$ARGS', enableDev ? '' : './server/index.ts');

build.command = build.command
  .replace('$ENV', 'cross-env' + ` NODE_ENV=${enableDev ? 'development' : 'production'}`)
  .replace('$CMD', 'webpack')
  .replace('$FLAGS', enableDev ? '--watch' : '')
  .replace('$ARGS', '');

process.stdin.resume();

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
exitSignals.forEach(signal =>
  process.on(signal, () => {
    console.log(ch`{reset.yellow.dim main} {reset.red ${signal} received.}`);
    console.log(ch`{reset.yellow.dim main} {reset.yellow Exiting.}`);
    process.exit(0);
  }),
);

/* prettier makes this ugly */
// prettier-ignore
const run = [
  ...enableServe ? [serve] : [],
  ...enableBuild ? [build] : [],
];

conc(run, {
  prefix: showTimestamps ? '[{time}] {name}' : '{name}',
  inputStream: process.stdin,
  timestampFormat: 'MM/dd HH:mm:ss',
  successCondition: 'first',
})
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
