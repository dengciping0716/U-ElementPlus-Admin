/* Automatically generated by 'okui-core/build-entry.js' */

export * from './components';

import { setupDirectives } from './directives';
import { setupPlugins } from './plugins';

import type { App, Plugin } from 'vue';
//
import Components from './component';

const INSTALLED_KEY = Symbol('INSTALLED_KEY');

const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    // @ts-ignore
    if (app[INSTALLED_KEY]) return;
    // @ts-ignore
    app[INSTALLED_KEY] = true;

    setupDirectives(app);
    setupPlugins(app);

    components.forEach((c) => app.use(c));
  };

  return {
    version: '0.1.0',
    install,
  };
};
export default makeInstaller([...Components]);
