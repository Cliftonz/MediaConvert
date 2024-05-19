import {S3Client} from "@aws-sdk/client-s3";

import {env} from '~/env';

const globalForS3 = global as unknown as {
    s3: S3Client | undefined;
};

export const s3 = globalForS3.s3 || createClient();

function createClient() {
    return new S3Client({
        region: env.AWS_REGION,
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        endpoint: env.LOCALSTACK_URL ?? undefined,
    });
}

if (process.env.NODE_ENV !== 'production') globalForS3.s3 = s3;

s3
