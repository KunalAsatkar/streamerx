const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos } = require('../Controler/awarenessControler');
const { upload } = require('../middleware/uploadMiddleware');


// upload(upload.single()) is a middleware function and it only works when called as middleware;
router.post('/', upload.single('video'), uploadVideo);
router.get('/', getVideos);

module.exports = router;

