/**
 * @see https://www.faa.gov/data
 * @see https://aci.aero/
 * @see https://ourairports.com/data/
 */
export async function setup(source){
    if (source.expired()) {
        const data = await source.download('https://raw.githubusercontent.com/mwgg/Airports/refs/heads/master/airports.json', source.datafile);
        await source.index(data);
    }
}
