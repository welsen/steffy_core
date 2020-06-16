import TagUtil from '../tag-util';
import storage from '../storage';
import FACTORY_AS from '../enums/factory-as';
import FACTORY_TYPES from '../enums/factory-types';

function Injectable(factoryAs: FACTORY_AS = FACTORY_AS.SINGLETON, factoryType: FACTORY_TYPES = FACTORY_TYPES.NEWABLE): ClassDecorator {
  return (target: Function) => {
    if (TagUtil.isTagged(target)) throw new Error(`${target.name} already set as @Injectable`);
    TagUtil.tag(target);

    if (factoryType === FACTORY_TYPES.STATIC || factoryType === FACTORY_TYPES.DYNAMIC) throw new Error(`Static and dynamic injections must be bound manually`);

    // auto store newable
    switch (factoryAs) {
      case FACTORY_AS.SCOPED:
        storage.storeAsScoped(target, target.prototype.constructor);
        break;
      case FACTORY_AS.SINGLETON:
        storage.storeAsSingleton(target, target.prototype.constructor);
        break;
      case FACTORY_AS.TRANSIENT:
        storage.storeAsTransient(target, target.prototype.constructor);
        break;
    }
  };
}

export default Injectable;
