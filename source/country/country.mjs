/**
 * @see https://www.iso.org/iso-3166-country-codes.html
 * @see https://population.un.org/dataportal/about/dataapi
 * @see https://github.com/unicode-org/cldr-json/blob/main/cldr-json/cldr-localenames-full/main/en/territories.json
 */
export async function setup(source){
    if (source.expired()) {
        const data = await source.download('https://raw.githubusercontent.com/stefangabos/world_countries/refs/heads/master/data/countries/_combined/countries.json', source.datafile);
        await source.index(data);
    }
}