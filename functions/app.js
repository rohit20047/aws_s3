

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const app = express();

//const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESSTOKEN,
        secretAccessKey: process.env.SECRETACCESSTOKEN,
    }
});

exports.handler = async (event, context) => {
    // Check if the request method is POST
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse the incoming JSON body
        const { customFileName, fileBuffer, fileType } = JSON.parse(event.body);

        // Validate input
        if (!customFileName || !fileBuffer) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ error: 'Missing required fields.' })
            };
        }

        // Prepare S3 upload parameters
        const s3Params = {
            Bucket: 'rapidlynkzero',
            Key: `uploads/${customFileName}.pdf`,
            Body: Buffer.from(fileBuffer),
            ContentType: fileType || 'application/pdf',
        };

        // Upload to S3
        await s3Client.send(new PutObjectCommand(s3Params));

        // Generate the file URL
        const fileUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`;

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ fileUrl })
        };
    } catch (err) {
        console.error('Error:', err);

        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error uploading file: ${err.message}` })
        };
    }
};