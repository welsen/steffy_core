import Injectable from './injectable';
import FACTORY_AS from '../enums/factory-as';

function Scoped(): ClassDecorator {
  return Injectable(FACTORY_AS.SCOPED);
}

export default Scoped;
