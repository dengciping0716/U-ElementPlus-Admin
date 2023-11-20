import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import mkcert from 'vite-plugin-mkcert';
import { autoImportPlugin } from './autoImport.js';
import { compression } from 'vite-plugin-compression2';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';

import Unocss from 'unocss/vite';

import mockDevServerPlugin from 'vite-plugin-mock-dev-server' 

export function createVitePlugins(viteEnv, isBuild) {
  const { BUILD_LEGACY, BUILD_INSPECT, BUILD_GZIP } = viteEnv;
  const vitePlugins = [
    vue(),
    vueJsx(),
    mkcert(),
    autoImportPlugin(viteEnv, isBuild),
    Icons({ /* options */ autoInstall: true }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),//{ configFile: path.resolve(__dirname, './uno.config.js') }
    //vueSetupExtend(),// support name
    mockDevServerPlugin({
      include: ['../mock/src/**/*.mock.{ts,js,json,json5}']
    }), 
  ];

  {
    const resolvers = [IconsResolver({ enabledCollections: ['ep'] })];
    // resolvers.push(ElementPlusResolver({ importStyle: 'sass' }))
    const types = [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }];
    vitePlugins.push(Components({ dts: './types/components.d.ts', resolvers, types }));
  }

  if (isBuild) {
    // 包分析，可关闭
    if (BUILD_INSPECT) vitePlugins.push(Inspect({ build: true, outputDir: '.vite-inspect' }));
    // ## ie 兼容
    if (BUILD_LEGACY) {
      // legacy({ targets: ['defaults', 'not IE 11'] })
      vitePlugins.push(
        legacy({
          targets: ['defaults', 'ie >= 11', 'chrome 52'],
          renderLegacyChunks: true,
          additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
          polyfills: [
            'es.symbol',
            'es.array.filter',
            'es.promise',
            'es.promise.finally',
            'es/map',
            'es/set',
            'es.array.for-each',
            'es.object.define-properties',
            'es.object.define-property',
            'es.object.get-own-property-descriptor',
            'es.object.get-own-property-descriptors',
            'es.object.keys',
            'es.object.to-string',
            'web.dom-collections.for-each',
            'esnext.global-this',
            'esnext.string.match-all',
          ],
        })
      );
    }
    // gzip 压缩
    if (BUILD_GZIP) vitePlugins.push(compression({ exclude: [/\.(br)$/, /\.(gz)$/] }));
  }

  return vitePlugins;
}
