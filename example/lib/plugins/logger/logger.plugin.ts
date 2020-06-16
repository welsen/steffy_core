import { Singleton } from '@steffy/di';
import { IPlugin, Logger } from '../../../../index';

@Singleton()
export class LoggerPlugin implements IPlugin {
  public pluginName = 'Logger';
  private _logger = new Logger();
  public debug = (mod: string, ...messages: any[]) => this._logger.debug(mod, ...messages);
  public error = (mod: string, ...messages: any[]) => this._logger.error(mod, ...messages);
  public info = (mod: string, ...messages: any[]) => this._logger.info(mod, ...messages);
  public log = (mod: string, ...messages: any[]) => this._logger.log(mod, ...messages);
}
