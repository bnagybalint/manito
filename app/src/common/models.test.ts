import { serialize, Field, Model } from 'common/models'

@Model
class MyClass<T> {
    @Field()
    x: T;

    constructor(x: T) {
        this.x = x;
    }
};

describe('Field', () => {
    it('shoud be transparent to read', () => {
        expect(new MyClass(5).x).toEqual(5);
        expect(new MyClass(null).x).toEqual(null);
        expect(new MyClass(undefined).x).toEqual(undefined);
    });
    it('shoud be transparent to write', () => {
        let t = new MyClass(5);
        t.x = 6;
        expect(t.x).toEqual(6);
    });
    it('shoud have the same type as the data', () => {
        const t = new MyClass<number>(5);
        expect(typeof(t.x)).toEqual('number');
    });
});

describe('serialize', () => {
    it('should handle primitive fields', () => {
        expect(serialize(new MyClass(5))).toEqual({x: 5});
        expect(serialize(new MyClass(3.14))).toEqual({x: 3.14});
        expect(serialize(new MyClass('yes'))).toEqual({x: 'yes'});
        expect(serialize(new MyClass([1,2,3]))).toEqual({x: [1,2,3]});
        expect(serialize(new MyClass({rick: 'schwifty'}))).toEqual({x: {rick: 'schwifty'}});
        expect(serialize(new MyClass(true))).toEqual({x: true});
        expect(serialize(new MyClass(null))).toEqual({x: null});
        expect(serialize(new MyClass(undefined))).toEqual({x: undefined});
    });
    it('should handle Model fields', () => {

        @Model
        class A {
            @Field()
            x: number;
        
            constructor(x: number) {
                this.x = x;
            }
        };
        
        @Model
        class B {
            @Field()
            a: A;
        
            constructor(a: A) {
                this.a = a;
            }
        };
        
        expect(serialize(new B(new A(5)))).toEqual({a: {x: 5}});
    });
});