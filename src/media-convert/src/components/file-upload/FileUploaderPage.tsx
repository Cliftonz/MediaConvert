"use client"
import React, {useState} from "react";
import {Separator} from "~/components/ui/separator";
import {PendingFiles} from "~/components/file-upload/PendingFiles";
import axios, {AxiosProgressEvent} from "axios";
import {api} from "~/trpc/react";
import {toast} from "sonner";
import FileUploader from "~/components/file-upload/FileUploader";
import {ContainerFormat} from "~/components/constants";
import {Button} from "~/components/ui/button";


export interface IFileUpload {
    name: string,
    size: number;
    file: File;
    uploadProgress: number,
    preSignedUrl?: string,
    rate?: number
    abortController?: AbortController
}

interface FileUploaderPageProps {
    project: string
}


export function FileUploaderPage(props: FileUploaderPageProps) {

    const createFileUrl = api.files.createPreSignedUrl.useMutation();
    const updateFile = api.files.updateFileStatus.useMutation();
    const createProccesingJob = api.files.createProcessingJob.useMutation();

    async function handleMultipleSubmit() {

        for (const file of files) {
            // create presign urls with batch mutation
            const preSignedUrl = await createFileUrl.mutateAsync({
                project: props.project,
                fileName: file.name
            })

            console.log("preSignedUrl, ", preSignedUrl)

            file.preSignedUrl = preSignedUrl.url;
        }

        // for each pending file
        for (const file of files) {

            const index = files.indexOf(file);

            file.abortController = new AbortController();

            const config = {
                signal: file.abortController.signal,
                onUploadProgress: function (progressEvent: AxiosProgressEvent) {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total );

                        if (file.uploadProgress !== progress) {
                            file.uploadProgress = progress;
                        }

                        setFiles(files => files.map(f => {  // <-- use map to contruct new array
                            if (f.name === file.name) {  // for the file that has completed uploading
                                return {
                                    ...f,  // copy existing file info
                                    uploadProgress: progress,  // set new uploadProgress value
                                    rate: progressEvent.rate  // set new rate value
                                };
                            } else {
                                return f;  // for other files, return unchanged
                            }
                        }));
                        console.log(`upload for ${file.name} is ${progress}%`);
                    }

                    file.rate = progressEvent.rate ?? 0;
                },
                headers: {
                    'Content-Type': file.file.type
                }
            };

            if (file?.preSignedUrl != null) {
                const resp = await axios.put(file.preSignedUrl, file.file, config);

                console.log(`upload complete: ${resp.status}`);

                updateFile.mutate({
                    project: props.project,
                    fileName: file.name,
                    status: "Uploaded"
                })

                setFiles(files => files.filter(pendingFile => pendingFile.name !== file.name));

                createProccesingJob.mutate({
                    project: props.project,
                    fileName: file.name,
                    format: ContainerFormat.MP4
                })

                updateFile.mutate({
                    project: props.project,
                    fileName: file.name,
                    status: "Converting"
                })
            }
        }
    }

    const fileTypes = ["MKV"];
    const [files, setFiles] = useState<IFileUpload[]>([]);

    console.log(`files: ${files}`)

    const handleChange = (file: File | File[]) => {

        console.log("handleChange", file);

        let fileValues: IFileUpload[] = [...files];

        const handleFile = (_file: File) => { // Check if the file already exists in the files variable
            if (fileValues.some(f => f.name === _file.name)) { // Add a toast that says this file already exists
                toast(`File ${_file.name} already exists`);
                return;
            }
            fileValues.push({name: _file.name, size: _file.size, uploadProgress: -1, file: _file});
        } // Check if file is an instance of File or an array of File instances

        if (file instanceof File) {
            handleFile(file);
        } else if (Array.isArray(file) && file.every((f) => f instanceof File)) {
            file.forEach(handleFile);
        } else {
            console.error(`Invalid file value: ${file}`); // handle invalid file value
        }
        console.debug(`Adding:`, fileValues.map(file => ({name: file.name, size: file.size, file: file})));

        setFiles(fileValues);
    };

    return (
        <div>
            <div className="flex flex-col  bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
                    <FileUploader
                        multiple={true}
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes}
                        maxSize={10000}
                        minSize={0}
                        truncateName={true}

                        onTypeError={(err: string) => {
                            console.log(`File Type Error: ${err}`);
                            toast("File Type Error", {
                                description: err + `. Supported Types: ${fileTypes}`,
                            })
                        }}

                        onSizeError={(err: string) => {
                            console.log(`Size error: ${err}`);
                            toast("Type Error", {
                                description: err,
                            })
                        }}


                        onDrop={(file: File | File[]) => {
                            console.log(`on Drop ${JSON.stringify(file)}`);
                            if (Array.isArray(file)) {
                                // If `file` is an array, show the number of files
                                toast(`Files Dropped for Upload`, {
                                    description: `${file.length} files have been dropped`,
                                });
                            } else {
                                // If `file` is a single file, display its name
                                toast("File Dropped for Upload", {
                                    description: `File ${file.name} has been dropped`,
                                });
                            }
                        }}

                        onSelect={(file: File | File[]) => {
                            console.log(`on Select ${JSON.stringify(file)}`);
                            if (Array.isArray(file)) {
                                // If `file` is an array, show the number of files
                                toast(`Files Selected for Upload`, {
                                    description: `${file.length} files have been selected`,
                                });
                            } else {
                                // If `file` is a single file, display its name
                                toast("File Selected for Upload", {
                                    description: `File ${file.name} has been selected`,
                                });
                            }
                        }}
                    />
                </div>
                <Separator orientation="horizontal" className={"my-4"}/>
                <PendingFiles
                    files={files}
                    truncateName={true}
                    onClear={() => {
                        setFiles([])
                    }}
                    onRemove={(name) => {
                        const file = files.find(file => file.name !== name);
                        if (file !== undefined) {
                            file.abortController?.abort("Canceled by user")
                        }
                        setFiles(files => files.filter(file => file.name !== name));
                    }}
                    onSubmit={handleMultipleSubmit}
                />
            </div>
        </div>
    )
}


