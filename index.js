#!/usr/bin/env node

import { existsSync } from 'node:fs';
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
    },
    async index(data){
        const index = {};
        for (const id in data) {
            const item = data[id];
            for (const field in item) {
                const value = item[field];
                index[field] ||= {name: field, unique: true, id: {}};
                const key = String(value || '').toUpperCase(); 
                if (key) {
                    if (key in index[field].id) {
                        if (Array.isArray(index[field].id[key])) {
                            index[field].id[key].push(id);
                        } else if (index[field].id[key] !== id) {
                            index[field].unique = false;
                            for (const k in index[field].id) {
                                if (Array.isArray(index[field].id[k])) continue;
                                index[field].id[k] = [index[field].id[k]];
                            }
                            index[field].id[key].push(id);
                        }
                    } else {
                        index[field].id[key] = id;
                    }
                }
            }
        }
        for (const field in index) {
            index[field].id = Object.assign({}, ...Object.keys(index[field].id).sort().map(id => ({[id]: index[field].id[id]})));
            const indexFile = `${this.parentPath}/${this.name}/${this.name}.index.${field}.json`;
            await this.save(indexFile, JSON.stringify(index[field], null, 2));
        }
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
