import Injectable from './injectable';
import Identifier from './identifier';

type Container = Map<Identifier<any>, Injectable>;

export default Container;
