import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.REGION,
});

export const s3PutObject = (file) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer,
        Key: 'id_' + (new Date().getTime()) + '_' + file.originalname,
        ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    return client.send(command)
        .then(() => {
            return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${command.input.Key}`;
        })
        .catch(() => {
            return null;
        });
}
