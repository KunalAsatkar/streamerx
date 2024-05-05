import axios from 'axios';
import { useState } from 'react';
import GetVidoes from './GetVidoes';
const Videouploads = () => {
    const [video, setVideo] = useState(null);
    const [data, setData] = useState({ title: "" });

    const handleVideoUpload = async () => {
        const formData = new FormData();
        formData.append('video', video);
        formData.append('title', data.title);
        const response = await axios.post('http://localhost:8000/awareness', formData)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
        // console.log(response.data);
    };
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <div className='video-upload'>
            <section className='video-upload-section'>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                />
                <label htmlFor="title">Title</label>
                <input value={data.title} onChange={changeHandler} name="title" placeholder="Title" />
            </section>
            <section className='video-upload-section'>   
                <button onClick={handleVideoUpload}>Upload Video</button>
            </section>
            <GetVidoes className='events' />
        </div>
    );
};


export default Videouploads;