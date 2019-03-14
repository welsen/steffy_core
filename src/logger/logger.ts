import chalk from 'chalk';
import moment from 'moment';
import { ILogger } from '../interfaces/logger';

export class Logger implements ILogger {
  private typeColor = {
    debug: chalk.yellowBright,
    error: chalk.redBright,
    info: chalk.blueBright,
    log: chalk.magentaBright
  };

  public debug = (mod: string, ...messages: any[]) => this.writeLog('debug', mod, ...messages);
  public error = (mod: string, ...messages: any[]) => this.writeLog('error', mod, ...messages);
  public info = (mod: string, ...messages: any[]) => this.writeLog('info', mod, ...messages);
  public log = (mod: string, ...messages: any[]) => this.writeLog('log', mod, ...messages);

  private writeLog(type: string, mod: string, ...messages: any[]) {
    console[type](`[${moment().format('YYYY-MM-DD HH:mm:ss')}][${this.typeColor[type](type.toUpperCase())}][${mod}]`, ...messages);
  }
}
