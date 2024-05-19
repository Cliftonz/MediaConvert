import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {createProject, deleteProject, getAllProjectsStatus} from "~/dal/projects";
import {getStats} from "~/dal/stats";

export const projectRouter = createTRPCRouter({

    getStats: publicProcedure.output(
        z.object({
            totalProjects: z.number(),
            completedConversions: z.number(),
            inProgress: z.number(),
            archived: z.number(),
        })
    ).query(async ({ ctx }) => {
        const stats = await getStats();

        return  {
            totalProjects: stats?.totalProjects ?? 0,
            completedConversions: stats?.completedConversions ?? 0,
            inProgress: stats?.inProgress ?? 0,
            archived: stats?.archived ?? 0,
        }
    }),

    getAllProjects: publicProcedure.output(
        z.array(
            z.object({
                projectName: z.string(),
                status: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
            })
        )
    ).query(async ({ ctx }) => {
        const data = await getAllProjectsStatus();

        const returnValue = data.map((item) => ({
            projectName: item.projectName,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }))


        return returnValue

    }),

    createProject: publicProcedure
    .input(z.object({
        name: z.string()
    }))
   .mutation(async ({ ctx, input }) => {

       // FIXME should validate on backend that project also does not exist

       await createProject({
           projectName: input.name
       })

    }),

    deleteProject: publicProcedure
        .input(z.object({
            projectName: z.string()
        }))
        .mutation(async ({ ctx, input }) => {

            // FIXME should validate on backend that project also does not exist

            await deleteProject({
                projectName: input.projectName
            })

        })

});
