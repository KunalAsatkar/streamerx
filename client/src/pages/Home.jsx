import './Home.css'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/golive');
    }
    return (
        <div className="home">
            <div className="hero-section">
                <div className="tagline">
                    <p>Discover Meaningful Creativity to Make a Difference.</p>
                </div>
                <div className="cta-section">
                    <div className="join-us">
                        <span>click here to stream</span>
                        <button className="join-button" onClick={handleClick} role="button">Studio</button>
                    </div>
                    <div className="message">
                        <p >Join our vibrant community of streamers and organizations </p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home;