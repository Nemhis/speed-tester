const {ExitCode} = require(`../constants`);

const message = `
Программа замеряет метрики производительности страницы.

    Гайд:
    server <command>
    
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --test <count>        формирует файл metrics.json`;

module.exports = {
  name: `--help`,
  run() {
    console.info(message);
    process.exit(ExitCode.success);
  }
};
