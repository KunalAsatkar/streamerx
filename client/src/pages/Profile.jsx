import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const Profile = (props) => {
    const navigate = useNavigate();
    const handleLogOut = async () => {
        // console.log("handleLogOut");
        const token = localStorage.getItem('jwt_token');

        await axios.get('http://localhost:8000/auth/logout', {
            headers: {
                "Authorization": token
            }
        })
            .then((response) => {
                console.log("logged out");
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('userId');
                localStorage.removeItem('fname');
                localStorage.removeItem('token_expiry');
                // props.onLogout();
                // navigate('/');
                window.location.href = '/';
            })
            .catch((err) => {
                console.log(err.message);
            })
    }
    const username = localStorage.getItem("username");
    // console.log(username);
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