import FactoryAs from './factory-as';
import FACTORY_TYPES from '../enums/factory-types';
import Cacheable from './cacheable';
import DynamincValueResolver from '../types/dynamic-value-resolver';

interface DynamicInjectable extends FactoryAs<FACTORY_TYPES.DYNAMIC>, Cacheable<any> {
  resolver: DynamincValueResolver<any>;
}

export default DynamicInjectable;
