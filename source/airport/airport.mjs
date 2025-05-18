import { existsSync } from 'node:fs';

export async function get(){

}

/**
 * @see https://www.faa.gov/data
 * @see https://aci.aero/
 * @see https://ourairports.com/data/
 */
export async function setup(source){
    //console.log(source);

    if (!existsSync(source.datafile)) {
        const data = await source.download('https://raw.githubusercontent.com/mwgg/Airports/refs/heads/master/airports.json', source.datafile);
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
            const indexFile = `${source.parentPath}/${source.name}/${source.name}.index.${field}.json`;
            await source.save(indexFile, JSON.stringify(index[field], null, 2));
        }
    }
}
