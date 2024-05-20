import {env} from "~/env";

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
