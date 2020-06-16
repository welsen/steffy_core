import Newable from '../interfaces/newable';
import Abstract from '../interfaces/abstract';

type Identifier<T> = string | symbol | Newable<T> | Abstract<T>;

export default Identifier;

export const isIdentifier = (identifier: unknown) =>
  typeof identifier === 'string' || typeof identifier === 'symbol' || (typeof identifier === 'function' && typeof identifier !== 'object');
