import { JSON, Data, JS } from '../source/data.mjs';

describe('data', ()=>{

    describe('JSON', ()=>{
        it('should expose the native static JSON methods (no builtin override after import)', ()=>{
            const methods = eval('Object.getOwnPropertyNames(globalThis.JSON).join(" ")').split(" ");
            for (const method of methods) {
                expect(`${method} ${typeof JSON[method]}`).toBe(`${method} function`);
            }
        });
        it('should allow non-object JSON input and output', ()=>{
            expect(`${new JSON('null')}`).toEqual('null');
            expect(String(new JSON('42.5'))).toBe('42.5');
            expect(new JSON('false').toString()).toBe('false');
        });
        it('should create a Data object that stringifies to JSON', ()=>{
            const json = '{"blank":"","zero":0,"null":null,"false":false,"empty":[],"basic":{}}';
            const data = new JSON(json);
            expect(data).toBeInstanceOf(Data);
            expect(data).toBeInstanceOf(JSON);
            expect(data.zero).toBe(0);
            expect(String(data).replace(/\s/g, '')).toBe(json);
        });
    });

    describe('JS', ()=>{
        it('should create a Data object accepting JSON input and stringifies to JavaScript', ()=>{
            const json = '{"foo":"bar"}';
            const data = new JS(json);
            expect(data).toBeInstanceOf(Data);
            expect(data).toBeInstanceOf(JS);
            expect(String(data).replace(/\s/g, '')).toBe("{foo:'bar'}");
        });
        it('should accept JS', ()=>{
            const data = new JS({foo: 1+2, baz(){}, '-': -1});
            expect(JSON.stringify(data)).toBe('{"foo":3,"-":-1}');
        });
        it('should accept non-object input', ()=>{
            expect(`${ new JS(null) }`).toBe('null');
        });
        it('should accept arrays', ()=>{
            expect(`${ new JS([]) }`).toBe('[]');
            expect(`${ new JS([1,2]) }`.replace(/\s/g, '')).toBe('[1,2]');
            expect(`${ new JS([1,'2']) }`.replace(/\s/g, '')).toBe("[1,'2']");
        });
    });
});
