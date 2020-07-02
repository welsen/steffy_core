import { IRestFunction } from './rest-function';

export interface IRestMeta {
  controller?: any;
  name: string;
  func: IRestFunction;
}
