import {dydb} from "~/lib/dydb";
import {GetItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {
    CreateJobCommand,
    CreateJobTemplateCommand,
    CreateJobTemplateCommandInput,
    ListJobTemplatesCommand
} from "@aws-sdk/client-mediaconvert";
import {env} from "~/env";
import {baseUrl, inputBucket, statusTable} from "~/dal/constants";
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

        return response.Item !== undefined
            && response.Item.project !== undefined
            && response.Item.project.S == 'MediaConvert'
            && response.Item.tomp4 !== undefined
            && response.Item.tomp4.BOOL !== undefined
            && response.Item.tomp4.BOOL ;

    } catch (err) {
        console.error(err);
    }
}

const jobTemplateNames = ["JobTemplateName1", "JobTemplateName2", "JobTemplateName3"]; // Your list of job template names

async function checkIfJobTemplatesExists() {
    const params = {
        MaxResults: 20 // Max number of job templates returned by ListJobTemplatesCommand
    };

    try {
        const response = await mediaConvert.send(new ListJobTemplatesCommand(params));

        if ( response.JobTemplates ){
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

    try {

        const response = await fetch(templateUrl);
        const jobTemplateParams: CreateJobTemplateCommandInput = await response.json();

        jobTemplateParams["Queue"] = `arn:aws:mediaconvert:${env.AWS_REGION}:${env.AWS_ACCOUNT_ID}:queues/Default`;

        await mediaConvert.send( new CreateJobTemplateCommand(jobTemplateParams));
        return true;
    } catch (err){
        console.error(err);
        return false;
    }
}

async function updateDynamoDB(){
    const dynamoDbParams = {
        TableName : statusTable,
        Item: {
            "project": {S: 'MediaConvert'},
            "fileName": {S: 'status'},
            "tomp4": {BOOL: true}
        }
    };

    try {
        await dydb.send(new PutItemCommand(dynamoDbParams));
    } catch(err) {
        console.error(err);
    }
}

interface IStartJobProcessingParam {
    project: string;
    fileName: string;

}

export async function startJobProcessing(props: IStartJobProcessingParam): Promise<void> {

    const template_exists_in_dynamodb = await checkTemplateExistsInDynamoDB();

    if(!template_exists_in_dynamodb){
        console.log("Job template not found in DynamoDB.");

        // get array of job template names that do not exist in media convert
        const templates_not_in_mediaconvert = await checkIfJobTemplatesExists();

        // If there are job templates name that do not exist, then create them
        if( templates_not_in_mediaconvert !== undefined && templates_not_in_mediaconvert.length > 0){
            console.log("Some job templates not found in MediaConvert. Starting their creation...");

            // Loop over each job template name that doesn't exist in MediaConvert and create it
            for(const jobTemplateName of templates_not_in_mediaconvert){
                console.log(`Creating Job Template : ${jobTemplateName}`);

                const job_template_created = await createJobTemplate(jobTemplateName);

                if(job_template_created){
                    await updateDynamoDB();
                    console.log(`Job template ${jobTemplateName} created and uploaded the record to DynamoDB`);
                }
            }
        }
    }


    const jobParams: CreateJobCommand = {
        Role: "arn:aws:iam::111122223333:role/MediaConvert_Default_Role", // replace with your IAM Role
        JobTemplate: "JobTemplateName", // replace with your job template name
        Queue: `arn:aws:mediaconvert:${env.AWS_REGION}:${env.AWS_ACCOUNT_ID}:queues/Default`, // replace with your queue ARN
        Settings: {
            Inputs: [
                {
                    FileInput: `s3://${inputBucket}/${props.project}/${props.fileName}`, // Replace with your S3 bucket and file name
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
        AccelerationSettings: {
            Mode: 'ENABLED'
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


