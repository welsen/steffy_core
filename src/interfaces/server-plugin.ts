import { IPlugin } from "./plugin";

export interface IServerPlugin extends IPlugin {
  server: any;
  listen: () => void;
}
