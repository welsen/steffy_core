import Identifier from '../types/identifier';
import Inject from './inject';

function Optional<T = any>(identifier?: Identifier<T>) {
  return Inject(identifier, true);
}

export default Optional;
