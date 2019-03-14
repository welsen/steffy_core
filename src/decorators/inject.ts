import { inject as _inject, LazyServiceIdentifer } from 'inversify';
import { useInjectionToken } from '../utils';

export function inject(serviceIdentifier: any) {
  return _inject(new LazyServiceIdentifer(() => useInjectionToken(serviceIdentifier)));
}
