import { useRef, useState, useEffect } from "react"
import Notification from "../components/Notification";
import Chats from "../components/Chats";
import { socketService } from "../services/socketService";
import './golive.css';

const GoLive = () => {

    const [data, setData] = useState({
        instaStreamURL: "",
        instaStreamKey: "",
        youtubeStreamURL: "",
        youtubeStreamKey: "",
    });

    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRcd, setMediaRcd] = useState(null);
    const [socket, setSocket] = useState(null);
    const [startChatTrigger, setStartChatTrigger] = useState(false);

    const userVideoRef = useRef(null);
    const userId = window.localStorage.getItem('userId');

    useEffect(() => {
        const getMedia = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                setMediaStream(media);
                userVideoRef.current.srcObject = media;
            } catch (error) {
                console.log('Error accessing media', error);
            }
        };

        getMedia();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleStart = () => {
        if (!mediaStream) return;

        // websocket setup
        const newSocket = socketService(data);
        setSocket(newSocket);
        newSocket.connect();

        const mediaRecorder = new MediaRecorder(mediaStream, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            framerate: 25,
        });

        setMediaRcd(mediaRecorder);

        mediaRecorder.ondataavailable = (e) => {
            // console.log('Binary Stream Available:', e.data);
            newSocket.emit('binarystream', e.data);
        }

        mediaRecorder.start(25);
        setStartChatTrigger(true);
    };

    const handleStop = () => {
        socket.disconnect();
        setSocket(null);
        mediaRcd.stop();
        setMediaRcd(null);
        setStartChatTrigger(false);
    };

    return (
        <>
            <div className="golive-container">

                <div className="golive-main">
                    <h1>Studio</h1>
                    <div className="golive-utils">
                        <div className="golive-video">
                            <video id="user-video" ref={userVideoRef} autoPlay muted controls></video>
                        </div>
                        <Chats userId={userId} startChatTrigger={startChatTrigger} />
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
                    <Notification />
                </div>
            </div>
        </>
    );
}

export default GoLive;