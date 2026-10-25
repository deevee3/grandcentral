import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const manifestPath = path.join(rootDir, 'public/build/manifest.json');
const snapshotPath = path.join(rootDir, 'resources/js/data/yard-snapshot.json');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(manifestPath)) {
    console.error('public/build/manifest.json not found. Run vite build first.');
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let snapshot = {};
if (fs.existsSync(snapshotPath)) {
    snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
}

const appEntry = manifest['resources/js/app.tsx'];
if (!appEntry) {
    console.error('resources/js/app.tsx entry not found in manifest.');
    process.exit(1);
}

const cssFiles = appEntry.css || [];
const jsFile = appEntry.file;

// 1. Create public/_redirects for Cloudflare Pages SPA fallback
fs.writeFileSync(path.join(publicDir, '_redirects'), '/*  /index.html  200\n');
console.log('Created public/_redirects');

// 2. Create public/index.html with static snapshot router
const cssLinks = cssFiles
    .map((css) => `<link rel="stylesheet" href="/build/${css}">`)
    .join('\n        ');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Grand Central</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=dm-sans:400,500,600,700|playfair-display:600,700|jetbrains-mono:400,500,600,700&display=swap" rel="stylesheet" />

        <script>
            (function() {
                const appearance = localStorage.getItem('appearance') || 'system';
                if (appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                }
            })();
        </script>

        <style>
            html {
                background-color: oklch(0.975 0.004 250);
                color-scheme: light;
            }
            html.dark {
                background-color: oklch(0.15 0.028 255);
                color-scheme: dark;
            }
        </style>

        ${cssLinks}
    </head>
    <body class="font-sans antialiased">
        <div id="app"></div>

        <script id="yard-snapshot-data" type="application/json">
${JSON.stringify(snapshot)}
        </script>

        <script>
            (function() {
                const snapshotElem = document.getElementById('yard-snapshot-data');
                const snapshot = snapshotElem ? JSON.parse(snapshotElem.textContent) : {};
                const pathname = window.location.pathname.replace(/\\/+$/, '') || '/';

                function resolvePage(path) {
                    const authUser = { id: 1, name: "D'Vaughn House", email: "dvaughn@dvaughnhouse.com" };
                    if (path === '' || path === '/') {
                        return {
                            component: 'welcome',
                            props: { canRegister: false },
                            url: '/',
                            version: ''
                        };
                    }
                    if (path === '/dashboard') {
                        return {
                            component: 'dashboard',
                            props: { auth: { user: authUser }, ...(snapshot.dashboard || { trains: [] }) },
                            url: '/dashboard',
                            version: ''
                        };
                    }
                    if (path === '/central-tower') {
                        return {
                            component: 'central-tower/index',
                            props: { auth: { user: authUser }, ...(snapshot.centralTower || { trains: [], allTasks: [], taskStats: {} }) },
                            url: '/central-tower',
                            version: ''
                        };
                    }
                    if (path === '/settings/ai') {
                        return {
                            component: 'settings/ai',
                            props: { auth: { user: authUser }, ...(snapshot.aiSettings || {}) },
                            url: '/settings/ai',
                            version: ''
                        };
                    }
                    const smMatch = path.match(/^\\/station-master\\/(\\d+)$/);
                    if (smMatch) {
                        const trainId = smMatch[1];
                        const trainData = (snapshot.stationMaster && snapshot.stationMaster[trainId]) 
                            || (snapshot.stationMaster && Object.values(snapshot.stationMaster)[0])
                            || {};
                        return {
                            component: 'station-master/show',
                            props: { auth: { user: authUser }, ...trainData },
                            url: path,
                            version: ''
                        };
                    }
                    return {
                        component: 'dashboard',
                        props: { auth: { user: authUser }, ...(snapshot.dashboard || { trains: [] }) },
                        url: path,
                        version: ''
                    };
                }

                const initialPage = resolvePage(pathname);
                const appDiv = document.getElementById('app');
                appDiv.setAttribute('data-page', JSON.stringify(initialPage));

                // Intercept Inertia requests in static mode (Cloudflare Pages)
                const originalFetch = window.fetch;
                window.fetch = function(resource, init) {
                    const headers = (init && init.headers) || {};
                    const isInertia = headers['X-Inertia'] || headers['x-inertia'];
                    const urlStr = typeof resource === 'string' ? resource : (resource && resource.url) || '';
                    const parsedUrl = new URL(urlStr, window.location.origin);

                    if (isInertia && parsedUrl.origin === window.location.origin) {
                        const targetPath = parsedUrl.pathname.replace(/\\/+$/, '') || '/';
                        const pageData = resolvePage(targetPath);
                        return Promise.resolve(new Response(JSON.stringify(pageData), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Inertia': 'true'
                            }
                        }));
                    }
                    return originalFetch.apply(this, arguments);
                };
            })();
        </script>

        <script type="module" src="/build/${jsFile}"></script>
    </body>
</html>
`;

fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
console.log('Created public/index.html with Cloudflare Pages static SPA bootloader');
