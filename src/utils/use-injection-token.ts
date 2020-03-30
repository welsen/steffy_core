import { SYMBOLS } from './token-comtainer';

export function useInjectionToken(token: any) {
  if (SYMBOLS[token]) {
    return SYMBOLS[token];
  }
}
