type Options = {
    abbreviate?: boolean;
};

type Unit = {
    name: string,
    abbreviation: string,
    numBytes: number,
};

const UNITS: Unit[] = [
    { name: "byte",     abbreviation: "B", numBytes: 1 },
    { name: "kilobyte", abbreviation: "kB", numBytes: 2**10 },
    { name: "megabyte", abbreviation: "MB", numBytes: 2**20 },
    { name: "gigabyte", abbreviation: "GB", numBytes: 2**30 },
    { name: "terabyte", abbreviation: "TB", numBytes: 2**40 },
    { name: "petabyte", abbreviation: "PB", numBytes: 2**50 },
]

export function bytesToHumanReadable(numBytes: number, options?: Options): string {
    const selectUnit = (x: number) => {
        for(let i = 0; i < UNITS.length - 1; ++i) {
            if(x < UNITS[i+1].numBytes) {
                return UNITS[i];
            }
        }
        return UNITS[UNITS.length - 1];
    }
    
    const unit = selectUnit(numBytes);

    const f = numBytes / unit.numBytes;
    const fi = Math.floor(f);
    const ff = Math.round((f - fi) * 1024);

    const fracStr = Number.isInteger(f) ? f.toString() : f.toFixed(3).replace(/[/.0]+$/, '');

    return `${fracStr} ${unit.abbreviation}`;
}