import { App } from 'vue';
import { Router } from 'vue-router';

import demo from 'demo';
import SysUser from '@app/sys-user';


export function registerPackage(app: App, router: Router) {
  app.use(demo, { router });
  app.use(SysUser, { router });
}
