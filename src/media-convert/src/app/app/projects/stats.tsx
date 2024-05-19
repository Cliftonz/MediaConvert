"use client"
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {CircleAlertIcon, CircleCheckIcon, ClockIcon, LayoutGridIcon} from "lucide-react";
import {api} from "~/trpc/react";
import {Skeleton} from "~/components/ui/skeleton";

export default function Stats() {

    const {error, isLoading, data} = api.projects.getStats.useQuery();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ?<>
                <Skeleton className="h-[110px] rounded-xl"/>
                <Skeleton className="h-[110px] rounded-xl"/>
                <Skeleton className="h-[110px] rounded-xl"/>
                <Skeleton className="h-[110px] rounded-xl"/>
            </>:<>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <LayoutGridIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalProjects}</div>
                    </CardContent>
                </Card><Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Completed Conversions</CardTitle>
                    <CircleCheckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.completedConversions}</div>
                </CardContent>
            </Card><Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.inProgress}</div>
                </CardContent>
            </Card><Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Archived</CardTitle>
                    <CircleAlertIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.archived}</div>
                </CardContent>
            </Card>
            </>}
        </div>
    )
}
