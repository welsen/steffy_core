import FACTORY_TYPES from '../enums/factory-types';
import FACTORY_AS from '../enums/factory-as';
import Generic from './generic';

interface FactoryAs<T extends FACTORY_TYPES> extends Generic<T> {
  as: FACTORY_AS;
}

export default FactoryAs;
