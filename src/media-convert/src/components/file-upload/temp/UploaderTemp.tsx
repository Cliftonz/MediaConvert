import {Button} from "~/components/ui/button";
import {CloudUploadIcon, PlusIcon} from "lucide-react";
import React from "react";


export default function Uploader() {
    return (

    <form>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Upload Files</h3>
            <Button size="sm" variant="outline">
                <PlusIcon className="h-4 w-4"/>
                Add Files
            </Button>
        </div>
        <div
            className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer">
            <div className="text-center space-y-2">
                <CloudUploadIcon
                    className="h-8 w-8 mx-auto text-gray-500 dark:text-gray-400"/>
                <input type={"file"}
                       className="text-gray-500 dark:text-gray-400"/>
                <p>Drag and drop files here or click to upload</p>
            </div>
        </div>
    </form>

)
}
