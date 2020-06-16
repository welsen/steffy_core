import FACTORY_TYPES from '../enums/factory-types';
import Identifier from '../types/identifier';

interface Generic<T extends FACTORY_TYPES> {
  type: T;
  identifier: Identifier<T>;
  ctor: any;
  value: any;
  resolver: any;
}

export default Generic;
