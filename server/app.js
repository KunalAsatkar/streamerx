const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./Routes/authRoutes');
const awarenessRoutes = require('./Routes/awarenessRoutes');

app.use('/auth', authRoutes);
app.use('/awareness', awarenessRoutes);


app.get('/', (req, res) => {
    // console.log(req);
    res.status(200).json({
        status: true,
        data: {}
    })
})


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

app.use((req, res) => {
    res.status(404).send("Page not found");
});


connectDB();



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("server is running on ", PORT);
})
