import Identifier from '../types/identifier';

interface CustomParamTypes {
  props: Map<string | symbol, Identifier<any>>;
  args: Map<number, Identifier<any>>;
  optional: Map<string | symbol | number, boolean>;
}

export default CustomParamTypes;
