// uno.config.ts
import path from 'path';

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

export default defineConfig({
  variants: [],
  rules: [[/^columns-(\d+)$/, ([, d]) => ({ 'column-count': d })]],
  shortcuts: {},
  theme: {
    colors: {},
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle !important',
        'background-color': 'currentColor',
        // ...
      },
      collections: {
        comp: FileSystemIconLoader(path.resolve(__dirname, './packages/admin/src/assets/component-svg/'), (svg) =>
          svg.replace(/#fff/, 'currentColor')
        ),
      },
    }),
    // presetTypography(),
    //   presetWebFonts({
    //     fonts: {
    //       // ...
    //     },
    //   }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
