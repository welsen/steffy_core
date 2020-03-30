import { watch } from 'chokidar';
import { GlobSync } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import { basename, parse, resolve } from 'path';
import { IInjectable } from '../interfaces';
import { Logger } from '../logger';
import { asyncForEach, registerInjectionToken, useInjectionToken } from '../utils';
import { injector } from './injector';

const mainModuleRoot = __dirname.split('node_modules')[0].slice(0, -1);

const loaderCore = async (item: string, type: string, loaded: string[], asSingleton: boolean, watcherCall: boolean, storeIn?: any) => {
  const parsedItem = parse(item);
  const imported = await import(item); // http-server.plugin.ts file imported by the compiler
  const symbol = upperFirst(camelCase(basename(parsedItem.name))); // http-server.plugin.ts --> HttpServerPlugin
  const ctor = imported[symbol]; // class HttpServerPlugin contructor
  if (!watcherCall) {
    registerInjectionToken(symbol);
  }
  if (watcherCall) {
    injector.unbind(useInjectionToken(symbol));
  }
  if (!asSingleton) {
    injector.bind<IInjectable>(useInjectionToken(symbol)).to(ctor); // new HttpServerPlugin()
  } else {
    injector
      .bind<IInjectable>(useInjectionToken(symbol))
      .to(ctor)
      .inSingletonScope(); // new HttpServerPlugin() as singleton
  }
  if (!watcherCall) {
    loaded.push(symbol);
    if (storeIn) {
      storeIn[symbol] = imported;
    }
  }
};

const moduleLoader = async (path: string, type: string, asSingleton: boolean = false, storeIn?: any) => {
  const logger = new Logger();
  logger.log('STEFFI SYSTEM', `loading modules [${type}]`);
  const loaded: string[] = [];
  const base = resolve(mainModuleRoot, path);
  const tsGlob = `${base}/**/*${type}.ts`;
  const gs = new GlobSync(tsGlob);
  // const watcher = watch(tsGlob, {
  //   ignored: /(^|[\/\\])\../, // ignore dotfiles
  //   persistent: true
  // });
  // watcher.on('add', async (item) => {
  //   await loaderCore(item, type, loaded, asSingleton, true, storeIn);
  // });
  // watcher.on('change', async (item) => {
  //   await loaderCore(item, type, loaded, asSingleton, true, storeIn);
  // });
  await asyncForEach(gs.found, async (item: string) => {
    await loaderCore(item, type, loaded, asSingleton, false, storeIn);
  });
  logger.log('STEFFI SYSTEM', `loaded modules [${type}]`, loaded);
};

export { moduleLoader };
