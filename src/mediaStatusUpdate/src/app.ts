import { type Handler, EventBridgeEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: Handler = async (event: MediaConvertChangeEvent, context) => {
  try {
    console.log(`Processing MediaConvert job state change: ${JSON.stringify(event)}`);

    const params = {
      TableName: 'MediaConvert-events', // replace with your actual DynamoDB table name
      Item: {
        jobId: event.detail.jobId,
        status: event.detail.status,
        timestamp: Date.now()
      }
    };

    const result = await dynamoDb.put(params).promise();
    console.log(`Successfully saved job state change to DynamoDB: ${JSON.stringify(result)}`);
    return { statusCode: 200 };

  } catch (e) {
    console.error(`Failed to save job state change to DynamoDB: ${e.message}`);
    return { statusCode: 500, body: e.message };
  }
};


interface MediaConvertChangeEvent {
  version: string;
  id: string;
  "detail-type": string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: {
    timestamp: number;
    accountId: string;
    queue: string;
    jobId: string;
    status: string;
    userMetadata: any;
    inputDetails?: InputDetail[];
    outputGroupDetails?: OutputGroupDetail[];
  };
}

interface InputDetail {
  id: number;
  uri: string;
  video: VideoDetail[];
  audio: AudioDetail[];
  data: null;
}

interface VideoDetail {
  streamId: number;
  width: number;
  height: number;
  frameRate: number;
  sar: string;
  bitDepth: number;
  interlaceMode: string;
  colorFormat: string;
  standard: string;
  fourCC: string;
}

interface AudioDetail {
  streamId: number;
  codec: string;
  channels: number;
  sampleRate: number;
  language: string;
}

interface OutputGroupDetail {
  outputDetails: OutputDetail[];
}

interface OutputDetail {
  durationInMs: number;
  videoDetails: {
    widthInPx: number;
    heightInPx: number;
  };
}