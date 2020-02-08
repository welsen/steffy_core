export interface ILogger {
  debug: (mod: string, ...messages: any[]) => void;
  error: (mod: string, ...messages: any[]) => void;
  info: (mod: string, ...messages: any[]) => void;
  log: (mod: string, ...messages: any[]) => void;
}
