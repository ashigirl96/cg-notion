// 最後に全容を載せておきます

import type { ApiStatus } from '@/lib/api'
import pino from 'pino'

type Option = {
  caller: string
  status: number
}

const pinoConfig = {
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  browser: {
    asObject: true,
  },
}

const logger = pino(pinoConfig)

export class Logger {
  constructor(private caller: string) {}

  error(message: string, option: { status: ApiStatus }) {
    logger.error({ caller: this.caller, ...option }, message)
  }

  warn(message: string, option: { status: ApiStatus }) {
    logger.error({ caller: this.caller, ...option }, message)
  }

  info(message: string, option: { status: ApiStatus }) {
    logger.error({ caller: this.caller, ...option }, message)
  }

  debug(message: string, option: { status: ApiStatus }) {
    logger.error({ caller: this.caller, ...option }, message)
  }
}
