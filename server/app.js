const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
require('./passport.js');

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
// y ? generated unique id(session-id) when loggin using google auth
app.use(session({
    secret: ';ajkfj0239nsjlfi',
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize()); // similar to npm init
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/youtube.readonly'] }))
app.get('/auth/google/callback', passport.authenticate('google', { 
        successRedirect: 'http://localhost:5173/platform',
        failureRedirect: 'http://localhost:5173/platform' 
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user);
})

const authRoutes = require('./Routes/authRoutes');
// const awarenessRoutes = require('./Routes/awarenessRoutes');

app.use('/auth', authRoutes);
// app.use('/awareness', awarenessRoutes);


app.get('/', (req, res) => {
    // console.log(req);
    res.status(200).json({
        status: true,
        data: {}
    })
})

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



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("server is running on ", PORT);
})
