import { MediaConvertClient } from "@aws-sdk/client-mediaconvert";

import {env} from '~/env';

const globalForMediaConvert = global as unknown as {
    mediaConvert: MediaConvertClient | undefined;
};

export const mediaConvert = globalForMediaConvert.mediaConvert || createClient();

function createClient() {
    return new MediaConvertClient({
        region: env.AWS_REGION,
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY
        },
        endpoint: env.MEDIACONVERT_URL,
    });
}

if (process.env.NODE_ENV !== 'production') globalForMediaConvert.mediaConvert = mediaConvert;
