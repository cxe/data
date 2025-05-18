#!/usr/bin/env node

import { readdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

Object.defineProperties(globalThis, {
    sourceDir: { value: `${dirname(fileURLToPath(import.meta.url)).replaceAll('\\','/')}/source` }
});

const methods = {
    async download(url, filename=''){
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GET ${url} failed ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (filename) await this.save(filename, JSON.stringify(data, null, 2));
        return data;
    },
    async save(filename, text=''){
        writeFile(filename, text, 'utf8');
    }
};

(async () => {
  const sources = await readdir(sourceDir, { withFileTypes: true });
  for (const source of sources) {
    if (source.isDirectory()) {
        source.parentPath = source.parentPath.replaceAll('\\', '/');
        source.path = [source.name];
        source.pathname = `/${source.name}`;
        source.datafile = `${source.parentPath}/${source.name}/${source.name}.json`;
        source.href = `file://${source.parentPath}/${source.name}/${source.name}.mjs`;
        const { setup } = Object.assign(source, await import(source.href), methods);
        await setup(source);
    }
  }
})();
