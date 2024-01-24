//
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createProxy } from '../../build/vite/proxy';
import { wrapperEnv } from '../../build/utils';
import { createVitePlugins } from '../../build/vite/plugin';
import { resolve } from 'path';
import dayjs from 'dayjs';
import pkg from './package.json';
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};
//
export default defineConfig(({ command, mode, ssrBuild }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root, ['VITE_', 'BUILD_']);
  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PROXY = [], BUILD_DROP_CONSOLE } = viteEnv;
  const isBuild = command === 'build';

  return {
    base: '/',
    // 路径重定向
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        { find: 'vue-i18n', replacement: 'vue-i18n/dist/vue-i18n.cjs.js' }, //解决i8n警告
      ],
      dedupe: ['vue', 'pinia', 'vue-router', 'lodash-es', 'echarts', '@vueuse/core', 'axios' ,'element-plus'],
    },
    // 全局 css 注册
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "src/styles/element/index.scss" as *;`,
        },
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
      warmup: {
        clientFiles: ['../common-core/components/**/*.vue', '../common-core/components/**/*.ts', '../common-utils/*.ts'],
        // ssrFiles: ['./src/server/modules/*.js'],
      },
      proxy: { '^/mock': 'http://example.com/', ...createProxy(VITE_PROXY) },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    esbuild: {
      pure: BUILD_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      emptyOutDir: true,
      outDir: '../../dist/admin',
      cssCodeSplit: false,//css 打包成一个
      // sourcemap:'inline',
      /**
       * 当 minify=“minify:'terser'” 解开注释
       * Uncomment when minify="minify:'terser'"
       */
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: VITE_DROP_CONSOLE,
      //   },
      // },
      // minify: false, //去除混淆代码
      brotliSize: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router'],
            // antdv: ['ant-design-vue'],
            // icons: ['@ant-design/icons-vue'],
            echarts: ['echarts'],
            // mockjs: ['mockjs'],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        '@element-plus/icons-vue',
        'pinia', //
        'axios', //
        'vue-router', //
        '@vueuse/core', //
        'dayjs/locale/en',
        'dayjs/locale/zh-cn',
        'lodash-es',
      ],
    },
  };
});
