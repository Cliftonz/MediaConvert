import {dydb} from "~/lib/dydb";
import {GetItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {
    CreateJobCommand,
    CreateJobCommandInput,
    CreateJobTemplateCommand,
    CreateJobTemplateCommandInput,
    ListJobTemplatesCommand
} from "@aws-sdk/client-mediaconvert";
import {env} from "~/env";
import {baseUrl, inputBucket, jobTemplateNames, outputBucket, statusTable} from "~/dal/constants";
import {ContainerFormat} from "~/components/constants";
import {mediaConvert} from "~/lib/mediaConvert";

async function checkTemplateExistsInDynamoDB() {
    const params = {
        TableName: statusTable,
        Key: {
            "project": {S: 'MediaConvert'},
            "fileName": {S: 'status'}
        }
    };

    try {

        let response = await dydb.send(new GetItemCommand(params))

        let returnValue = false

        if (response.Item !== undefined
            && response.Item.project !== undefined
            && response.Item.project.S == 'MediaConvert') {

            for (let template in jobTemplateNames) {
                if (response.Item[template] !== undefined
                    && response.Item[template]?.BOOL !== undefined
                    && response.Item[template]?.BOOL !== true) {
                    returnValue = true;
                    break;
                }
            }
        }

        return returnValue;

    } catch (err) {
        console.error(err);
    }
}

async function checkIfJobTemplatesExists() {
    const params = {
        MaxResults: 20 // Max number of job templates returned by ListJobTemplatesCommand
    };

    try {
        const response = await mediaConvert.send(new ListJobTemplatesCommand(params));

        if (response.JobTemplates) {
            // Filter out names existing in jobTemplateNames.
            return jobTemplateNames.filter(
                jobTemplateName => !response.JobTemplates?.some(
                    jobTemplate => jobTemplate.Name === jobTemplateName
                )
            );

        } else {
            // If no templates exist in MediaConvert then return all jobTemplateNames as not found.
            return jobTemplateNames;
        }
    } catch (err) {
        console.error(err);
    }
}

async function createJobTemplate(jobTemplateName: string) {

    const templateUrl = `${baseUrl}/templates/${jobTemplateName}.json`;

    const response = await fetch(templateUrl);
    const jobTemplateParams: CreateJobTemplateCommandInput = await response.json();

    jobTemplateParams["Queue"] = `arn:aws:mediaconvert:${env.AWS_REGION}:${env.AWS_ACCOUNT_ID}:queues/Default`;

    const jobTemplateData = await mediaConvert.send(new CreateJobTemplateCommand(jobTemplateParams));
    if (!jobTemplateData) {
        return undefined;
    }
    return jobTemplateData.JobTemplate?.Arn;
}

async function updateDynamoDB(templateName: string, arn: string) {
    const dynamoDbParams = {
        TableName: statusTable,
        Item: {
            "project": {S: 'MediaConvert'},
            "fileName": {S: 'status'},
            [templateName]: {BOOL: true},
            [templateName]: {S: arn}
        }
    };

    try {
        await dydb.send(new PutItemCommand(dynamoDbParams));
    } catch (err) {
        console.error(err);
    }
}

interface IStartJobProcessingParam {
    project: string;
    fileName: string;
    format: ContainerFormat;
}

export async function startJobProcessing(props: IStartJobProcessingParam): Promise<void> {

    const template_exists_in_dynamodb = await checkTemplateExistsInDynamoDB();

    if (!template_exists_in_dynamodb) {
        console.log("Job template not found in DynamoDB.");

        // get array of job template names that do not exist in media convert
        const templates_not_in_mediaconvert = await checkIfJobTemplatesExists();

        // If there are job templates name that do not exist, then create them
        if (templates_not_in_mediaconvert !== undefined && templates_not_in_mediaconvert.length > 0) {
            console.log("Some job templates not found in MediaConvert. Starting their creation...");

            // Loop over each job template name that doesn't exist in MediaConvert and create it
            for (const jobTemplateName of templates_not_in_mediaconvert) {
                console.log(`Creating Job Template : ${jobTemplateName}`);

                const job_template_created_arn = await createJobTemplate(jobTemplateName);

                if (job_template_created_arn) {
                    await updateDynamoDB(jobTemplateName, job_template_created_arn);
                    console.log(`Job template ${jobTemplateName} created and uploaded the record to DynamoDB`);
                } else {
                    console.error("Job template could not be created.");
                }
            }
        }
    }


    const jobParams: CreateJobCommandInput = {
        Role: env.AWS_MEDIACONVERT_ARN,
        JobTemplate: `convert_to_${props.format.toString().toLowerCase()}`,
        Settings: {
            Inputs: [
                {
                    FileInput: `s3://${inputBucket}/${props.project}/${props.fileName}`, // Replace with your S3 bucket and file name
                },
            ],
            OutputGroups: [{
                Name: "MP4",
                OutputGroupSettings: {
                    Type: "FILE_GROUP_SETTINGS",
                    FileGroupSettings: {
                        Destination: `s3://${outputBucket}/${props.project}/${removeFileExtension(props.fileName)}`
                    }
                },
            }],
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

const removeFileExtension = (fileName: string) => {
    // Get the position of the last '.' in fileName
    const lastDotIndex = fileName.lastIndexOf('.');

    // If lastDotIndex is -1, fileName has no extension, else it has an extension
    if (lastDotIndex === -1) {
        // No extension, so just return the original fileName
        return fileName;
    } else {
        // There is an extension, so remove it by returning only part before the '.'
        return fileName.substr(0, lastDotIndex);
    }
}


