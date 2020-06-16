import Newable from '../interfaces/newable';
import Cache from '../types/cache';
import Container from '../types/container';
import DynamincValueResolver from '../types/dynamic-value-resolver';
import Identifier from '../types/identifier';
import StaticValue from '../types/static-value';

interface Storage {
  containers: Array<Container>;
  cache: Cache;

  get<T>(identifier: Identifier<T>): T;

  storeAsScoped<T>(clss: Newable<T>): void;

  storeAsScoped<T>(identifier: Identifier<T>, clss: Newable<T>): void;

  storeAsScoped<T>(identifier: Identifier<T>, clss?: Newable<T>): void;

  storeAsSingleton<T>(clss: Newable<T>): void;

  storeAsSingleton<T>(identifier: Identifier<T>, clss: Newable<T>): void;

  storeAsSingleton<T>(identifier: Identifier<T>, clss?: Newable<T>): void;

  storeAsTransient<T>(clss: Newable<T>): void;

  storeAsTransient<T>(identifier: Identifier<T>, clss: Newable<T>): void;

  storeAsTransient<T>(identifier: Identifier<T>, clss?: Newable<T>): void;

  storeAsDynamicScoped<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>): void;

  storeAsDynamicSingleton<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>): void;

  storeAsDynamicTransient<T>(identifier: Identifier<T>, resolver: DynamincValueResolver<T>): void;

  storeStatic<T>(identifier: Identifier<T>, value: StaticValue): void;
}

export default Storage;
