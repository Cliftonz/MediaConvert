
import { AppHeader } from "~/components/AppHeader"
import {AppFooter} from "~/components/AppFooter";
import Stats from "~/app/app/projects/stats";
import ProjectStatus from "~/app/app/projects/projectStatus";

export default function Component() {

    return (
        <div className="flex w-full flex-col">
            <AppHeader
                breadcrumbs={[
                    {
                        name: 'Projects'
                    }
                ]}
            />
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
                <div className="max-w-6xl w-full mx-auto grid gap-6">
                    <Stats/>
                    <ProjectStatus/>
                </div>
            </main>
            <AppFooter/>
        </div>
    )
}

