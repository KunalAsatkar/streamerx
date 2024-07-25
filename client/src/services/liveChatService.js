import axios from "axios";

export const getYtTokenAndChatId = async (userId) => {
    // get access token
    try {
        const response = await axios.get('http://localhost:8000/auth/google/accesstoken', { params: { userId } });
        const ytAccessToken = response.data.accessToken;
        console.log('YTaccessToken: ', ytAccessToken);
    
        // get livechatid
        const resp = await axios.get('http://localhost:8000/livechat/google/livechatid', { params: { accessToken: ytAccessToken } });
        const liveChatId = resp.data.liveChatId;
    
        return { ytAccessToken, liveChatId };
    } catch (error) {
        console.log("Error in getting the accesstoken and livechatid");
        return { ytAccessToken: null, liveChatId: null };
    }
}

export const fetchLiveChat = async (ytAccessToken, liveChatId, nextPageToken, setNextPageToken) => {
        try {
            const liveChat = await axios.get('http://localhost:8000/livechat/google/getlivechats', { params: { liveChatId, nextPageToken, accessToken: ytAccessToken } });
            // console.log('msg items array: ', liveChat.data.data.items);
            const msges = liveChat.data.data.items;
            const modifiedMsg = msges.map(msg => {
                return { ...msg, platform: 'youtube' };
            });

            setNextPageToken(liveChat.data.data.nextPageToken);
            return modifiedMsg;
        } catch (error) {
            console.log('error in livechats', error);
            return [];
        }
}