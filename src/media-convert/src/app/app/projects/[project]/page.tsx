"use client"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table"
import {AppHeader} from "~/components/AppHeader";
import {AppFooter} from "~/components/AppFooter";
import {RxCross2} from "react-icons/rx";
import {FaCheck} from "react-icons/fa6";
import {JSX, SVGProps} from "react";
import {useRouter} from "next/navigation";
import {FileUploaderPage} from "~/components/file-upload/FileUploaderPage";
import ConversionStatus from "~/app/app/projects/[project]/ConversionStatus";


export default function Project({ params }: { params: { project: string } }) {

    const router = useRouter();
    console.log("params ", params)

    return (
        <div key="1" className="flex flex-col h-screen">

            <AppHeader
                breadcrumbs={[
                    {
                        name: 'Projects',
                        href: '/app/projects'
                    },
                    {
                        name: params.project
                    }
                ]}
            />

            <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className={"flex flex-row h-[80%]"}>
                        <FileUploaderPage project={params.project} />
                        <ConversionStatus project={params.project} />
                    </div>
                </div>
            </main>
            <AppFooter/>
        </div>
    )
}



