// import { injector } from '../index';
import { Application } from './application';
import { boot } from './boot.sequence';
import storage from '../src/di/storage';

export async function main() {
  await boot();
  const app = storage.get(Application);
  await app.start();
}

main();
