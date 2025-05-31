import { inspect } from "node:util";
import { parse as parseYAML, stringify as stringifyYAML} from 'yaml'


export class Data {
    constructor(data){

    }
}


export class JSON extends Data{
    #data = undefined;
    #conf = [ null, 2 ];

    constructor(data) {
        super(data);
        switch (typeof data) {
            case 'string':
                try {
                    this.#data = JSON.parse(data);
                } catch (e) {
                    this.#data = data;
                }
                break; 
            default:
                this.#data = data;
        }
        if (this.#data instanceof Object) { 
            Object.assign(this, this.#data);
            this.#data = this;
        }
    }

    toString(){
        return JSON.stringify(this.#data, ...this.#conf);
    }
}
Object.defineProperties(JSON, Object.getOwnPropertyDescriptors(globalThis.JSON));


export class YAML extends Data{
    constructor(data) {
        super(data);
        // todo verify
        Object.assign(this, parseYAML(data));
    }

    toString() {
        return stringifyYAML(this, null, 2);
    }
}


export class CSV extends Data{
    constructor(data) {
        super(data);
        // todo implement
    }
}


export class MD extends Data{
    constructor(data) {
        super(data);
        // todo implement
    }
}


export class XML extends Data{
    constructor(data) {
        super(data);
        // todo implement
    }
}


export class XLS extends Data{
    constructor(data) {
        super(data);
        // todo implement
    }
}


export class JS extends Data{
    #data = undefined;
    #conf = {};

    constructor(data) {
        super(data);
        switch (typeof data) {
            case 'string':
                try {
                    this.#data = JSON.parse(data);
                } catch (e) {
                    try {
                        this.#data = eval(data);
                    } catch (e) {
                        this.#data = data;
                    }
                }
                break;
            default:
                this.#data = data;
        }
        if (this.#data instanceof Object && !Array.isArray(this.#data)) { 
            Object.assign(this, this.#data);
            this.#data = this;
        }
    }

    get [Symbol.toStringTag]() {
        return 'JS';
    }

    toString() {
        const IGNORE_REGEX = /^(JS|Object) /;
        let s = inspect(this.#data === undefined ? this : this.#data, {
            showHidden: false,
            depth: Infinity,
            colors: false,
            customInspect: true,
            showProxy: false,
            maxArrayLength: Infinity,
            maxStringLength: Infinity,
            breakLength: Infinity,
            compact: 3,
            sorted: false,
            getters: false,
            numericSeparator: false,
            indentationStyle: 'tab',
            ...this.#conf
        });
        const i = s.indexOf('{');
        if (i < 0) return s;
        const className = s.slice(0, i);
        s = s.slice(i);
        if (className.match(IGNORE_REGEX)) return s
        return `/* ${className} */ ${s}`;
    }
}


export function getPrototypeChain(obj) {
    const chain = [];
    let current = obj;
    while (current) {
        const ctorName = current.constructor?.name || '(anonymous)';
        chain.unshift(ctorName);
        current = Object.getPrototypeOf(current);
    }
    return chain;
}


export default {
    JS,
    JSON,
    CSV,
    XLS,
    XML,
    YAML,
    MD
};
