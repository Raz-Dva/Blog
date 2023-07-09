// import {S3Client} from "@aws-sdk/client-s3";
// const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: process.env.REGION,
    });

export const s3PutObject = async (file) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer,
        Key: 'id_' + (new Date().getTime()) + '_' + file.originalname, // add post id instead of name
        ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const result = await client.send(command);

    if (result['$metadata'].httpStatusCode === 200) {
       return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${command.input.Key}`;
    }

    return null;
}
