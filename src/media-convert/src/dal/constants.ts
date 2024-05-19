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
    ContainerFormat
}


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
