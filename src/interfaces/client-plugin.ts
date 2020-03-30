import { IPlugin } from './plugin';

export interface IClientPlugin extends IPlugin {
  client: any;
}
