import { useRef, useState, useEffect } from "react"
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
    autoConnect: false,
});

const GoLive = () => {

    const [data, setData] = useState({
        streamURL: "",
        streamKey: "",
    });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const userVideoRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRcd, setMediaRcd] = useState(null);

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

        getMedia();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);



    const handleStart = () => {
        if (!mediaStream) return;

        socket.connect();

        const mediaRecorder = new MediaRecorder(mediaStream, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            framerate: 25,
        })

        setMediaRcd(mediaRecorder);

        mediaRecorder.ondataavailable = (e) => {
            console.log('Binary Stream Available:', e.data);
            socket.emit('binarystream', e.data);
        }

        mediaRecorder.start(25);
    }

    const handleStop = () => {
        socket.disconnect();
        mediaRcd.stop();
        setMediaRcd(null);
    }

    return (
        <>
            <h1>Studio</h1>
            <div>
                <label htmlFor="streamURL">StreamURL</label>
                <input value={data.streamURL} onChange={changeHandler} name="streamURL" id="streamURL" placeholder="streamURL" />
                <label htmlFor="streamKey">StreamKey</label>
                <input value={data.streamKey} onChange={changeHandler} name="streamKey" id="streamKey" placeholder="streamKey" />
                <video id="user-video" ref={userVideoRef} autoPlay muted></video>
                <button id="start-btn" onClick={handleStart} disabled={mediaRcd === null ? false : true}>Start</button>
                <button id="end-btn" onClick={handleStop} disabled={mediaRcd === null ? true : false}>End</button>
            </div>
        </>
    )
}

export default GoLive