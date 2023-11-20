//https://github.com/antfu/unplugin-auto-import
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';

export function autoImportPlugin(env, isBuild) {
  const resolvers = [
    // Auto import icon components
    // 自动导入图标组件
    // {prefix}-{collection}-{icon}
    IconsResolver({ prefix: 'Icon' }),
  ];

  // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
  // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
  // if (isBuild) resolvers.push(ElementPlusResolver());

  return AutoImport({
    // dts: true,
    dts: './types/auto-imports.d.ts',
    // targets to transform
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],

    resolvers,
    // global imports to register
    imports: [
      // presets
      'vue',
      'vue-router',
      'pinia',
      // custom
      {
        // '@vueuse/core': [
        //   // named imports
        //   'useMouse', // import { useMouse } from '@vueuse/core',
        //   // alias
        //   ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
        // ],
        axios: [
          // default imports
          ['default', 'axios'], // import { default as axios } from 'axios',
        ],
        dayjs: [['default', 'dayjs']],
        '@/io': [['http', '$http'], 'resolveUrl'],
      },
    ],
    // eslint报错解决
    eslintrc: {
      enabled: true, // Default `false`
      filepath: '../.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
  });
}
