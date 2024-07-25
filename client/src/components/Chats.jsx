import { useState, useRef, useEffect, useCallback } from 'react'
import { FaYoutube, FaInstagramSquare } from "react-icons/fa";
import { fetchLiveChat, getYtTokenAndChatId } from '../services/liveChatService';
import PropTypes from 'prop-types';

const Chats = ({ userId, startChatTrigger }) => {
    const [liveChats, setLiveChats] = useState([]);
    const chatContianerRef = useRef(null);
    const [intervalId, setIntervalId] = useState(null);
    const [nextPageToken, setNextPageToken] = useState('');

    const startChats = useCallback(async () => {
        const { ytAccessToken, liveChatId } = getYtTokenAndChatId(userId);

        const fetchChats = async () => {
            try {
                const chats = await fetchLiveChat(ytAccessToken, liveChatId, nextPageToken, setNextPageToken);
                setLiveChats((prevChats) => [ ...prevChats, ...chats]);
            } catch (error) {
                console.error('Error fetching live chats:', error);
            }
        }
        
        if(ytAccessToken && liveChatId) {
            fetchChats();
            const interval = setInterval(fetchChats, 3000);
            setIntervalId(interval);
        }

    }, [userId, nextPageToken]);

    useEffect(() => {
        if (startChatTrigger) {
            startChats();
        }
        else {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [startChatTrigger, intervalId, startChats]);


    return (
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
    );
}

export default Chats;

Chats.propTypes = {
    userId: PropTypes.string.isRequired,
    startChatTrigger: PropTypes.bool.isRequired,
}