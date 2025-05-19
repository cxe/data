import { existsSync } from 'node:fs';

/**
 * @see https://www.iana.org/time-zones
 */
export async function setup(source){
    if (!existsSync(source.datafile)) {
        const data = await source.download('https://raw.githubusercontent.com/dmfilipenko/timezones.json/refs/heads/master/timezones.json', source.datafile);
        await source.index(data);
    }
}