'use strict';

const program = require(`commander`);

program
  .requiredOption(`--url <url>`, `Page url for test`)
  .option(`--count <count>`, `Count test iteration`, 1);


module.exports = {
  name: `--test`,
  run(args) {
      program.parse(args);
      const {url, count} = program.opts();

      console.log(program.opts());
  }
};
