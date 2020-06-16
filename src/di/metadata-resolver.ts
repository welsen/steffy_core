import METADATA_KEYS from './enums/metadata-keys';
import CustomParamTypes from './interfaces/custom-param-types';

class MetadataResolver {
  public static getParamTypes(target: Function) {
    return Reflect.getOwnMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, target);
  }
  public static getType(target: object, key: string | symbol) {
    return Reflect.getMetadata(METADATA_KEYS.DESIGN_TYPE, target, key);
  }
  public static getCustomParamTypes(target: Function): CustomParamTypes {
    return Reflect.getOwnMetadata(METADATA_KEYS.PARAM_TYPES, target);
  }
  public static hasCustomParamTypes(target: Function): boolean {
    return !!Reflect.getOwnMetadata(METADATA_KEYS.PARAM_TYPES, target);
  }
  public static setCustomParamTypes(target: Function, paramTypes: CustomParamTypes) {
    return Reflect.defineMetadata(METADATA_KEYS.PARAM_TYPES, paramTypes, target);
  }
  public static setOptional(target: object, key: string | symbol) {
    return Reflect.defineMetadata(METADATA_KEYS.OPTIONAL, true, target[key]);
  }
  public static isOptional(target: Function) {
    return !!Reflect.getOwnMetadata(METADATA_KEYS.OPTIONAL, target);
  }
}

export default MetadataResolver;
