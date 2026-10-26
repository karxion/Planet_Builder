import { fileURLToPath, URL } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { sourceHash } from './scripts/release-source.ts';

const release = existsSync('.openai/release.json') ? JSON.parse(readFileSync('.openai/release.json', 'utf8')) : null;
if (release && sourceHash(process.cwd()) !== release.sourceHash) throw new Error('Release source differs from pinned GitHub commit');
const buildInfo = {
    version: JSON.parse(readFileSync('package.json', 'utf8')).version,
    commit: release?.commit ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    sourceHash: release?.sourceHash ?? '',
    schemaVersion: 1
};

export default {
    define: { __FPB_BUILD__: JSON.stringify(buildInfo) },
    root: './src',
    base: process.env.DEPLOY_BASE_PATH ?? (release || process.env.NETLIFY ? '/' : '/Fantasy-Planet-Builder/'),
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        assetsDir: './',
    },
    publicDir: '../public',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [{
        name: 'fpb-build-provenance',
        generateBundle() {
            this.emitFile({ type: 'asset', fileName: 'build-info.json', source: JSON.stringify(buildInfo, null, 2) });
        }
    }],
}
