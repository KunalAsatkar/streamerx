import { io } from 'socket.io-client'

export const socketService = (data) => {
    io('http://localhost:5000', {
        autoConnect: false,
        query: {
            instaStreamURL: data.instaStreamURL,
            instaStreamKey: data.instaStreamKey,
            youtubeStreamURL: data.youtubeStreamURL,
            youtubeStreamKey: data.youtubeStreamKey,
        },
    });
};