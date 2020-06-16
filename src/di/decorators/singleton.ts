import Injectable from './injectable';

function Singleton(): ClassDecorator {
  return Injectable();
}

export default Singleton;
