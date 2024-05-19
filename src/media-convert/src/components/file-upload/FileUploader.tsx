import {acceptedExt, checkType, getFileSizeMB, listArrayWithCommasAnd, truncateFileFunc} from './utils';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import useDragging from "~/hooks/useDraging";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "~/components/ui/tooltip";
import {clsx} from "clsx";
import DrawTypes from "~/components/file-upload/DrawTypes";
import FileInput from "~/components/file-upload/FileInput";
import Dropzone from 'react-dropzone';
import {useDropzone} from 'react-dropzone';

type Props = {
    name?: string;
    hoverTitle?: string;
    types?: Array<string>;
    classes?: string;
    children?: JSX.Element;
    maxSize?: number;
    minSize?: number;
    fileOrFiles?: Array<File> | File | null;
    disabled?: boolean | false;
    label?: string | undefined;
    multiple?: boolean | false;
    required?: boolean | false;
    onSizeError?: (arg0: string) => void;
    onTypeError?: (arg0: string) => void;
    onDrop?: (arg0: File | Array<File>) => void;
    onSelect?: (arg0: File | Array<File>) => void;
    handleChange?: (arg0: File | Array<File> ) => void;
    onDraggingStateChange?: (dragging: boolean) => void;
    dropMessageStyle?: React.CSSProperties | undefined;
    truncateName?: boolean | false;
    truncateLength?: number ;
};
/**
 *
 * Draw a description on the frame
 * @param currFile - The uploaded file
 * @param uploaded - boolean to check if the file uploaded or not yet
 * @param typeError - boolean to check if the file has type errors
 * @param disabled - boolean to check if input is disabled
 * @param label - string to add custom label
 * @returns JSX Element
 *
 * @internal
 *
 */
const drawDescription = (
    currFile: Array<File> | File | null,
    uploaded: boolean,
    typeError: boolean,
    disabled: boolean | undefined,
    label: string | undefined
) => {

    console.log("current file ", currFile, uploaded);

    return typeError ? (
        <span>File type/size error, Hovered on types!</span>
    ) : (
        <div>
            {disabled ? (
                <span>Upload disabled</span>
            ) : !currFile && !uploaded ? (
                <>
                    {label ? (
                        <>
                            <span>{label.split(' ')[0]}</span>{' '}
                            {label.substr(label.indexOf(' ') + 1)}
                        </>
                    ) : (
                        <>
                            <span>Upload</span> or drop a file right here
                        </>
                    )}
                </>
            ) : (
                <>
                    <span>Uploaded Successfully!</span> Upload another?
                </>
            )}
        </div>
    );
};

/**
 * File uploading main function
 * @param props - {name,
 hoverTitle,
 types,
 handleChange,
 classes,
 children,
 maxSize,
 minSize,
 fileOrFiles,
 onSizeError,
 onTypeError,
 onSelect,
 onDrop,
 disabled,
 label,
 multiple,
 required,
 onDraggingStateChange
 }
 * @returns JSX Element
 */
export default function FileUploader(props: Props) {
    const {
        name,
        hoverTitle,
        types,
        handleChange,
        classes,
        children,
        maxSize,
        minSize,
        fileOrFiles,
        onSizeError,
        onTypeError,
        onSelect,
        onDrop,
        disabled,
        label,
        multiple,
        required,
        onDraggingStateChange,
        dropMessageStyle,
        truncateName,
        truncateLength
    } = props;
    const labelRef = useRef<HTMLLabelElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploaded, setUploaded] = useState(false);
    const [currFiles, setFile] = useState<Array<File> | File | null>(null);
    const [error, setError] = useState(false);

    const validateFile = (file: File) => {
        if (types && !checkType(file, types)) {
            // types included and type not in them
            setError(true);
            if (onTypeError) onTypeError(`File type ${file.type} is not supported`);
            return false;
        }
        if (maxSize && getFileSizeMB(file.size) > maxSize) {
            setError(true);
            if (onSizeError) onSizeError('File size is too big');
            return false;
        }
        if (minSize && getFileSizeMB(file.size) < minSize) {
            setError(true);
            if (onSizeError) onSizeError('File size is too small');
            return false;
        }
        return true;
    };

    const handleChanges = (files: File | Array<File>): boolean => {
        let checkError = false;
        console.log(`handle changes file: ${JSON.stringify(files)}`)
        if (files) {
            if (files instanceof File) {
                checkError = !validateFile(files);
            } else {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    // @ts-ignore
                    checkError = !validateFile(file) || checkError;
                }
            }
            if (checkError) return false;
            if (handleChange) handleChange(files);
            setFile(files);

            setUploaded(true);
            setError(false);
            return true;
        }
        return false;
    };

    const blockEvent = (ev: any) => {
        ev.preventDefault();
        ev.stopPropagation();
    };

    // const handleClick = (ev: any) => {
    //     ev.stopPropagation();
    //     // eslint-disable-next-line no-param-reassign
    //     if (inputRef && inputRef.current) {
    //         inputRef.current.value = '';
    //         inputRef.current.click();
    //     }
    // };

    const handleInputChange = (ev: any) => {
        const allFiles = Array.from<File>(ev.target.files);

        const files = multiple ? allFiles : allFiles[0];

        if (files !== undefined) {
            const success = handleChanges(files);
            if (onSelect && success) onSelect(files);
        }
    };

    const dragging = useDragging({
        labelRef,
        inputRef,
        multiple,
        handleChanges,
        onDrop
    });

    useEffect(() => {
        onDraggingStateChange?.(dragging);
    }, [dragging]);

    useEffect(() => {
        if (fileOrFiles) {
            setUploaded(true);
            setFile(fileOrFiles);
        } else {
            if (inputRef.current) inputRef.current.value = '';
            setUploaded(false);
            setFile(null);
        }
    }, [fileOrFiles]);


    // const onDrops = useCallback((acceptedFiles: File[]) => {
    //     // Do something with the files
    //     console.log("onDrop",JSON.stringify(acceptedFiles))
    //     console.log("onDrop type ",acceptedFiles[0]?.type)
    //     console.log("onDrop name ",acceptedFiles[0]?.name)
    // }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'video/x-matroska': ['.mkv'],
        },
        multiple: true,
        onDragEnter: () => {},
        onDragOver: () => {},
        onDragLeave: () => {},

    })



    return (
        <form className={"w-96"}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Upload Files</h3>
                <p className={"text-xs"}>Types: { types !== undefined ? listArrayWithCommasAnd(types): ""}</p>
            </div>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer">
                <div className="text-center space-y-2 overflow-hidden">
                    <label
                        ref={labelRef}
                        htmlFor={name}
                        onClick={blockEvent}
                    >
                        <div {...getRootProps()}>
                            {/* @ts-ignore*/}
                            <input {...getInputProps()} onChange={handleInputChange} />
                            {
                                isDragActive ?
                                    <p>Drop the files here ...</p> :
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                        </div>

                        {dragging && (

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>{hoverTitle || 'Drop Here'}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add to library</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {/*{!children && (*/}
                        {/*    <>*/}
                        {/*        /!*<ImageAdd />*!/*/}
                        {/*        <div className={clsx("flex justify-between items-center flex-grow", {*/}
                        {/*            "text-red-500": error,*/}
                        {/*            "text-darkGray": !error*/}
                        {/*        })}>*/}
                        {/*            {drawDescription(currFiles, uploaded, error, disabled, label)}*/}
                        {/*            <DrawTypes types={types} minSize={minSize} maxSize={maxSize}/>*/}
                        {/*        </div>*/}
                        {/*    </>*/}
                        {/*)}*/}
                        {children}
                    </label>
                </div>
            </div>
        </form>
    );
};

