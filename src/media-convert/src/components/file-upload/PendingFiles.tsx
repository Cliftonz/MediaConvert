"use client"

import {Button} from "~/components/ui/button";
import {FileIcon, TrashIcon, Upload, XIcon} from "lucide-react";
import {ScrollArea} from "~/components/ui/scroll-area";
import React from "react";
import {IFileUpload} from "~/components/file-upload/FileUploaderPage";
import {convertFileSize, truncateFileFunc} from "~/components/file-upload/utils";
import {Progress} from "~/components/ui/progress";

interface PendingFilesProps {
    onClear: () => void,
    onRemove: (name: string) => void,
    onSubmit: () => void,
    files: IFileUpload[],
    truncateName?: boolean | false,
    truncateLength?: number
}

export function PendingFiles(props: PendingFilesProps) {

    console.log("pending files files: ", props.files)
    return (
        <div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pending Files</h3>
                    <Button size="sm" variant="outline" onClick={props.onClear}>
                        <TrashIcon className="h-4 w-4"/>
                        Clear All
                    </Button>
                    <Button size="sm" variant="default" onClick={props.onSubmit}>
                        <Upload className="h-4 w-4"/>
                        Submit
                    </Button>
                </div>
                <ScrollArea className="h-60 rounded-md border">
                    <div className="flex flex-col gap-2">
                        {
                            props.files.length === 0 ?
                                <p className={"text-bold text-grey-500 flex items-center justify-center mt-24"}>No
                                    pending files</p> :
                                props.files.map((val) => {
                                    return (
                                        <div key={val.name}
                                             className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg p-3 m-2">
                                            <div className="flex items-center gap-3">
                                                <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400"/>
                                                <div className="overflow-hidden">
                                                    <p className="font-medium truncate">{props.truncateName ? truncateFileFunc(val.name, props.truncateLength ?? 10) : val.name}</p>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{convertFileSize(val.size)}</p>
                                                        {val.uploadProgress > 0 ? <Progress value={val.uploadProgress} />: <></>}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => {
                                                props.onRemove(val.name)
                                            }}>
                                                <XIcon className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </ScrollArea>
            </div>
        </div>

    )

}
