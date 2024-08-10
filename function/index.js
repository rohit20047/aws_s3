require('dotenv').config()
const { S3Client , GetObjectCommand , PutObjectCommand} = require("@aws-sdk/client-s3");
const  { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
//const { putSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: "eu-north-1", 
    credentials: {
        accessKeyId: process.env.ACCESSTOKEN,
        secretAccessKey: process.env.SECRETACCESSTOKEN,
    }
 });


 async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket : "rapidlynk",
        Key : key,
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
 }


 async function putObjectURL(filename){
    const command = new PutObjectCommand({
        Bucket : "rapidlynk",
        Key : `uploads/${filename}`,
        ContentType : "application/pdf",
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
 }


//  async function init(){
// console.log("url", await getObjectURL("Joins.pdf"));
//  }

 async function init(){
    console.log(
    await putObjectURL(`application-${Date.now()}.pdf`, "application/pdf")
    );
 }
 init()  
