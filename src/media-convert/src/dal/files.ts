import {
    DeleteItemCommand, GetItemCommand,
    PutItemCommand,
    QueryCommand,
    ScanCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import {dydb} from "~/lib/dydb";
import {statusTable} from "~/dal/constants";
import {mediaConvert} from "~/lib/mediaConvert";
import {CreateJobCommand} from "@aws-sdk/client-mediaconvert";

interface createProjectFileParam {
    project: string
    fileName: string
    bucket: string
}

export async function createProjectFile(props: createProjectFileParam): Promise<void> {
    const createCommand = new PutItemCommand({
        TableName: statusTable,
        Item: {
            "project": { S: props.project },
            "fileName": { S: props.fileName },
            "processingStatus": { S: "Initialized" },
            "jobId": {S: "N/A"},
            "lastUpdated": {S: (new Date()).toISOString()}
        }
    });

    // Execute the query
    const data = await dydb.send(createCommand)
}

interface ICreateProjectFileParam {
    project: string;
    fileName: string;
    processingStatus: string;
}

export async function updateProjectFileStatus(props: ICreateProjectFileParam): Promise<void> {
    const updateItemCommand = new UpdateItemCommand({
        TableName: statusTable,
        Key: {
            "project": { S: props.project },
            "fileName": { S: props.fileName },
        },
        ExpressionAttributeNames: {
            "#PS": "processingStatus",
            "#LU": "lastUpdated",
        },
        ExpressionAttributeValues: {
            ":ps": { S: props.processingStatus },
            ":lu": { S: (new Date()).toISOString() },
        },
        UpdateExpression: "SET #PS = :ps, #LU = :lu",
    });

    // Execute the update command
    const data = await dydb.send(updateItemCommand);
}

interface getProjectFilesReturn {
    projectName: string
    fileName: string
    bucket: string
    processingStatus: string
    jobId: string,
    lastUpdated: string,
}

export async function getProjectFiles(project: string): Promise<getProjectFilesReturn[]> {

    // Create the command
    const command = new QueryCommand({
        TableName: "MediaConvert-status",
        KeyConditionExpression: "#d1330 = :d1330",
        ExpressionAttributeNames: {"#d1330":"project"},
        ExpressionAttributeValues: {":d1330": { "S": project }}
    });

    // Get the query results
    const response = await dydb.send(command);

    // console.log("response", JSON.stringify(response, null, 2));

    // Process and return items
    if (response.Items) {
        return response.Items.map(item => {
            return item.project && item.project.S
                ? { projectName: item.project.S,
                    fileName: item.fileName?.S,
                    bucket: item.bucket?.S,
                    processingStatus: item.processingStatus?.S,
                    jobId: item.jobId?.S,
                    lastUpdated: item.lastUpdated?.S,
                }
                : undefined;
        })
            .filter((item): item is getProjectFilesReturn => item !== undefined && item.fileName !== "status");
    } else {
        return [];
    }
}


interface IStartJobProcessingParam {
    project: string;
    fileName: string;

}

export async function startJobProcessing(props: IStartJobProcessingParam): Promise<void> {

    const jobParams = {
        Role: "arn:aws:iam::111122223333:role/MediaConvert_Default_Role", // replace with your IAM Role
        JobTemplate: "JobTemplateName", // replace with your job template name
        Queue: "arn:aws:mediaconvert:us-west-2:111122223333:queues/ExampleQueue", // replace with your queue ARN
        Settings: {
            Inputs: [
                {
                    FileInput: "s3://BUCKET_NAME/FILE_NAME", // Replace with your S3 bucket and file name
                    // Adjust input settings according to your needs
                },
            ],
            Outputs: [
                {
                    ContainerSettings: {
                        Container: "MP4", // replace with desired format like "M3U8", "MP4", "MOV", "TS", etc.
                    },
                },
            ],
        },
    };

    const command = new CreateJobCommand(jobParams);

    try {
        const response = await mediaConvert.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    }


}

