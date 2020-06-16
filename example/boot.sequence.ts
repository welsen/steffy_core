import { moduleLoader, jsonLoader } from '../index';

const boot = async () => {
  await jsonLoader('./configs', 'config');
  await moduleLoader('./lib/plugins', 'plugin');
};

export { boot };
