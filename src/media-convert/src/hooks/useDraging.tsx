import { useState, useEffect, useCallback, RefObject } from 'react';

let draggingCount = 0;

type Params = {
    labelRef: RefObject<HTMLElement>;
    inputRef: RefObject<HTMLInputElement>;
    multiple?: boolean;
    handleChanges: (arg0: File[] | File) => boolean;
    onDrop?: (arg0: File[] | File) => void;
};

export default function useDragging({
                                        labelRef,
                                        inputRef,
                                        multiple = false,
                                        handleChanges,
                                        onDrop
                                    }: Params): boolean {
    const [dragging, setDragging] = useState(false);
    const handleClick = useCallback((event: MouseEvent) => {
        inputRef.current?.click();
    }, [inputRef]);

    const handleDragIn = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        draggingCount++;
        if (event?.dataTransfer?.items && event?.dataTransfer?.items.length > 0) {
            setDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        draggingCount--;
        if (draggingCount > 0) return;
        setDragging(false);
    }, []);

    const handleDrag = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
            setDragging(false);
            draggingCount = 0;

            const eventFiles = event?.dataTransfer?.files;
            if (eventFiles && eventFiles.length > 0) {
                const files = multiple ? Array.from(eventFiles) : eventFiles.item(0);
                if (files) {
                    const success = handleChanges(files);
                    if (onDrop && success) onDrop(files);
                }
            }
        },
        [handleChanges, onDrop, multiple]
    );

    useEffect(() => {
        const ele = labelRef.current;
        if (ele) {
            ele.addEventListener('click', handleClick);
            ele.addEventListener('dragenter', handleDragIn);
            ele.addEventListener('dragleave', handleDragOut);
            ele.addEventListener('dragover', handleDrag);
            ele.addEventListener('drop', handleDrop);
            return () => {
                ele.removeEventListener('click', handleClick);
                ele.removeEventListener('dragenter', handleDragIn);
                ele.removeEventListener('dragleave', handleDragOut);
                ele.removeEventListener('dragover', handleDrag);
                ele.removeEventListener('drop', handleDrop);
            };
        }
    }, [
        handleClick,
        handleDragIn,
        handleDragOut,
        handleDrag,
        handleDrop,
        labelRef
    ]);

    return dragging;
}
