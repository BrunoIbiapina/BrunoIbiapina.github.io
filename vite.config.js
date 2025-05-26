import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/obrigado.html',
          dest: '', // root da pasta dist
        },
      ],
    }),
  ],
});
