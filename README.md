# @steffy/core

Package containing `core` functionalities for `S`mar`t` `E`nterpise `F`ramework `F`or `Y`ou application.

## Installation

```shell
npm i -S @steffy/core @steffy/di
```

## Usage

After installing import the required module from `@steffy/core` and `@steffy/di`.

```typescript
import {} from '@steffy/core';
import {} from '@steffy/di';
```

## Bootstrap application

### index.ts

```typescript
import { storage } from '@steffy/di';
import { Application } from './application';
import { boot } from './boot.sequence';

export async function main() {
  await boot();
  const app = storage.get(Application);
  await app.start();
}

main();
```

### application.ts

```typescript
import { LoggerPlugin } from '@steffy/core';
import { Inject, Optional, Singleton } from '@steffy/di';

@Singleton()
export class Application {
  constructor(@Inject() private logger: LoggerPlugin, @Optional('SteffyConfig') private config: any) {}

  public async start() {
    this.logger.log('my application', 'hello world!');
    console.log(this.config);
  }
}
```

### boot.sequence.ts

```typescript
import { moduleLoader, jsonLoader } from '@steffy/core';

const boot = async () => {
  await jsonLoader('./configs', 'config');
  await moduleLoader('./lib/plugins', 'plugin');
};

export { boot };
```

### logger.plugin.ts

```typescript
import { IPlugin, Logger } from '@steffy/core';
import { Singleton } from '@steffy/di';

@Singleton()
export class LoggerPlugin implements IPlugin {
  public pluginName = 'Logger';
  private _logger = new Logger();
  public debug = (mod: string, ...messages: any[]) => this._logger.debug(mod, ...messages);
  public error = (mod: string, ...messages: any[]) => this._logger.error(mod, ...messages);
  public info = (mod: string, ...messages: any[]) => this._logger.info(mod, ...messages);
  public log = (mod: string, ...messages: any[]) => this._logger.log(mod, ...messages);
}
```
