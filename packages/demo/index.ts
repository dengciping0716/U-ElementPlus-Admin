import { pages } from './src/router';

export default {
  install(app: any, options: any) {
    let { router } = options;
    pages.map((route) => router?.addRoute('HOME', route));
  },
};
