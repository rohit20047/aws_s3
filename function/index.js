

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const app = express();

const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESSTOKEN,
        secretAccessKey: process.env.SECRETACCESSTOKEN,
    }
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle file upload and upload to S3
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const s3Params = {
        Bucket: 'rapidlynk',
        Key: `uploads/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(s3Params));
        const fileUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`;
        res.send(`File uploaded successfully. Access it here: <a href="${fileUrl}">${fileUrl}</a>`);
    } catch (err) {
        res.status(500).send(`Error uploading file: ${err.message}`);
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
