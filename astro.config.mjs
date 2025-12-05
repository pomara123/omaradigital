import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Detect if we are in production (GitHub Pages) or dev
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
    site: isProd ? 'https://pomara123.github.io/patrick-omara-website' : 'http://localhost:4321',
    base: '/',
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [mdx(), sitemap()],
});
