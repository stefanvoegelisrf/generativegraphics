import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';

export default defineConfig({
    base: './',
    server: {
        open: true,
    },
    build: {
        outDir: 'dist'
    },
    plugins: [
        inject({
            p5: 'p5'
        }),
    ],
});