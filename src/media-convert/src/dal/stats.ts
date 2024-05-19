import {statusTable} from "~/dal/constants";
import {AttributeValue, QueryCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {dydb} from "~/lib/dydb";

interface getStatsReturn {
    totalProjects: number,
    completedConversions: number,
    inProgress: number,
    archived: number
}

export async function getStats(): Promise<getStatsReturn | null> {
    // Define the query parameters
    const params = {
        TableName: statusTable,
        KeyConditionExpression: "#d1330 = :d1330 And #d1331 = :d1331",
        ExpressionAttributeNames: { "#d1330": "project", "#d1331": "fileName" },
        ExpressionAttributeValues: {
            ":d1330": { S: "list" },
            ":d1331": { S: "status" }
        }
    };

    // Create QueryCommand instance
    const command = new QueryCommand(params);

    // Execute the query
    const data = await dydb.send(command)

    const item = data.Items?.[0];
    if (item) {
        return {
            totalProjects: item.totalProjects?.N ? parseInt(item.totalProjects.N, 10) : 0,
            completedConversions: item.completedConversions?.N ? parseInt(item.completedConversions.N, 10) : 0,
            inProgress: item.inProgress?.N ? parseInt(item.inProgress.N, 10) : 0,
            archived: item.archived?.N ? parseInt(item.archived.N, 10) : 0
        };

    }

    // return null if no items were found
    return null;
}


// Update stats
interface ModifyStatsInput {
    totalProjects: number,
    completedConversions: number,
    inProgress: number,
    archived: number
}

export async function modifyStats(input: ModifyStatsInput) {
    const params = {
        TableName: statusTable,
        Key: {
            "project": { S: "list" },
            "fileName": { S: "status" }
        },
        ExpressionAttributeValues: {
            ":tp": { N: input.totalProjects.toString() },
            ":cc": { N: input.completedConversions.toString() },
            ":ip": { N: input.inProgress.toString() },
            ":a": { N: input.archived.toString() }
        },
        UpdateExpression: "SET totalProjects = totalProjects + :tp, completedConversions = completedConversions + :cc, inProgress = inProgress + :ip, archived = archived + :a"
    };

    const command = new UpdateItemCommand(params);

    try {
        const updateResult = await dydb.send(command);
        console.log(updateResult);
        return updateResult.Attributes || {};
    } catch (err) {
        console.log('Error', err);
    }
}

interface getAppStatReturn {
    totalProjects: number,
    totalFiles: number,
    totalHours: number
}

export async function getLPStats(): Promise<getAppStatReturn | null> {
    // Define the query parameters
    const params = {
        TableName: statusTable,
        KeyConditionExpression: "#d1330 = :d1330 And #d1331 = :d1331",
        ExpressionAttributeNames: { "#d1330": "project", "#d1331": "fileName" },
        ExpressionAttributeValues: {
            ":d1330": { S: "app" },
            ":d1331": { S: "status" }
        }
    };

    // Create QueryCommand instance
    const command = new QueryCommand(params);

    // Execute the query
    const data = await dydb.send(command)

    const item = data.Items?.[0];
    if (item) {
        return {
            totalProjects: item.totalProjects?.N ? parseInt(item.totalProjects.N, 10) : 0,
            totalFiles: item.totalFiles?.N ? parseInt(item.totalFiles.N, 10) : 0,
            totalHours: item.totalHours?.N ? parseInt(item.totalHours.N, 10) : 0,
        };

    }

    // return null if no items were found
    return null;
}


// Update stats
interface ModifyAppStatsInput {
    totalProjects: number,
    totalFiles: number,
    totalHours: number
}

export async function modifyLPStats(input: ModifyAppStatsInput) {
    const params = {
        TableName: statusTable,
        Key: {
            "project": { S: "app" },
            "fileName": { S: "status" }
        },
        ExpressionAttributeValues: {
            ":tp": { N: input.totalProjects.toString() },
            ":tf": { N: input.totalFiles.toString() },
            ":th": { N: input.totalHours.toString() },
        },
        UpdateExpression: "SET totalProjects = totalProjects + :tp, totalFiles = totalFiles + :tf, totalHours = totalHours + :th"
    };

    const command = new UpdateItemCommand(params);

    try {
        const updateResult = await dydb.send(command);
        console.log(updateResult);
        return updateResult.Attributes || {};
    } catch (err) {
        console.log('Error', err);
    }
}
