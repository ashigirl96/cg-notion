// 最後に全容を載せておきます

import pino from "pino";

type Option = {
  caller: string;
  status: number;
};

const pinoConfig = {
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  browser: {
    asObject: true,
  },
};

export const logger = pino(pinoConfig);

// export const loggerError = (message: string, option: Option) => {
//   return logger.error(option, message);
// };
//
// export const loggerWarn = (message: string, option: Option) => {
//   return logger.warn(option, message);
// };
//
// export const loggerInfo = (message: string, option: Option) => {
//   return logger.info(option , message);
// };
//
// export const loggerDebug = (message: string, option: Option) => {
//   return logger.debug(option, message);
// };
