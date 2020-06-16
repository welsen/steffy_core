import Injectable from './injectable';
import FACTORY_AS from '../enums/factory-as';

function Transient(): ClassDecorator {
  return Injectable(FACTORY_AS.TRANSIENT);
}

export default Transient;
