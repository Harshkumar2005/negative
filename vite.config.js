import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['monaco-editor/esm/vs/language/javascript/javascript.worker', 'monaco-editor/esm/vs/editor/editor.worker']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco': ['monaco-editor'],
          'codemirror': ['codemirror', '@codemirror/basic-setup'],
          'yjs': ['yjs', 'y-websocket', 'y-monaco']
        }
      }
    }
  }
});
