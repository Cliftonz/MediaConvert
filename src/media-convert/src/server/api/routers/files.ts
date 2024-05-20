import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {s3} from "~/lib/s3";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {createProjectFile, getProjectFiles, updateProjectFileStatus} from "~/dal/files";
import {ContainerFormat, ContainerFormatZod, inputBucket} from "~/dal/constants";
import {startJobProcessing} from "~/dal/processing";

export const fileRouter = createTRPCRouter({
    createPreSignedUrl: publicProcedure
        .input(
            z.object({
                project: z.string(),
                fileName: z.string()
            })
        ).output(
            z.object({
                url: z.string(),
            })
        ).mutation(async ({ctx, input}) => {

            // create item in dydb with status acknowledged for each input
            await createProjectFile({
                project: input.project,
                fileName: input.fileName,
                bucket: inputBucket,
            })

            // create presigned urls
            const command = new PutObjectCommand({
                Bucket: inputBucket,
                Key: `${input.project}/${input.fileName}`,
            });

            const url = await getSignedUrl(s3, command, {
                expiresIn: 60 * 60, // TTL 1 hour
            })


            console.log("url",url)
            return {
                url
            }

        }),

        updateFileStatus: publicProcedure
        .input(
            z.object({
                project: z.string(),
                fileName: z.string(),
                status: z.string()
            })
        ).mutation(async ({ctx, input}) => {

            // create item in dydb with status acknowledged for each input
            await updateProjectFileStatus({
                project: input.project,
                fileName: input.fileName,
                processingStatus: input.status,
            })

        }),

        createProcessingJob: publicProcedure
        .input(
            z.object({
                project: z.string(),
                fileName: z.string(),
                format: ContainerFormatZod
            })
        ).mutation(async ({ctx, input}) => {

            // create item in dydb with status acknowledged for each input
            await startJobProcessing({
                project: input.project,
                fileName: input.fileName,
                format: input.format
            })

        }),

    getProjectFileStatus: publicProcedure
        .input(z.object({
            name: z.string()
        }))
        .output(z.array(z.object({
            projectName: z.string(),
            fileName: z.string(),
            processingStatus: z.string(),
            jobId: z.string(),
            lastUpdated: z.string(),
        })))
        .query(async ({ctx, input}) => {

            const retArr = await getProjectFiles(input.name)

            // console.log("file status' ", JSON.stringify(retArr))

            return retArr

        })
});
