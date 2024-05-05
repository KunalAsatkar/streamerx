import React, { useState } from 'react'
import './platform.css';
import axios from 'axios';

export const Platforms = () => {

    const [isConnectedYt, setIsConnectedYt] = useState(false);
    const [isConnectedInsta, setIsConnectedInsta] = useState(false);
    // const [user, setUser] = useState(null);

    const connectWithYT = () => {
        const url = new URL('http://localhost:3000/auth/google/callback');
        url.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.readonly');
        url.searchParams.append('scope', 'profile');
        // window.open('http://localhost:3000/auth/google/callback', '_self');
        window.location.href = url.toString();
        isConnectedYt(true);
    }

    // useEffect(() => {
    //   const user = axios.get('/api/user', userId);
    //   if(user.connectedYt) setIsConnectedYt(true);
    //   if(user.connectedInsta) setIsConnectedInsta(true);
    // }, [])
    

  return (
    <div className='platform-container'>
        <div className="yt">
            <p className='yt-title'>Youtube</p>
            <div className="connected-detail">
                <div className="isconnected">{isConnectedYt ? "Connected" : <button onClick={connectWithYT}>Connect</button>}</div>
                <div className="isConnected-yt"></div>
            </div>
        </div>
        <div className="insta">
            <p className='insta-title'>Instagram</p>
            <div className="connected-detail">
                <div className="isConnected">{isConnectedInsta ? "Connected" : <button>Connect</button>}</div>
                <div className="isConnected-insta"></div>
            </div>
        </div>
        
    </div>
  )
}
