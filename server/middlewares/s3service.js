require("dotenv").config()
// const uuid = require("uuid").v4
const { S3 } = require("aws-sdk")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

exports.s3Uploadv2 = async (files) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      })

    // const param = {
    //     Bucket : process.env.AWS_BUCKET_NAME,
    //     Key: newuploads/${file.originalname},
    //     Body: file.buffer
    // }
    const params = files.map(file => {
        return {
            Bucket : process.env.AWS_BUCKET_NAME,
            Key: `newuploads/${file.originalname}`,
            Body: file.buffer,
        }
    })
    return await Promise.all(params.map(param => s3.upload(param).promise()))

    // return await s3.upload(param).promise()
}

// exports.s3Uploadv3 = async (file) => {
//     const s3client = new S3Client()
//     const param = {
//         Bucket : process.env.AWS_BUCKET_NAME,
//         Key: newuploads/${file.originalname},
//         Body: file.buffer,
//     }
//     return s3client.send(new PutObjectCommand(param))

// }
exports.s3Uploadv3 = async (files) => {
    const s3client = new S3Client()

    const params = files.map(file => {
        return {
            Bucket : process.env.AWS_BUCKET_NAME,
            Key: `newuploads/${file.originalname}`,
            Body: file.buffer,
        }
    })
    return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param)) ))

}