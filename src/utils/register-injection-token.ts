import { SYMBOLS } from "./token-comtainer";

export function registerInjectionToken(token: any) {
  if (!SYMBOLS[token!]) {
    SYMBOLS[token!] = Symbol.for(token);
  }
}

