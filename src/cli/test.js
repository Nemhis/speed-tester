'use strict';

const program = require(`commander`);

program
  .requiredOption(``, `--url`, `Remove sauce`)
  .option(`--cheese <flavour>`, `cheese flavour`, `mozzarella`)
  .option(`--no-cheese`, `plain with no cheese`);

module.exports = {
  name: `--test`,
  run(args) {
    console.info(`hello from test`, args);
  }
};
