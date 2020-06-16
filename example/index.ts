import { storage } from '@steffy/di';
import { Application } from './application';
import { boot } from './boot.sequence';

export async function main() {
  await boot();
  const app = storage.get(Application);
  await app.start();
}

main();
