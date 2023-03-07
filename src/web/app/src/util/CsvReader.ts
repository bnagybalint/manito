export interface _Options {
    // Signal to the parser that the input has a header row. Default: true
    hasHeader: boolean;
    // Do not return header as record. Default: false
    omitHeader: boolean;
    // Record value delimiter. Default: ';'
    delimiter: string | RegExp;
    // Record delimiter. Default: newline characters
    recordDelimiter: string | RegExp;
    // Trim leading whitespace from each record value. Default: true
    ltrim: boolean;
    // Trim trailing whitespace from each record value. Default: true
    rtrim: boolean;
};

export type Options = Partial<_Options>;

function getOptions(options?: Options): _Options {
    return {
        hasHeader: options?.hasHeader ?? true,
        omitHeader: options?.omitHeader ?? false,
        delimiter: options?.delimiter ?? /;/,
        recordDelimiter: options?.recordDelimiter ?? /\r|\n|\r\n/,
        ltrim: options?.ltrim ?? true,
        rtrim: options?.rtrim ?? true,
    };
}

export function parseCsv(data: string, options?: Options) {
    const opt = getOptions(options);

    const lines = data.split(opt.recordDelimiter);

    let result: string[][] = [];
    let first = true;
    for(const line of lines) {
        let tokens = line.split(opt.delimiter);

        if(opt.ltrim)
            tokens = tokens.map(x => x.trimStart());
        if(opt.rtrim)
            tokens = tokens.map(x => x.trimEnd());

        if(tokens.length === 1 && tokens[0] === ''){
            // empty line
            continue;
        }
        
        if(first) {
            first = false;
            if(opt.hasHeader && opt.omitHeader) {
                continue;
            }
        }

        result.push(tokens);
    }

    return result;
}