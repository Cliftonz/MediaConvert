import {DynamoDBClient} from '@aws-sdk/client-dynamodb';

import {env} from '~/env';

const globalForDyDB = global as unknown as {
    dydb: DynamoDBClient | undefined;
};

export const dydb = globalForDyDB.dydb || createClient();

function createClient() {

    const config = {
        region: env.AWS_REGION,
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        endpoint: env.LOCALSTACK_URL ?? undefined,
    }

    return new DynamoDBClient();
}

if (process.env.NODE_ENV !== 'production') globalForDyDB.dydb = dydb;
