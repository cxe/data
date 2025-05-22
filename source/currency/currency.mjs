/**
 * @see https://datahub.io/core/currency-codes
 */
export async function setup(source){
    if (source.expired()) {
        const data = {};
        const list = await source.download('https://raw.githubusercontent.com/leequixxx/currencies.json/refs/heads/master/currencies.json');
        for (const currency of list) {
            currency.code = currency.code.toUpperCase(); // ISO-4217
            data[currency.code] = currency;
        }
        await source.save(source.datafile, JSON.stringify(data, null, 2));
        await source.index(data);
    }
}