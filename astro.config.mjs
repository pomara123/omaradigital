import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const isProd = process.env.NODE_ENV === 'production';
//const isProd = true;

export default defineConfig({
    site: isProd
        ? 'https://pomara123.github.io/patrick-omara-website'
        : 'http://localhost:4321',
    base: isProd ? '/patrick-omara-website/' : '/',
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [mdx(), sitemap()],
});
