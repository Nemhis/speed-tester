const version = require(`./version`);
const help = require(`./help`);
const test = require(`./test`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [test.name]: test,
};

module.exports = {
  Cli,
};
