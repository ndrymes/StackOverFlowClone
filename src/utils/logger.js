const { createLogger, format, transports } = require('winston');
module.exports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  defaultMeta: { service: 'Stackoverflow clone' },
  transports: [
    new transports.File({
      maxsize: 5120000,
      //maxFiles:5,
      filename: `${process.cwd()}/logs/error.log`,
      level: 'error'
    }),
    new transports.File({ filename: `${process.cwd()}/logs/combinedlogs.log` })
  ]
});
