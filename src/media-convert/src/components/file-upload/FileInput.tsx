import React, { useState, useRef, ChangeEvent } from 'react';
import {truncateFileFunc} from "~/components/file-upload/utils";

interface Props {
    types: string;
    disabled: boolean;
    multiple: boolean;
    required: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
}

export default function FileInput (props: Props) {
    const [fileName, setFileName] = useState<string>('');

    const handleClick = (): void => {
        console.log("hclick")
        props.inputRef.current?.click();
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        const file = files ? files[0] : undefined;
        if (file) {
            const truncatedName = truncateFileFunc(file.name, 10);
            setFileName(truncatedName);
        }
    };

    return (
        <div>
            <input
                id="file-upload"
                type="file"
                ref={props.inputRef}
                onChange={handleInputChange}
                accept={props.types}
                disabled={props.disabled}
                multiple={props.multiple}
                required={props.required}
                className="hidden"
            />
            <button type="button" onClick={handleClick}>
                {fileName ? `Selected file: ${fileName}` : 'Drop or Select Files'}
            </button>
        </div>
    );
};

