import { useRef, useState, useEffect } from "react"
import { io } from 'socket.io-client'
import './golive.css';
import axios from "axios";

const GoLive = () => {

    const [data, setData] = useState({
        instaStreamURL: "",
        instaStreamKey: "",
        youtubeStreamURL: "",
        youtubeStreamKey: "",
    });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const userVideoRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRcd, setMediaRcd] = useState(null);
    const [socket, setSocket] = useState(null);
    const [yt_token, setYt_Token] = useState(null);
    const [channelId, setChannelId] = useState('');
    const [liveChatId, setLiveChatId] = useState('');

    useEffect(() => {
        const getMedia = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                setMediaStream(media);
                userVideoRef.current.srcObject = media;
            } catch (error) {
                console.log('Error accessing media', error);
            }


        }

        const getUser = async () => {
            try {
                const user = await axios.get('http://localhost:3000/api/user', 'panbuderutuj6@gcoea.ac.in');
                setYt_Token(user.googleAccessToken);
            } catch (error) {
                console.log(error);
            }
        }

        // const getLiveChatId = async (accessToken, channelId) => {

        // }

        const getChannelId = async (accessToken) => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
                    params: {
                        part: 'snippet',
                        mine: true, // Set to true if fetching the channel ID for the authenticated user
                        access_token: accessToken
                    }
                });

                // Assuming the response contains the authenticated user's channel ID
                const channel = response.data.items[0];
                if (channel) {
                    console.log(channel.id);
                    setChannelId(channel.id);
                } else {
                    console.error('No channel found for the authenticated user');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching channel ID:', error);
            }
        };

        const getLiveChatId = async (accessToken, channelId) => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/liveBroadcasts', {
                    params: {
                        part: 'snippet',
                        broadcastType: 'all',
                        broadcastStatus: 'active',
                        mine: true, // Set to true if the user's channel
                        access_token: accessToken
                    }
                });

                // Assuming the first active live broadcast contains the live chat ID
                const liveBroadcast = response.data.items[0];
                if (liveBroadcast) {
                    setLiveChatId(liveBroadcast.snippet.liveChatId);
                } else {
                    console.error('No active live broadcast found');
                }
            } catch (error) {
                console.error('Error fetching live chat ID:', error);
                return null;
            }
        };

        getMedia();
        getUser();
        getChannelId(yt_token);
        getLiveChatId(yt_token, channelId)

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);



    const handleStart = () => {
        if (!mediaStream) return;

        const newSocket = io('http://localhost:5000', {
            autoConnect: false,
            query: {
                instaStreamURL: data.instaStreamURL,
                instaStreamKey: data.instaStreamKey,
                youtubeStreamURL: data.youtubeStreamURL,
                youtubeStreamKey: data.youtubeStreamKey,
            },
        });

        setSocket(newSocket);

        newSocket.connect();

        const mediaRecorder = new MediaRecorder(mediaStream, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            framerate: 25,
        })

        setMediaRcd(mediaRecorder);

        mediaRecorder.ondataavailable = (e) => {
            console.log('Binary Stream Available:', e.data);
            newSocket.emit('binarystream', e.data);
        }

        mediaRecorder.start(25);
    }

    const handleStop = () => {
        socket.disconnect();
        setSocket(null);
        mediaRcd.stop();
        setMediaRcd(null);
    }

    return (
        <div className="golive-container">

            <div className="golive-main">
                <h1>Studio</h1>
                <div className="golive-utils">
                    <div className="golive-video">
                        <video id="user-video" ref={userVideoRef} autoPlay muted controls></video>
                    </div>
                    <div className="golive-chats">
                        <div className="chats-top">
                            <h5>Top Chats</h5>
                            <hr />
                        </div>
                        <div className="chats-container">

                        </div>
                    </div>
                </div>

                <div className="golive-inputs">
                    <div className="golive-input">
                        <section className="golive-input-section">
                            <label htmlFor="instaStreamURL">Insta StreamURL</label>
                            <input type='password' value={data.instaStreamURL} onChange={changeHandler} name="instaStreamURL" id="instaStreamURL" placeholder="instaStreamURL" />
                        </section>
                        <section className="golive-input-section">
                            <label htmlFor="instaStreamKey">Insta StreamKey</label>
                            <input type="password" value={data.instaStreamKey} onChange={changeHandler} name="instaStreamKey" id="instaStreamKey" placeholder="instaStreamKey" />
                        </section>
                    </div>
                    <div className="golive-input">
                        <section className="golive-input-section">
                            <label htmlFor="youtubeStreamURL">Youtube StreamURL</label>
                            <input type='password' value={data.youtubeStreamURL} onChange={changeHandler} name="youtubeStreamURL" id="youtubeStreamURL" placeholder="youtubeStreamURL" />
                        </section>
                        <section className="golive-input-section">
                            <label htmlFor="youtubeStreamKey">Youtube StreamKey</label>
                            <input type="password" value={data.youtubeStreamKey} onChange={changeHandler} name="youtubeStreamKey" id="youtubeStreamKey" placeholder="youtubeStreamKey" />
                        </section>
                    </div>
                </div>
                <div className="golive-btns">
                    <button id="start-btn" onClick={handleStart} disabled={((data.instaStreamKey && data.instaStreamURL) || (data.youtubeStreamKey && data.youtubeStreamURL)) ? false : true}>Start</button>
                    <button id="end-btn" onClick={handleStop} disabled={mediaRcd === null ? true : false}>End</button>
                </div>
            </div>

        </div>

    )
}

export default GoLive