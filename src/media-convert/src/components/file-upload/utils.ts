/**
 * Converting the file size to MB
 * @param size : Size to be converted;
 * @returns number
 *
 * @internal
 */
export const getFileSizeMB = (size: number): number => {
    return size / 1000 / 1000;
};

/**
 * Converting the file size to GB
 * @param size : Size to be converted;
 * @returns number
 *
 * @internal
 */
export const getFileSizeGB = (size: number): number => {
    return size / 1000 / 1000 / 1000;
};

/**
 * Converting file size to GB if it's greater than 0.8 GB, otherwise to MB.
 * @param size : Size to be converted;
 * @returns string
 *
 * @internal
 */
export const convertFileSize = (size: number): string => {
    const sizeGB = getFileSizeGB(size);
    if (sizeGB > 0.8) {
        return `${sizeGB.toFixed(2)} GB`;
    } else {
        const sizeMB = getFileSizeMB(size);
        return `${sizeMB.toFixed(2)} MB`;
    }
};

/**
 *
 * Check if the file uploaded is in the type list or not
 * @param file - The File uploaded
 * @param types - Available types
 * @returns boolean
 *
 * @internal
 */
export const checkType = (file: File, types: Array<string>): boolean => {
    const extension: string = file.name.split('.').pop() as string;
    const loweredTypes = types.map((type) => type.toLowerCase());
    return loweredTypes.includes(extension.toLowerCase());
};

/**
 * Get the files for input "accept" attribute
 * @param types - Allowed types
 * @returns string
 *
 * @internal
 */
export const acceptedExt = (types: Array<string> | undefined) => {
    if (types === undefined) return '';
    return types.map((type) => `.${type.toLowerCase()}`).join(',');
};

/**
 * Takes an array and formats it into a human-readable string
 * where items are separated by commas and the final item is prefixed by "and".
 *
 * @param {string[]} array - The array to be formatted.
 * @returns {string} - A string with array items separated by commas and 'and' before the last item.
 * @example
 * listArrayWithCommasAnd(['React', 'AWS-SDK', 'Axios', 'React-DOM', 'TypeScript']);
 * // Returns "React, AWS-SDK, Axios, React-DOM and TypeScript"
 */
export function listArrayWithCommasAnd(array: string[]) {
    if (array.length === 1) {
        return array[0];
    } else {
        let last = array[array.length - 1];
        return array.join(', ') + ' and ' + last;
    }
}

/** * Function to truncate a long name * If the name is longer than 10 characters, * it will cut it off at the 7th character and append '...' to it * If the name is 10 characters or less, it returns the original name * * @param name - Name string that might be needed to be truncated * @returns - Truncated name or the original name */ function truncateName(name: string) {
    if (name.length > 10) {
        return name.substring(0, 7) + "...";
    } else {
        return name;
    }
}

/** * File input form control with Tooltip * * @param handleClick - Function executed when the input is clicked * @param handleInputChange - Function executed when the input value changes * @param acceptedExt - Function executed to get accepted extensions for file input * @param types - Types of accepted files for the file input * @param inputRef - Ref for the file input * @param name - Name of the file input field * @param disabled - Boolean indicating whether the input is disabled or not * @param multiple - Boolean indicating whether multiple files selection is allowed or not * @param required - Boolean indicating whether the input field is required or not * @returns File input form control JSX element */
export function truncateFileFunc(name: string | undefined, length: number) {
    if (name === undefined || length === 0) return '';

    const dotIndex = name.lastIndexOf(".");
    const nameWithoutExt = name.substring(0, dotIndex);
    const extension = name.substring(dotIndex);

    if (nameWithoutExt.length > length * 2) {
        const beginning = nameWithoutExt.substring(0, length);
        const end = nameWithoutExt.substring(nameWithoutExt.length - length, nameWithoutExt.length);
        return beginning + "..." + end + extension;
    } else {
        return name;
    }
}
