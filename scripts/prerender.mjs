import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

// Ship complete readable HTML for search engines and visitors before hydration.
await mkdir('.cache',{recursive:true});
await build({entryPoints:['src/App.tsx'],outfile:'.cache/prerender.mjs',bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',logLevel:'silent'});
const {default:App}=await import(pathToFileURL(path.resolve('.cache/prerender.mjs')));
const markup=renderToString(createElement(App));
const html=await readFile('dist/index.html','utf8');
if(!html.includes('<div id="root"></div>'))throw new Error('Prerender target missing');
await writeFile('dist/index.html',html.replace('<div id="root"></div>',`<div id="root">${markup}</div>`));
console.log('Prerendered complete homepage HTML.');
