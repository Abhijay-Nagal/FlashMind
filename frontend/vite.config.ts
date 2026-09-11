import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Serves `api/generate.ts` during `npm run dev`, exactly as Vercel does in
 * production, so the full PDF → flashcards flow works locally.
 * Put GROQ_API_KEY=... in frontend/.env.local to use it.
 */
function devApi(env: Record<string, string>): Plugin {
  return {
    name: 'flashmind-dev-api',
    apply: 'serve',
    configureServer(server) {
      for (const k of ['GROQ_API_KEY', 'LLM_API_KEY', 'LLM_BASE_URL', 'LLM_MODELS']) {
        if (env[k] && !process.env[k]) process.env[k] = env[k];
      }
      server.middlewares.use(async (req, res, next) => {
        // exact match only: Vite itself serves the module at /api/generate.ts
        if (req.url?.split('?')[0] !== '/api/generate') return next();
        try {
          const mod = await server.ssrLoadModule('/api/generate.ts');
          await mod.default(req, res);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'provider_error', message: (e as Error).message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      devApi(env),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: 'FlashMind — PDF to Flashcards',
          short_name: 'FlashMind',
          description: 'Turn any PDF into connected, swipeable flashcards with quizzes.',
          theme_color: '#021f28',
          background_color: '#021f28',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          categories: ['education', 'productivity'],
          icons: [
            { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
          screenshots: [
            { src: '/screenshots/study.png', sizes: '780x1688', type: 'image/png', form_factor: 'narrow', label: 'Swipe through topics in PDF order' },
            { src: '/screenshots/home.png', sizes: '780x1688', type: 'image/png', form_factor: 'narrow', label: 'Your decks, streak and daily goal' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,mjs,css,html,svg,png,woff2}'],
          globIgnores: ['screenshots/**'],
          // the pdf.js worker is ~1 MB; cache it so PDFs can be read offline
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/api\//],
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1600,
    },
    server: {
      host: true,
    },
  };
});
