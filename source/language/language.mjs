/**
 * @see https://www.loc.gov/standards/iso639-2/php/code_list.
 * @see https://github.com/unicode-org/cldr-json/
 * @see https://github.com/umpirsky/locale-list
 */
export async function setup(source){
    if (source.expired()) {
        const data = {};
        for (const lang of ['en','de','fr','es','it','pt','ru','zh','ja']) {
            let tmp = await source.download(`https://raw.githubusercontent.com/unicode-org/cldr-json/refs/heads/main/cldr-json/cldr-localenames-full/main/${lang}/languages.json`);
            tmp = tmp.main[lang].localeDisplayNames.languages;
            for (const code in tmp) {
                data[code] ||= {};
                data[code][lang] = tmp[code];
            }
        }
        source.save(source.datafile, JSON.stringify(data, null, 2));
        await source.index(data);
    }
}
