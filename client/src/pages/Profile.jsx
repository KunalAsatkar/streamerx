import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const Profile = (props) => {
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
            const token = localStorage.getItem('jwt_token');

            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('userId');
            localStorage.removeItem('fname');
            localStorage.removeItem('token_expiry');
            
            const resp = await axios.get('http://localhost:8000/auth/logout', {
                headers: {
                    "Authorization": token,
                }
            });

            // navigate('/');
            window.location.href = '/';
        } catch (error) {
            console.log('Error while loggin out: ', error);
        }
    }

return (
    <div id="user-profile" className="user-profile-card">
        <div className="popup-menu">
            <div className="profile-card">
                <p>Welcome</p>
                <Link to={`/dashboard/${username}`} className='link' >{username}</Link>
                <Link to={`/${username}/createEvent`} className='link'>CreateEvent </Link>
                <Link onClick={handleLogOut} className="link" to="/">Log Out </Link>
            </div>
        </div>
    </div>
)
}

export default Profile;