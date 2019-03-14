import { IPlugin } from "./plugin";

export interface IServerPlugin extends IPlugin {
  listen: () => void;
}