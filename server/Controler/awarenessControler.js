const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { streamModel } = require('../Models/streamModel');

const uploadVideo = async (req, res, next) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        console.log("req.body", req.body);
        console.log("req.file", req.file);

        const data = {
            title: req.body.title,
            key: req.file.key,
            location: req.file.location
        }
        const videoData = streamModel(data);
        const result = await videoData.save();

        return res.status(200).json({
            status: true,
            body: result
        })
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            status: false,
            body: err
        })
    }
}

const getVideos = async (req, res, next) => {
    try {
        const result = await streamModel.find();
        console.log(result);
        res.status(200).json({
            status: true,
            body: result
        })
    }
    catch (err) {
        return res.status(400).json({
            status: false,
            body: err
        });
    }
}


module.exports = { uploadVideo, getVideos };