import { Inject, Optional, Singleton } from '@steffy/di';
import { LoggerPlugin } from './lib/plugins/logger/logger.plugin';

@Singleton()
export class Application {
  constructor(@Inject() private logger: LoggerPlugin, @Optional('SteffyConfig') private config: any) {}

  public async start() {
    this.logger.log('my application', 'hello world!');
    console.log(this.config);
  }
}
