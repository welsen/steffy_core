import Inject from '../src/di/decorators/inject';
import Optional from '../src/di/decorators/optional';
import Singleton from '../src/di/decorators/singleton';
import { LoggerPlugin } from './lib/plugins/logger/logger.plugin';

@Singleton()
export class Application {
  constructor(@Inject() private logger: LoggerPlugin, @Optional('SteffyConfig') private config: any) {}

  public async start() {
    this.logger.log('my application', 'hello world!');
    console.log(this.config);
  }
}
