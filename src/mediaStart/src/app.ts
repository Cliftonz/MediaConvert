import { S3 } from 'aws-sdk';

const s3 = new S3();

interface EventInput {
  files: string[];
}

exports.handler = async (event: EventInput) => {
  const Bucket = 'novu-mc-input';

  for (const file of event.files) {
    const copySource = encodeURIComponent(Bucket + '/' + file);

    try {
      await s3.copyObject({
        Bucket,
        CopySource: copySource,
        Key: `processing/${file}`,
      }).promise();
    } catch (e) {
      console.error(`Failed to copy ${file}: `, e);
    }
  }

  console.log(`Copied all ${event.files.length} files to processing/`);
};