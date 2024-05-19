import {Table, TableBody, TableHead, TableHeader, TableRow} from "~/components/ui/table";
import {Info} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "~/components/ui/tooltip";
import {api} from "~/trpc/react";
import {TableRowFunc} from "~/app/app/projects/[project]/TableStatus";

interface ConversionStatusProps {
    project: string
}

export default function ConversionStatus(props: ConversionStatusProps) {

    console.log("props ", props.project)

    let {
        error,
        isLoading,
        data,
    } = api.files.getProjectFileStatus.useQuery({name: props.project}, {
        refetchInterval: 3000,
        refetchOnWindowFocus: true,
    })

    console.log("data ", data)

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 ml-6 w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Conversion Status</h2>
                <TooltipProvider delayDuration={250}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info/>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>You will be emailed all of the links in this project when completed.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data ? data.map((row) => (
                            TableRowFunc({
                                filename: row.fileName,
                                project: row.projectName,
                                date: row.lastUpdated,
                                status: row.processingStatus
                            })
                        )) : null}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}


