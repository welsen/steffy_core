import FactoryAs from './factory-as';
import FACTORY_TYPES from '../enums/factory-types';
import StaticValue from '../types/static-value';

interface StaticInjectable extends FactoryAs<FACTORY_TYPES.STATIC> {
  value: StaticValue;
}

export default StaticInjectable;
