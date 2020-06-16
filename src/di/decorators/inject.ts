import MetadataResolver from '../metadata-resolver';
import CustomParamTypes from '../types/custom-param-types';
import Identifier, { isIdentifier } from '../types/identifier';

function setId<T = any>(identifier: Identifier<T>, optional: boolean, target: Function, key: string | symbol): Identifier<T> {
  let id = identifier;
  if (!isIdentifier(identifier) && !optional) throw new Error(`Could not resolve type for ${key.toString()}`);
  else if (!isIdentifier(identifier) && optional) id = `${target.name}:${key.toString}:optional`;
  return id;
}

function Inject<T = any>(identifier?: Identifier<T>, optional: boolean = false): any {
  return (currentTarget: Object | Function, key: string | symbol, index?: number) => {
    const target = typeof currentTarget === 'function' ? currentTarget : currentTarget.constructor;
    const customParamTypes = MetadataResolver.hasCustomParamTypes(target) ? MetadataResolver.getCustomParamTypes(target) : new CustomParamTypes();

    let id = identifier;
    if (index === undefined) {
      if (!key) throw new Error(`propery or ctor.argument not found`);
      if (!id) {
        const type = MetadataResolver.getType(target.prototype, key);
        id = setId(type, optional, target.prototype, key);
      }
      customParamTypes.props.set(key, id);
      if (optional) customParamTypes.optional.set(key, true);
    } else {
      if (!id) {
        const paramTypes = MetadataResolver.getParamTypes(target);
        const type = paramTypes![index];
        id = setId(type, optional, target, key);
      }
      customParamTypes.args.set(index, id);
      if (optional) customParamTypes.optional.set(index, true);
    }
    MetadataResolver.setCustomParamTypes(target, customParamTypes);
    return currentTarget;
  };
}

export default Inject;
