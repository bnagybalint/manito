import { bytesToHumanReadable } from "./stringUtils";


describe('bytesToHumanReadable', () => {

    test('abbreviations', () => {
        expect(bytesToHumanReadable(0)).toEqual('0 B');
        expect(bytesToHumanReadable(10)).toEqual('10 B');
        expect(bytesToHumanReadable(1023)).toEqual('1023 B');
        
        expect(bytesToHumanReadable(2*(2**10))).toEqual('2 kB');
        expect(bytesToHumanReadable(2*(2**20))).toEqual('2 MB');
        expect(bytesToHumanReadable(2*(2**30))).toEqual('2 GB');
        expect(bytesToHumanReadable(2*(2**40))).toEqual('2 TB');
        expect(bytesToHumanReadable(2*(2**50))).toEqual('2 PB');

        // fractionals: beyond the next threshold, sizes should be displayed as 3-digit fixed numbers
        expect(bytesToHumanReadable(2*1024 + 512)).toEqual('2.5 kB');
        expect(bytesToHumanReadable(3*1024*1024 + 128*1024)).toEqual('3.125 MB');
        expect(bytesToHumanReadable(1024+100)).toEqual('1.098 kB'); // 1.09765625 kB
        expect(bytesToHumanReadable(1024*1024+1)).toEqual('1 MB'); // 1.0.000000954 MB -> round down
    });

})