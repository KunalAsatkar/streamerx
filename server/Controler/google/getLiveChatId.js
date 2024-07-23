const { google } = require('googleapis')
const youtube = google.youtube('v3');

const getLiveChatId = async (req, res) => {
    const accessToken = req.query.accessToken;

    // get id from yt
    const resp = await youtube.liveBroadcasts.list({
        access_token: accessToken,
        part: 'snippet',
        mine: 'true',
    })

    const latestChat = resp.data.items[0];
    const liveChatId = latestChat.snippet.liveChatId;

    // console.log('latestChats: ', latestChat);
    res.status(200).json({ liveChatId: liveChatId });
}

module.exports = { getLiveChatId };