'use strict';

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`./constants`);


const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  try {
    Cli[DEFAULT_COMMAND].run();
  } catch (error) {
    console.log(error.getMessage())
  }
}

const commandArgs = [...process.argv];
commandArgs.splice(USER_ARGV_INDEX, 1);

Cli[userCommand].run(commandArgs);
