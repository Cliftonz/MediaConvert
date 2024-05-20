import {
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import {dydb} from "~/lib/dydb";
import { statusTable} from "~/dal/constants";

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



