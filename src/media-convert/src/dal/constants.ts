import {env} from "~/env";
import * as z from 'zod';
import {ZodEnum} from "zod";
import {ContainerFormat} from "~/components/constants";

const eventTable =  "MediaConvert-events"
const statusTable = "MediaConvert-status"
const inputBucket = env.INPUT_BUCKET
const outputBucket = env.OUTPUT_BUCKET

export {
    eventTable,
    statusTable,
    inputBucket,
    outputBucket,
    baseUrl,
    containerFormatValues
}

const jobTemplateNames = ["convert_to_mp4"]

const baseUrl = process.env.VERCEL_URL
    ? `https://mediaconvert.vercel.app`
    : 'http://localhost:4000';



// Explicitly type the tuple
type ContainerFormatTuple = [ContainerFormat, ...ContainerFormat[]];

const containerFormatValues = Object.values(ContainerFormat) as ContainerFormat[];

// Hack to convert array to tuple
const toTuple = <T extends ContainerFormat>(...args: T[]): ContainerFormatTuple => args as any;

const ContainerFormatZod: ZodEnum<ContainerFormatTuple> = z.enum(toTuple(...containerFormatValues));
