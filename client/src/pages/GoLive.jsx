import { useRef, useState, useEffect } from "react"
import { io } from 'socket.io-client'
import './golive.css';
import { FaYoutube } from "react-icons/fa";
import axios from "axios";
import { FaInstagramSquare } from "react-icons/fa";

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
    const [ytAccessToken, setYtAccessToken] = useState(null);
    const [liveChatId, setLiveChatId] = useState('');
    const [notifyEmail, setNotifyEmail] = useState([]);
    const [intervVl, setInterVl] = useState();
    const [nextPageToken, setNextPageToken] = useState('');
    const [liveChats, setLiveChats] = useState([]);
    const [subject, setSubject] = useState('');
    const [msg, setMsg] = useState('');

    const chatContianerRef = useRef(null);

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

        const getYtAccessToken = async () => {
            const resp = await axios.get('http://localhost:8000/getaccesstoken', { params: { userId: window.localStorage.getItem('userId') } });
            setYtAccessToken(resp.data.accessToken);
            console.log(resp.data);
        }

        getMedia();
        getYtAccessToken();

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

    // implementing this...
    let nextPageTokenForChat; // jugad since nextPageToken useState var is not updating
    const getLiveChats = async () => {
        // get livechatid
        const resp = await axios.get('http://localhost:8000/livechatid', { params: { accessToken: ytAccessToken } });
        const LiveChatId = resp.data.liveChatId;

        setLiveChatId(LiveChatId);

        const interval = setInterval(async () => {
            setInterVl(interval);
            try {
                console.log('nextPageTOken: ', nextPageToken)
                // const liveChat = await  axios.get('http://localhost:8000/getlivechats', { params: { liveChatId: LiveChatId, nextPageToken: nextPageToken, accessToken: ytAccessToken } });
                const liveChat = await axios.get('http://localhost:8000/getlivechats', { params: { liveChatId: LiveChatId, nextPageToken: nextPageTokenForChat, accessToken: ytAccessToken } });
                console.log('msg items array: ', liveChat.data.data.items);
                const msges = liveChat.data.data.items;
                const modifiedMsg = msges.map(msg => {
                    return { ...msg, platform: 'youtube' };
                })

                setLiveChats((prevLiveChats) => [...prevLiveChats, ...modifiedMsg]);
                setNextPageToken(liveChat.data.data.nextPageToken)
                nextPageTokenForChat = liveChat.data.data.nextPageToken;
                // console.log('nextpagetoken: ', liveChat.data.data.nextPageToken);
            } catch (error) {
                console.log('error in livechats', error);
            }
        }, 3000);
    }

    const handleStopChat = () => {
        clearInterval(intervVl);
        setInterVl(null);
        setLiveChatId('');
        setNextPageToken('');
    }

    const handleStop = () => {
        socket.disconnect();
        setSocket(null);
        mediaRcd.stop();
        setMediaRcd(null);
    }

    const handleAddEmail = () => {
        setNotifyEmail([...notifyEmail, '']); // Add an empty EnvVar object
        console.log(notifyEmail)
    };

    const handleEmailChange = (index, e) => {
        const updatedEmail = [...notifyEmail];
        updatedEmail[index] = [...updatedEmail[index]]; // Clone old string
        if (e.target.name === 'email') updatedEmail[index] = e.target.value.trim();
        setNotifyEmail(updatedEmail);
    };

    const handleMsgSubChange = (e) => {
        if (e.target.name === 'subject') setSubject(e.target.value);
        if (e.target.name === 'msg') setMsg(e.target.value);
    }

    const handleSubmitEmails = async () => {
        try {
            const resp = await axios.post("http://localhost:8000/notify", { senderEmail: window.localStorage.getItem('email'), emails: notifyEmail, msg: msg, subject: subject });
            // console.log(resp);
            if (resp.status === 200) {
                // toast logic
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
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
                            <div className="chats">
                                {
                                    liveChats.length > 0 && (
                                        <div className="chatContainer">
                                            <pre className="preFormat">
                                                {
                                                    liveChats.map((chat, i) => (
                                                        <p
                                                            ref={liveChats.length - 1 === i ? chatContianerRef : undefined}
                                                            key={i}
                                                        >
                                                            <span>{chat.platform === 'youtube' ? <FaYoutube size={15} /> : <FaInstagramSquare size={15} />} </span>
                                                            <span>{chat.platform === 'youtube' ? chat.authorDetails.displayName + ': ' : ''} </span>
                                                            <span>{chat.platform === 'youtube' ? chat.snippet.textMessageDetails.messageText : ''}</span>
                                                        </p>
                                                    ))
                                                }
                                            </pre>
                                        </div>
                                    )
                                }
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
                        <button id="start-btn" onClick={getLiveChats} >StartChats</button>
                        <button id="end-btn" onClick={handleStopChat} >EndChats</button>
                    </div>
                </div>



            </div>
            <div className="send-notification-container">
                <h2>Add emails</h2>
                {notifyEmail.map((varString, index) => (
                    <div key={index} className="notify-email-input">
                        <div className="sn1">
                            <label htmlFor="email">Email</label>
                            <input
                                className='input'
                                type="text"
                                name='email'
                                placeholder={`email`}
                                value={varString.name}
                                onChange={(e) => handleEmailChange(index, e)}
                            />

                        </div>

                    </div>
                ))}
                <div className="notify-email-input">
                    <div className="sn1">
                        <label htmlFor="email">Subject</label>
                        <input
                            className='input'
                            type="text"
                            name='subject'
                            placeholder={`email`}
                            onChange={(e) => handleMsgSubChange(e)}
                        />

                    </div>
                    <div className="sn1">
                        <label htmlFor="email">Message</label>
                        <input
                            className='input'
                            type="text"
                            name='msg'
                            placeholder={`email`}
                            onChange={(e) => handleMsgSubChange(e)}
                        />

                    </div>

                </div>
                <button className='button button-primary' onClick={handleAddEmail}>
                    + Add Email
                </button>
                <button
                    onClick={handleSubmitEmails}
                    disabled={!notifyEmail}
                    className='button'
                    type='submit'
                >
                    {notifyEmail ? "Notify" : "Add Emails..."}
                </button>

            </div>
        </>
    )
}

export default GoLive