import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// Strip Next.js 'use client' / 'use server' directives that cause Vitest worker hangs
function stripNextDirectives() {
  return {
    name: 'strip-next-directives',
    transform(code) {
      return code.replace(/^['"]use client['"];?\s*/m, '').replace(/^['"]use server['"];?\s*/m, '');
    },
  };
}

export default defineConfig({
  plugins: [stripNextDirectives(), react()],
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/test/**/*.{test,spec}.{js,jsx}'],
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
