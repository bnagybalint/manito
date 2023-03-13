import { useRef, MouseEvent, ChangeEvent } from 'react';
import { Button } from '@mui/material';
import FileUpload from '@mui/icons-material/FileUpload';
import { bytesToHumanReadable } from '@manito/common';


type Props = {
    text?: string,
    // Content typoes to allow
    acceptContentTypes?: string[],
    // Maximum filesize allowed (bytes)
    maxFileSize?: number,
    // Function called when the file finished loading
    onUpload?: (fileContent: string) => void,
    // Function called when an error occurs during file loading
    onError?: (errorMessage: string) => void,
}

export function FileUploadButton({text, acceptContentTypes, maxFileSize, onUpload, onError}: Props) {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
  
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        hiddenFileInput.current!.click();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(onUpload) {
            const file = event.target.files?.[0];
            if(file !== undefined) {
                if(maxFileSize !== undefined && file.size > maxFileSize) {
                    onError?.(`File too large, maximum allowed size is ${bytesToHumanReadable(maxFileSize)}.`);
                    return;
                }

                // TODO add loading indicator

                file.text()
                    .then((content) => onUpload(content))
                    .catch((error) => onError?.(error));
            }
        }
    };
    
    return (
        <Button
            variant="contained"
            onClick={handleClick}
        >
            <FileUpload />
            {text ?? 'Upload'}
            <input
                hidden
                type="file"
                accept={acceptContentTypes?.join(',')}
                multiple={false}
                ref={hiddenFileInput}
                onChange={handleChange}
            />
        </Button>
    );
}