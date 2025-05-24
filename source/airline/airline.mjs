/**
 * @see https://corgis-edu.github.io/corgis/datasets/json/airlines/airlines.json
 * @see https://github.com/dotmarn/Airlines/blob/master/airlines.json
 * @see https://catalog.data.gov/dataset/?q=airline&res_format=JSON
 * @see https://resources.oreilly.com/examples/0636920233145/-/raw/master/data/airlines.json?ref_type=heads&inline=false
 */
export async function setup(source){
    if (source.expired()) {
        const data = {};
        for (const airline of await source.download('https://raw.githubusercontent.com/npow/airline-codes/refs/heads/master/airlines.json')){
            data[airline.id] = airline;
        }
        await source.save(source.datafile, JSON.stringify(data, null, 2));
        await source.index(data);
    }
}