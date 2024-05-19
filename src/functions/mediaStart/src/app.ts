import * as AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';

// Set up AWS MediaConvert with your specific endpoint
const mediaConvert = new AWS.MediaConvert({ endpoint: "https://vasjpylpa.mediaconvert.us-east-1.amazonaws.com" });

exports.handler = async (event: S3Event) => {
  try {
    for (const record of event.Records) {
      const inputBucketName = record.s3.bucket.name;
      const inputFileKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      // Define the input path based on the input bucket and object key
      const inputPath = `s3://${inputBucketName}/${inputFileKey}`;

      // Define the output path in a different output bucket
      const outputPath = `s3://your-output-bucket-name/converted/${inputFileKey}`;

      // Creating a MediaConvert job
      const jobSettings = {
        Role: "arn:aws:iam::354725113120:role/service-role/MediaConvert_Default_Role",
        JobTemplate: "arn:aws:mediaconvert:us-east-1:354725113120:jobTemplates/Convert to mp4",
        Settings: {
          Inputs: [{ FileInput: inputPath }],
          OutputGroups: [{
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: outputPath
              }
            },
            Outputs: [/* Specify output settings or codec settings here if needed */]
          }]
        }
      };

      // Calling MediaConvert to create a job
      const createJobResponse = await mediaConvert.createJob(jobSettings).promise();
      console.log('MediaConvert Job created:', createJobResponse.Job.Id);
    }
  } catch (error) {
    console.error('Error processing S3 event:', error);
    throw error;
  }
};
