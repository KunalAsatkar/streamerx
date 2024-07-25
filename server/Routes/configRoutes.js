const authRoutes = require('./streamxRoutes/authRoutes.js');
const notifyRoutes = require('./streamxRoutes/notifyRoutes.js');
const liveChatRoutes = require('./LiveChatsRoutes/ytLiveChatsRoutes.js');
// aws route
// const awarenessRoutes = require('./Routes/awarenessRoutes');

const configRoutes = (app) => {
    app.use('/auth', authRoutes);
    app.use('/notify', notifyRoutes);
    // app.use('/awareness', awarenessRoutes);
    app.use('/livechat', liveChatRoutes);
}

module.exports = configRoutes;