import { useEffect, useState } from 'react';
import axios from 'axios';

const GetVidoes = () => {
    console.log("getvideos");
    const [videos, setVideos] = useState([]);
    const getVideos = async () => {
        const result = await axios.get('http://localhost:5000/awareness')
            .then((response) => {
                console.log(response);
                return response.data.body;
            })
            .catch((err) => {
                console.log(err);
                return [];
            })
        console.log(result, "result");
        return result;
    }

    useEffect(() => {
        const fetch = async () => {
            const result = await getVideos();
            setVideos(result);
        }
        fetch();
    }, [])
    return (
        <div>
            {
                videos.map((video) => {
                    return (<div>
                        <p>{video.title}</p>
                        <video width="320" height="240" controls>
                            <source src={video.location} type="video/ogg" />
                        </video>
                        {/* <img src= /> */}
                    </div>)
                })
            }
        </div>
    )
}

export default GetVidoes;