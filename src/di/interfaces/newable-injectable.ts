import FactoryAs from './factory-as';
import FACTORY_TYPES from '../enums/factory-types';
import Cacheable from './cacheable';
import Newable from './newable';

interface NewableInjectable extends FactoryAs<FACTORY_TYPES.NEWABLE>, Cacheable<Newable<any>> {
  ctor: Newable<any>;
}

export default NewableInjectable;
