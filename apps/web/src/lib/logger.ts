import pino from 'pino'
import pretty from 'pino-pretty'
import type { ApiStatus } from './api'

const stream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:standard',
  singleLine: false,
  levelFirst: true,
  colorizeObjects: true,
})
const logger = pino(stream)

export class Logger {
  constructor(private caller: string) {}

  error(message: object, option: { status: ApiStatus }) {
    logger.error({ caller: this.caller, ...option }, this.formatJson(message))
  }

  warn(message: object, option: { status: ApiStatus }) {
    logger.warn({ caller: this.caller, ...option }, this.formatJson(message))
  }

  info(message: object, option: { status: ApiStatus }) {
    logger.info({ caller: this.caller, ...option }, this.formatJson(message))
  }

  debug(message: object, option: { status: ApiStatus }) {
    logger.debug({ caller: this.caller, ...option }, this.formatJson(message))
  }

  private formatJson(message: object) {
    return JSON.stringify(message, null, 2)
  }
}
