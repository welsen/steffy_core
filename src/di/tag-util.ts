import METADATA_KEYS from './enums/metadata-keys';

class TagUtil {
  public static tag(target: Function) {
    Reflect.defineMetadata(METADATA_KEYS.TAGGED, Symbol(METADATA_KEYS.TAG), target);
  }
  public static isTagged(target: Function) {
    if (!target) return false;
    return !!Reflect.getOwnMetadata(METADATA_KEYS.TAGGED, target);
  }
  public static tagProperty(target: Function) {
    Reflect.defineMetadata(METADATA_KEYS.TAGGED_PROP, Symbol(METADATA_KEYS.TAG), target);
  }
  public static isTaggedProperty(target: Function) {
    if (!target) return false;
    return !!Reflect.getOwnMetadata(METADATA_KEYS.TAGGED_PROP, target);
  }
}

export default TagUtil;
