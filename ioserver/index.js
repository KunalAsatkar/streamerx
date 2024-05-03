import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { spawn } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(cors({ origin: '*' }));
dotenv.config();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
    }
});
const streamws = io.of('/stream');

io.on('connection', socket => {
    console.log('Socket Connected', socket.id);
    const payload = socket.handshake.query;
    console.log(payload);

    const instaStreamCode = payload.instaStreamURL + payload.instaStreamKey;
    const youtubeStreamCode = payload.youtubeStreamURL + "/" + payload.youtubeStreamKey;
    console.log(instaStreamCode, youtubeStreamCode);

    // if (instaStreamCode) {
    const optionsInsta = [
        '-i',
        '-',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-r', `${25}`,
        '-g', `${25 * 2}`,
        '-keyint_min', 25,
        '-crf', '25',
        '-pix_fmt', 'yuv420p',
        '-sc_threshold', '0',
        '-profile:v', 'main',
        '-level', '3.1',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', 128000 / 4,
        '-f', 'flv',
        instaStreamCode
    ];
    const ffmpegProcessInsta = spawn('ffmpeg', optionsInsta);
    ffmpegProcessInsta.stdout.on('data', (data) => {
        console.log(`ffmpeg stdout: ${data}`);
    })
    ffmpegProcessInsta.stderr.on('data', (data) => {
        console.error(`ffmpeg stderr: ${data}`);
    });
    ffmpegProcessInsta.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });


    const optionsYoutube = [
        '-i',
        '-',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-r', `${25}`,
        '-g', `${25 * 2}`,
        '-keyint_min', 25,
        '-crf', '25',
        '-pix_fmt', 'yuv420p',
        '-sc_threshold', '0',
        '-profile:v', 'main',
        '-level', '3.1',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', 128000 / 4,
        '-f', 'flv',
        youtubeStreamCode,
    ];

    const ffmpegProcessYoutube = spawn('ffmpeg', optionsYoutube);

    ffmpegProcessYoutube.stdout.on('data', (data) => {
        console.log(`ffmpeg stdout: ${data}`);
    })

    ffmpegProcessYoutube.stderr.on('data', (data) => {
        console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcessYoutube.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });

    socket.on('binarystream', stream => {
        console.log('Incoming binary stream', stream);
        if (instaStreamCode.length > 10) {
            ffmpegProcessInsta.stdin.write(stream, (err) => {
                console.log('Err', err);
            })
        }
        if (youtubeStreamCode.length > 10) {
            ffmpegProcessYoutube.stdin.write(stream, (err) => {
                console.log('Err', err);
            })
        }
    })
})




httpServer.listen(5000, () => console.log('App listining to port 5000'));