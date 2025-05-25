import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Site-Personalizado/', // isso é o NOME DO SEU REPOSITÓRIO no GitHub
  build: {
    target: 'es2018',
    outDir: 'dist',
  },
});
