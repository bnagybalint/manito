interface ModelBase {};

type FieldOptions = {
    toJson?: (x: any) => any;
    fromJson?: (x: any) => any;
};

export function Field(options?: FieldOptions) {
    console.log('Field() factory called');
    return (target: any, propertyKey: string) => {
    }
}

export function Model<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements ModelBase {};
}

export function serialize(obj: any): any {
    console.log(`serialize called: ${obj}`);
    
    // Allow primitive types throught unchanged
    if(typeof(obj) == 'number'
        || typeof(obj) == 'boolean'
        || typeof(obj) == 'string'
        || obj === null
        || obj === undefined
    ) {
        console.log('it is primitive');
        return obj;
    }

    // Process arrays recursively
    if(Array.isArray(obj)) {
        console.log('it is array');

        return obj.map((item: any) => serialize(item));
    }

    // Process objects
    // TODO only process Model objects and only Field properties
    if(obj instanceof Object) {
        console.log('it is object');
        let result: {[k: string]: any} = {};
        Object.entries(obj).forEach(([key, value]: [string, any]) => {
            console.log(`recursing to property ${key}`);
            result[key] = serialize(value);
        })
        return result;
    }
}