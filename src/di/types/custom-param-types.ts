import Identifier from './identifier';
import ICustomParamTypes from '../interfaces/custom-param-types';

class CustomParamTypes implements ICustomParamTypes {
  props = new Map<string | symbol, Identifier<any>>();
  args = new Map<number, Identifier<any>>();
  optional = new Map<number, boolean>();
}

export default CustomParamTypes;
