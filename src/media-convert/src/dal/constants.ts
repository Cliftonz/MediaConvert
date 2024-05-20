import {env} from "~/env";
import * as z from 'zod';
import {ZodEnum} from "zod";

const eventTable =  "MediaConvert-events"
const statusTable = "MediaConvert-status"
const inputBucket = env.INPUT_BUCKET
const outputBucket = env.OUTPUT_BUCKET

export {
    eventTable,
    statusTable,
    inputBucket,
    outputBucket,
    ContainerFormat,
    baseUrl
}

const jobTemplateNames = ["convert_to_mp4"]

const baseUrl = process.env.VERCEL_URL
    ? `https://mediaconvert.vercel.app`
    : 'http://localhost:4000';

enum ContainerFormat {
    MP4 = "MP4",
    MPEG2_TS = "MPEG2_TS",
    HLS = "HLS",
    DASH_ISO = "DASH_ISO",
    SMOOTH_STREAMING = "SMOOTH_STREAMING",
    CMAF = "CMAF",
    MXF = "MXF",
    QUICKTIME = "QUICKTIME",
    RAW = "RAW",
    WEBM = "WEBM"
}

// Explicitly type the tuple
type ContainerFormatTuple = [ContainerFormat, ...ContainerFormat[]];

const containerFormatValues = Object.values(ContainerFormat) as ContainerFormat[];

// Hack to convert array to tuple
const toTuple = <T extends ContainerFormat>(...args: T[]): ContainerFormatTuple => args as any;

export const ContainerFormatZod: ZodEnum<ContainerFormatTuple> = z.enum(toTuple(...containerFormatValues));
