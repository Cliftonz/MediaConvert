"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {format} from "@formkit/tempo"
import {ChevronDown, CirclePlus, MoreHorizontal, MoveRight} from "lucide-react"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "~/components/ui/form"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"

import {Button} from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {Input} from "~/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "~/components/ui/table"
import {Card} from "~/components/ui/card";
import {getAllProjectsStatusReturn} from "~/dal/projects";
import {api} from "~/trpc/react";
import {Skeleton} from "~/components/ui/skeleton";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {toast} from "sonner"
import {LoadingButton} from "~/components/ui/loading-button";

export default function ProjectStatus() {

    const router = useRouter();

    let {error, isLoading, data, refetch} = api.projects.getAllProjects.useQuery();

    const createProject = api.projects.createProject.useMutation()
    const deleteProject = api.projects.deleteProject.useMutation()

    const [openNewProjectDialog, setOpenNewProjectDialog] = React.useState(false);
    const [openDeleteProjectDialog, setDeleteNewProjectDialog] = React.useState(false);

    const [loading, setLoading] = React.useState(false);

    const formSchema = z.object({
        name: z.string()
            .min(2)
            .max(128)
            .refine(value => /^[a-zA-Z0-9-_]*$/
                .test(value), {
                message: 'Only alphanumeric characters -, and _ are allowed.',
            })
            .refine(value => {
                    return !data?.map((value) => {
                        return value.projectName
                    }).includes(value)
                },
                {
                    message: 'Project Already Exists',
                })
        ,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Video",
        },
    })

    const delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        createProject.mutate({
            name: values.name
        })

        setOpenNewProjectDialog(false);

        delay(500).then(r => {
            refetch().then(r => {
                console.log("refetching ", r)
            })
        })

        setLoading(false);

        router.push(`/app/projects/${values.name}`)
    }

    const columns: ColumnDef<getAllProjectsStatusReturn>[] = [
        {
            header: "Project",
            accessorKey: "projectName",
            enableSorting: true,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => (
                <div className="capitalize">{row.getValue("status")}</div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({row}) => (
                <div className="capitalize">{format(row.getValue<Date>("createdAt"), "YYYY-MM-DD HH:mm:ss")}</div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({row}) => (
                <div className="capitalize">{format(row.getValue<Date>("updatedAt"), "YYYY-MM-DD HH:mm:ss")}</div>
            ),
        },
        {
            header: "Actions",
            enableHiding: false,
            enableSorting: false,
            cell: ({row}) => {
                const project = row.original

                return (
                    <>
                        <Dialog open={openDeleteProjectDialog}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild={true}>
                                    <Button variant="ghost" className="p-0">
                                        <MoreHorizontal className="h-4 w-12"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(project.projectName)}
                                    >
                                        Copy Name
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>Resend Email</DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem className="text-red-500 hover:text-red-700" onClick={() => {
                                            setDeleteNewProjectDialog(true)
                                        }}>Delete</DropdownMenuItem>
                                    </DialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant={"ghost"} onClick={() => {
                                router.push(`/app/projects/${project.projectName}`)
                            }}>
                                <MoveRight/>
                            </Button>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. Are you sure you want to permanently
                                        delete this file from our servers?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button onClick={() => {
                                        deleteProject.mutate({
                                            projectName: project.projectName
                                        })

                                        toast("Project has been deleted", {
                                            description: (new Date()).toDateString(),
                                        })

                                        console.log("removing")
                                        // data = data.filter(project => project.projectName !== project.projectName);
                                        refetch().then(r => {
                                            console.log("refetching ", r)
                                        })
                                        setDeleteNewProjectDialog(false)
                                    }}>Confirm</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )
            },
        },
    ]


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: (data ?? []),
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (<>{
            isLoading ? <><Skeleton className="h-[30rem] w-full rounded-xl"/></> :
                <><Card className="w-full h-full p-5">
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter projects..."
                            value={(table.getColumn("projectName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("projectName")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={openNewProjectDialog}>
                            <DialogTrigger asChild>
                                <Button variant={"default"} className={"ml-5"}
                                        onClick={() => setOpenNewProjectDialog(true)}>
                                    <CirclePlus className={"mr-2"}/>
                                    New Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]" showClose={false}>
                                <DialogHeader>
                                    <DialogTitle>Create Project</DialogTitle>
                                    <DialogDescription>
                                        Create New Project for your Conversions.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={
                                        form.handleSubmit(onSubmit)

                                    } className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="shadcn" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your projects unique id and name name.
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary" className={"mx-auto"}
                                                        onClick={() => {
                                                            setOpenNewProjectDialog(false)
                                                            toast("Project has been created", {
                                                                description: (new Date()).toDateString(),
                                                            })
                                                        }}>
                                                    Close
                                                </Button>
                                            </DialogClose>
                                            <LoadingButton type="submit" className={"ml-auto"}
                                                           loading={loading}>Create</LoadingButton>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>


                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length + 1} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card>
                </>
        }</>

    )

}
