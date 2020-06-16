import FACTORY_AS from './enums/factory-as';
import FACTORY_TYPES from './enums/factory-types';
import CustomParamTypes from './interfaces/custom-param-types';
import Newable from './interfaces/newable';
import IStorage from './interfaces/storage';
import MetadataResolver from './metadata-resolver';
import TagUtil from './tag-util';
import ArgMap from './types/arg-map';
import Cache from './types/cache';
import Container from './types/container';
import DynamincValueResolver from './types/dynamic-value-resolver';
import Identifier, { isIdentifier } from './types/identifier';
import Injectable from './types/injectable';
import Parents from './types/parents';
import StaticValue from './types/static-value';

class Storage implements IStorage {
  containers: Array<Container> = [];
  defaultContainer: Container;
  cache: Cache;

  constructor(container?: Container) {
    this.containers = [];
    this.defaultContainer = container || new Map();
    this.containers.push(this.defaultContainer);
    this.cache = new Map();
  }

  private findCached<T>(identifier: Identifier<T>, injectable: any): T | undefined {
    switch (injectable.as) {
      case FACTORY_AS.TRANSIENT:
        return;
      case FACTORY_AS.SINGLETON:
        return injectable.cache;
      case FACTORY_AS.SCOPED:
        return this.cache.get(identifier);
    }
  }

  private findInjectable<T>(identifier: Identifier<T>): Injectable | undefined {
    for (const container of this.containers) {
      const injectable = container.get(identifier);
      if (injectable) return injectable;
    }
    return;
  }

  private createCachedInjectable<T = any>(identifier: Identifier<T>, injectable: any, resolver: DynamincValueResolver<T>): T {
    const value = resolver();
    switch (injectable.as) {
      case FACTORY_AS.SCOPED:
        this.cache.set(identifier, value);
        break;
      case FACTORY_AS.SINGLETON:
        injectable.cache = value;
        break;
    }
    return value;
  }

  private checkCircularRef(identifier: Identifier<any>, parents: Parents) {
    if (parents.has(identifier)) throw new Error(`circular dependenecy detected: ${[...parents, identifier].map((i) => i.toString()).join('<->')}`);
  }

  private buildAgrsTable(argMaps: ArgMap[], customParamTypes: CustomParamTypes, ctor: Newable<any>, parents: Parents) {
    const args: any[] = [];
    for (const argMap of argMaps) {
      const carg = customParamTypes.args.get(argMap.idx);
      const optional = !!customParamTypes.optional.get(argMap.idx);
      const identifier = carg ? carg : argMap.arg;
      if (!isIdentifier(identifier) && !optional) throw new Error(`${ctor.name}::ctor argument ${argMap.idx} is not a valid identifier`);
      this.checkCircularRef(identifier, parents);
      let arg: any = this.resolve(identifier, new Set([...parents, identifier]), optional);
      args.push(arg);
    }
    return args;
  }

  private buildPropsTable(customParamTypes: CustomParamTypes, ctor: Newable<any>, parents: Parents) {
    const props = new Map<string | symbol, any>();
    for (const prop of customParamTypes.props) {
      const [key, identifier] = prop;
      this.checkCircularRef(identifier, parents);
      props.set(key, this.resolve(identifier, new Set([...parents, identifier])));
    }
    return props;
  }

  private resolveDependencies(injectable: any, parents: Parents) {
    const ctor = injectable.ctor;
    const paramTypes = MetadataResolver.getParamTypes(ctor);
    const customParamTypes = MetadataResolver.getCustomParamTypes(ctor);

    let args: any[] = [];
    let props = new Map<string | symbol, any>();
    if (paramTypes && customParamTypes) {
      const argMaps: ArgMap[] = paramTypes.map((arg: any, idx: any) => ({ arg, idx }));

      args = this.buildAgrsTable(argMaps, customParamTypes, ctor, parents);
      props = this.buildPropsTable(customParamTypes, ctor, parents);
    }

    return () => {
      const instance = new ctor(...args);
      for (const prop of props) {
        const [key, value] = prop;
        instance[key] = value;
      }
      return instance;
    };
  }

  private resolve<T>(identifier: Identifier<T>, parents: Parents, optional: boolean = false) {
    let cached: any;
    const injectable = this.findInjectable<T>(identifier) || this.findInjectable<T>(identifier.constructor);
    if (!identifier.toString().includes('[native code]')) {
      if (!injectable && !optional) throw new Error(`${String(identifier)} injectable not found`);
      if (!injectable && optional) return null;
      if (injectable)
        switch (injectable.type) {
          case FACTORY_TYPES.STATIC:
            return injectable.value;
          case FACTORY_TYPES.DYNAMIC:
            cached = this.findCached<T>(identifier, injectable);
            return cached ? cached : this.createCachedInjectable<T>(identifier, injectable, injectable.resolver);
          case FACTORY_TYPES.NEWABLE:
            cached = this.findCached<T>(identifier, injectable as any);
            return cached ? cached : this.createCachedInjectable<T>(identifier, injectable, this.resolveDependencies(injectable, parents));
          default:
            return (<any>identifier)();
        }
    }
    return optional ? null : (<any>identifier)();
  }

  private store(injectable: Injectable) {
    if (this.defaultContainer.has(injectable.identifier)) throw new Error(`already stored`);
    this.defaultContainer.set(injectable.identifier, injectable);
  }

  private selectClass<T>(identifier: Identifier<T>, clss?: Newable<T>) {
    let clzz: any = clss;
    if (!clzz) {
      if (typeof identifier === 'function') clzz = identifier;
      if (typeof identifier === 'object') clzz = identifier.constructor;
    }
    return clzz;
  }

  private addNewable<T>(identifier: Identifier<T>, clzz: Newable<T>, as: FACTORY_AS) {
    if (!TagUtil.isTagged(clzz)) throw new Error(`${clzz.name} is not @Injectable`);
    this.store({
      as,
      ctor: clzz,
      identifier: identifier as any,
      type: FACTORY_TYPES.NEWABLE,
      value: null,
      resolver: null,
    });
  }

  private addDynamic<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>, as: FACTORY_AS) {
    this.store({
      as,
      identifier: identifier as any,
      type: FACTORY_TYPES.DYNAMIC,
      resolver,
      value: null,
      ctor: null,
    });
  }

  get<T>(identifier: Identifier<T>): T {
    return this.resolve(identifier, new Set());
  }

  storeAsScoped<T>(clss: Newable<T>): void;
  storeAsScoped<T>(identifier: Identifier<T>, clss: Newable<T>): void;
  storeAsScoped<T>(identifier: Identifier<T>, clss?: Newable<T>): void {
    const clzz = this.selectClass(identifier, clss);
    this.addNewable(identifier, clzz, FACTORY_AS.SCOPED);
  }

  storeAsSingleton<T>(clss: Newable<T>): void;
  storeAsSingleton<T>(identifier: Identifier<T>, clss: Newable<T>): void;
  storeAsSingleton<T>(identifier: Identifier<T>, clss?: Newable<T>): void {
    const clzz = this.selectClass(identifier, clss);
    this.addNewable(identifier, clzz, FACTORY_AS.SINGLETON);
  }

  storeAsTransient<T>(clss: Newable<T>): void;
  storeAsTransient<T>(identifier: Identifier<T>, clss: Newable<T>): void;
  storeAsTransient<T>(identifier: Identifier<T>, clss?: Newable<T>): void {
    const clzz = this.selectClass(identifier, clss);
    this.addNewable(identifier, clzz, FACTORY_AS.TRANSIENT);
  }

  storeAsDynamicScoped<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>) {
    this.addDynamic(identifier, resolver, FACTORY_AS.SCOPED);
  }

  storeAsDynamicSingleton<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>) {
    this.addDynamic(identifier, resolver, FACTORY_AS.SINGLETON);
  }

  storeAsDynamicTransient<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>) {
    this.addDynamic(identifier, resolver, FACTORY_AS.TRANSIENT);
  }

  storeStatic<T>(identifier: Identifier<T>, value: StaticValue) {
    this.store({
      as: FACTORY_AS.SINGLETON,
      identifier: identifier as any,
      type: FACTORY_TYPES.STATIC,
      value,
      resolver: null,
      ctor: null,
    });
  }
}

const storage = new Storage();

export default storage;
