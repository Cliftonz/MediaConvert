import Link from "next/link";
import {FaFileUpload} from "react-icons/fa";
import {Button} from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Image from 'next/image'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import React from "react";
import {UserButton} from "@clerk/nextjs";

export interface breadcrumb {
    name: string;
    href?: string;
}

export interface IPrimaryLayout {
    breadcrumbs: breadcrumb[];
}

export function AppHeader(props : IPrimaryLayout) {
    return (
        <header className="flex h-20 items-center border-b bg-gray-100 px-6 dark:border-gray-800 dark:bg-gray-950">
            <Link className="flex items-center gap-2 font-semibold" href="#">
                <FaFileUpload className="h-6 w-6"/>
                <span>Media Converter</span>
            </Link>
            <Breadcrumb className={"ml-20"}>
                <BreadcrumbList>
                    {props.breadcrumbs &&
                        props.breadcrumbs.map((value, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={value.href && index !== props.breadcrumbs.length - 1 ? value.href : undefined}>{value.name}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {index !== props.breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                </BreadcrumbList>
            </Breadcrumb>
            <nav className="ml-auto flex items-center gap-4">
                <UserButton />
            </nav>
        </header>
    )
}
