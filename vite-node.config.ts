import { defineConfig } from 'vite';

// for running ./scripts with vite-node
export default defineConfig({
  mode: 'development',
  appType: 'custom',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {},
  },
});
