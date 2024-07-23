const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to db..")
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = connectDB;