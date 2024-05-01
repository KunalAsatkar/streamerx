const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectAclCommand } = require('@aws-sdk/client-s3');


const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    region: process.env.S3_REGION,
});



const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    }),
});


// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });



module.exports = { upload };