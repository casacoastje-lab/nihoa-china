import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: process.env.NODE_ENV === 'production' ? './' : '/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.ZHIPU_API_KEY': JSON.stringify(env.VITE_ZHIPU_API_KEY || env.ZHIPU_API_KEY || process.env.VITE_ZHIPU_API_KEY || process.env.ZHIPU_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || env.SUPABASE_URL || process.env.SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
      'import.meta.env.VITE_AMAP_KEY': JSON.stringify(env.VITE_AMAP_KEY || process.env.VITE_AMAP_KEY || env.AMAP_KEY || process.env.AMAP_KEY),
      'import.meta.env.VITE_AMAP_SECRET': JSON.stringify(env.VITE_AMAP_SECRET || process.env.VITE_AMAP_SECRET || env.AMAP_SECRET || process.env.AMAP_SECRET),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
