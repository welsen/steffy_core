# @steffi/core

Package containing `core` functionalities for Steffi Home Assistant application. Also core can be used for any other application where you want to have **dependency injection**.

## Installation

```shell
npm i -S @steffi/core --registry=https://npm.flnf.hu/
```

## Usage

After installing import the required module from `@steffi/core`.

```typescript
import { } from '@steffi/core';
```

## Bootstrap application

### index.ts

```typescript
import { injector } from '@steffi/core';
import { Application } from './application';
import { boot } from './boot.sequence';

export async function main() {
  await boot();
  const app = injector.resolve(Application);
  await app.start();
}
main();
```

### application.ts

```typescript
import { inject, injectable } from '@steffi/core';
import { LoggerPlugin } from './lib/plugins/logger/logger.plugin';

@injectable()
export class Application {
  constructor(
    @inject('LoggerPlugin') private logger: LoggerPlugin
  ) {
  }

  public async start() {
    this.logger.log('my application', 'hello world!');
  }
}
```

### boot.sequence.ts

```typescript
import { injector, moduleLoader, SYMBOLS } from '@steffi/core';
import { Application } from './application';

const boot = async () => {
  // bind plugins
  await moduleLoader('./src/lib/plugins', 'plugin', true);
  // bind application singleton
  injector
    .bind<Application>(SYMBOLS.Application)
    .to(Application)
    .inSingletonScope();
};

export { boot, services };

```

### logger.plugin.ts

```typescript
import { injectable, Logger, IPlugin } from '@steffi/core';

@injectable()
export class LoggerPlugin implements IPlugin {
  public pluginName = 'Logger';
  private _logger = new Logger();
  public debug = (mod: string, ...messages: any[]) => this._logger.debug(mod, ...messages);
  public error = (mod: string, ...messages: any[]) => this._logger.error(mod, ...messages);
  public info = (mod: string, ...messages: any[]) => this._logger.info(mod, ...messages);
  public log = (mod: string, ...messages: any[]) => this._logger.log(mod, ...messages);
}
```