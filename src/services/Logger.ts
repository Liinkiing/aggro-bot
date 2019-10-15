import chalk from 'chalk'

const log = console.log
const warn = console.warn
const error = console.error
const info = console.info

export const blue = chalk.blue
export const red = chalk.red
export const yellow = chalk.yellow
export const green = chalk.green

export const bold = chalk.bold
export const underline = chalk.underline

export default new class Logger {

  public success = (message: string, ...args) => {
    log(chalk`${green.bold('[SUCCESS]')} - ${green(message)}`, ...args)
  }

  public info = (message: string, ...args) => {
    info(chalk`${blue.bold('[INFO]')} - ${blue(message)}`, ...args)
  }

  public warn = (message: string, ...args) => {
    warn(chalk`${yellow.bold('[WARN]')} - ${yellow(message)}`, ...args)
  }

  public error = (message: string, ...args) => {
    error(chalk`${red.bold('[ERROR]')} - ${red(message)}`, ...args)
    throw new Error(message)
  }
}

