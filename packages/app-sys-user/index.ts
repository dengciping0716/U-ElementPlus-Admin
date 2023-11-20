// import { InputUser, selectPersons } from './src/components';
import route from './src/router';

export default {
  install(app: any, options: any) {
    // app.component('InputUser', InputUser);
    let { router } = options;
    router?.addRoute('HOME', route);

    // app.config.globalProperties.$selectPersons = selectPersons;
  },
};
