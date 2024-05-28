import React, { useState, useEffect } from 'react'
import './platform.css';
import axios from 'axios';

export const Platforms = () => {

    const [isConnectedYt, setIsConnectedYt] = useState(false);
    const [isConnectedInsta, setIsConnectedInsta] = useState(false);
    const [userId, setUserId] = useState(window.localStorage.getItem('userId'));

    const connectWithYT = async () => {
        const url = new URL('http://localhost:8000/auth/google');
        url.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.readonly');
        url.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube');
        url.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.force-ssl');
        window.open('http://localhost:8000/auth/google/callback', '_self');
        window.location.href = url.toString();
        // console.log(userId);
        
        isConnectedYt(true);
    }

    const connectWithInsta = async () => {
        const url = new URL('http://localhost:8000/auth/instagram');
        window.open('http://localhost:8000/auth/instagram/callback', '_self');
        window.location.href = url.toString();
        isConnectedInsta(true);
    }

    const disconnectWithYT = async () => {
        try {
            const resp = await axios.post('http://localhost:8000/auth/google/disconnect', { userId });
            console.log(resp);
            if(resp.status === 200) isConnectedYt(false);
        } catch (error) {
            console.log('Error in disconnecting youtube');
        }
    }

    useEffect(() => {
        async function getUser() {
            try {
                const user = await axios.get('http://localhost:8000/auth/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window.localStorage.getItem('jwt_token')
                    }
                });
                console.log("User", user.data.data);
                if(user.data.data.googleRefreshToken) setIsConnectedYt(true);
                // if(user.data.data.connectedInsta) setIsConnectedInsta(true);
                
            } catch (error) {
                console.log(error, "Error in getting user");
            }
        }

        getUser();
    }, [])
    

  return (
    <div className='platform-container'>
        <div className="yt">
            <p className='yt-title'>Youtube</p>
            <div className="connected-detail">
                {
                    isConnectedYt ?
                        <div className="isconnected"><button onClick={disconnectWithYT}>Disconnect</button></div>
                    :
                    <div className="isconnected"><button onClick={connectWithYT}>Connect</button></div>
                }
                {/* <div className="isConnected-yt"></div> */}
            </div>
        </div>
        {/* <div className="insta">
            <p className='insta-title'>Instagram</p>
            <div className="connected-detail">
                <div className="isConnected">{isConnectedInsta ? "Connected" : <button onClick={connectWithInsta}>Connect</button>}</div>
                <div className="isConnected-insta"></div>
            </div>
        </div> */}
        
    </div>
  )
}
