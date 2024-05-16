const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
require('./utils/passport.js');

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
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize()); // similar to npm init
app.use(passport.session());

const scope = [
    'email',
    'profile',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
];

app.get('/auth/google', passport.authenticate('google', { scope: scope, accessType: 'offline' }))
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
const notifyRoutes = require('./Routes/notifyRoutes.js');
app.use('/notify', notifyRoutes);

const googleAuthTokenRoute = require('./Routes/googleAuthTokens.js');
app.use('/getaccesstoken', googleAuthTokenRoute);
const { getLiveChatId } = require('./Controler/getLiveChatId.js')
app.use('/livechatid', getLiveChatId);
const { getLiveChats } = require('./Controler/getLiveChats.js');
app.use('/getlivechats', getLiveChats);


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
