import {
    DeleteItemCommand, GetItemCommand,
    PutItemCommand,
    QueryCommand,
    ScanCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import {dydb} from "~/lib/dydb";
import {statusTable} from "~/dal/constants";
import { marshall } from "@aws-sdk/util-dynamodb";
import {modifyStats} from "~/dal/stats";

interface getProjectsReturn {
    name: string
}

export async function getProjects(): Promise<getProjectsReturn[]> {
    // Define the query parameters
    const params = {
        TableName: statusTable,
        KeyConditionExpression: "#d1330 = :d1330 And #d1331 = :d1331",
        ExpressionAttributeNames: { "#d1330": "project", "#d1331": "fileName" },
        ExpressionAttributeValues: {
            ":d1330": { S: "list" },
            ":d1331": { S: "projects" }
        }
    };

    // Create QueryCommand instance
    const command = new QueryCommand(params);

    // Execute the query
    const data = await dydb.send(command)

    if (data.Items === undefined) {
        return []
    }

    return data.Items.flatMap(item => (
        item?.list?.L?.map(listItem => ({
            name: listItem.S || ''
        })) || []
    ));
}

export interface getAllProjectsStatusReturn {
    projectName: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getAllProjectsStatus(): Promise<getAllProjectsStatusReturn[]> {

    const projects = await getProjects();

    let retArr: getAllProjectsStatusReturn[] = []

    for (const project of projects) {

        // Create the command
        const command = new QueryCommand({
            TableName: statusTable,
            KeyConditionExpression: "#d1330 = :d1330 And #fName = :fName", // define condition for fileName
            ExpressionAttributeNames: { "#d1330": "project", "#fName": "fileName" }, // define attributeName for fileName
            ExpressionAttributeValues: {
                ":d1330": { "S": project.name },
                ":fName": { "S": `status` } // concatenate the word "status" with the project value
            },
        });

        // Get the scan results
        const response = await dydb.send(command);

        if (response.Items) {
            const item = response.Items[0]
            retArr.push({
                projectName: item?.project?.S ?? "",
                status: item?.status?.S ?? "",
                createdAt: new Date(item?.createdAt?.S ?? ""),
                updatedAt: new Date(item?.updatedAt?.S  ?? "")
            });
        }

    }

    // return empty array if no item found in table
    return retArr;
}

interface getProjectStatusReturn {
    projectName: string
    status: string
}

export async function getProjectStatus(project: string): Promise<getProjectStatusReturn | null> {
    // Create the command
    const command = new QueryCommand({
        TableName: "MediaConvert-status",
        KeyConditionExpression: "#d1330 = :d1330 And #fName = :fName", // define condition for fileName
        ExpressionAttributeNames: { "#d1330": "project", "#fName": "fileName" }, // define attributeName for fileName
        ExpressionAttributeValues: {
            ":d1330": { "S": project },
            ":fName": { "S": `status` } // concatenate the word "status" with the project value
        },
    });

    // Get the query results
    const response = await dydb.send(command);

    // Process and return items
    if (response.Items) {
        const item = response.Items[0]; // get the first item
        if (item && item.project && item.project.S && item.fileName && item.fileName.S) {
            // map project and fileName to projectName and status
            return {
                projectName: item.project.S,
                status: item.fileName.S
            };
        }
    }

    // return null if no item was found
    return null;
}

interface CreateProjectParams {
    projectName: string;
}

export async function createProject(props: CreateProjectParams) {

    const command = new UpdateItemCommand({
        TableName: statusTable,
        Key: {
            "project": { S: "list" },
            "fileName": { S: "projects" }
        },
        ExpressionAttributeNames: {
            "#listAttr": "list"
        },
        ExpressionAttributeValues: {
            ":val": {
                "L": [{ "S": props.projectName }]
            },
            ":empty_list": { "L": [] }
        },
        UpdateExpression: "SET #listAttr = list_append(if_not_exists(#listAttr, :empty_list), :val)",
        ReturnValues: "ALL_NEW"
    });

    // New command to create an item
    const createCommand = new PutItemCommand({
        TableName: statusTable,
        Item: {
            "project": { S: props.projectName },
            "fileName": { S: "status" },
            "status": { S: "created" },
            "createdAt": { S: new Date().toISOString() },
            "updatedAt": { S: new Date().toISOString() }
        }
    });

    try {
        const data = await dydb.send(command);
        const createData = await dydb.send(createCommand);
        await modifyStats({
            totalProjects: 1,
            completedConversions:0,
            inProgress:0,
            archived:0
        })
        return {data, createData };
    } catch (err) {
        console.error(err);
    }
}

interface DeleteProjectParams {
    projectName: string;
}

export async function deleteProject(props: DeleteProjectParams) {

    const getItemCommand = new GetItemCommand({
        TableName: statusTable,
        Key: {
            "project": { S: "list" },
            "fileName": { S: "projects" }
        },
    });

    const scanCommand = new ScanCommand({
        TableName: statusTable,
        FilterExpression: "begins_with(#p, :projectName)",
        ExpressionAttributeNames: {
            "#p": "project"
        },
        ExpressionAttributeValues: {
            ":projectName": { "S": props.projectName }
        }
    });


    try {

        const statusItem = await dydb.send(getItemCommand);

        const existingList = statusItem.Item?.list?.L || [];

        if (existingList.length === 0 ) {
            console.error("Project does not exist")
        }

        const index = existingList.findIndex(item => item.S === props.projectName);

        const removeProjectCommand = new UpdateItemCommand({
            TableName: statusTable,
            Key: {
                "project": { S: "list" },
                "fileName": { S: "projects" }
            },
            UpdateExpression: `REMOVE #listAttr[${index}]`,
            ExpressionAttributeNames: {
                "#listAttr": "list"
            },
            ReturnValues: "ALL_NEW"
        });

        const removeFromList = await dydb.send(removeProjectCommand);

        const scanData = await dydb.send(scanCommand);

        if (scanData.Items) {
            for (const item of scanData.Items) {
                // Make sure project and fileName exist and they are not undefined
                if (item.project && item.project.S && item.fileName && item.fileName.S) {
                    const deleteCommand = new DeleteItemCommand({
                        TableName: statusTable,
                        Key: marshall({
                            project: item.project.S,
                            fileName: item.fileName.S
                        })
                    });

                    await dydb.send(deleteCommand);
                }
            }
        }


        await modifyStats({
            totalProjects: -1,
            completedConversions:0,
            inProgress:0,
            archived:0
        })
        console.log('All project items deleted');
    } catch (err) {
        console.error(err);
    }
}

async function renameProject(oldProjectName: string, newProjectName: string) {

    // Use a scan to find all items starting with the project name
    const scanCommand = new ScanCommand({
        TableName: statusTable,
        FilterExpression: "begins_with(project, :projectName)",
        ExpressionAttributeValues: {
            ":projectName": { "S": oldProjectName }
        }
    });

    // Fetch all items with keys starting with old project name
    const scanData = await dydb.send(scanCommand);

    // If items were found
    if(scanData.Items){
        for(const item of scanData.Items){

            if(item.project && item.project.S && item.fileName && item.fileName.S){
                const oldProjectKey = item.project.S;
                const fileName = item.fileName.S


                // Delete the old item
                const deleteCommand = new DeleteItemCommand({
                    TableName: statusTable,
                    Key: marshall({
                        project: oldProjectKey,
                        fileName: fileName
                    })
                });

                await dydb.send(deleteCommand);


                // Replace old project name within the string with new project name
                const newProjectKey = oldProjectKey.replace(oldProjectName, newProjectName);


                // Put the new item
                const newItem = {...item, project: {S: newProjectKey}}
                const putCommand = new PutItemCommand({
                    TableName: statusTable,
                    Item: newItem,
                });

                await dydb.send(putCommand);

            }
        }
    }

    console.log("All item keys renamed!");
}

