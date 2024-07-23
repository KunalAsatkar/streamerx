const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const configRoutes = require('./Routes/configRoutes.js');
const { passport, session } = require('./middleware/index.js');
const { connectDB, corsConfig } = require('./utils/index.js');

app.use(express.json());
app.use(corsConfig);
// for OAuth (google/instagram)
app.use(cookieParser());
app.use(session);
app.use(passport.initialize()); // similar to npm init
app.use(passport.session());

// main routes
configRoutes(app);

app.get('/', (req, res) => {
    // console.log(req);
    res.status(200).json({
        status: true,
        data: {}
    });
});

app.use((req, res) => {
    res.status(404).send("Page not found");
});

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("server is running on ", PORT);
});