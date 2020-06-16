import NewableInjectable from '../interfaces/newable-injectable';
import DynamicInjectable from '../interfaces/dynamic-injectable';
import StaticInjectable from '../interfaces/static-injectable';

type Injectable = NewableInjectable | DynamicInjectable | StaticInjectable;

export default Injectable;
