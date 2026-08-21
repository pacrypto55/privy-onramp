import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@orderly.network/plugin-core',
    '@orderly.network/ui',
    '@pacrypto55/wallet-menu',
    '@privy-io/react-auth',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
