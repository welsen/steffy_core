import { IPlugin, Logger } from '../../../../index';
import Singleton from '../../../../src/di/decorators/singleton';

@Singleton()
export class LoggerPlugin implements IPlugin {
  public pluginName = 'Logger';
  private _logger = new Logger();
  public debug = (mod: string, ...messages: any[]) => this._logger.debug(mod, ...messages);
  public error = (mod: string, ...messages: any[]) => this._logger.error(mod, ...messages);
  public info = (mod: string, ...messages: any[]) => this._logger.info(mod, ...messages);
  public log = (mod: string, ...messages: any[]) => this._logger.log(mod, ...messages);
}
