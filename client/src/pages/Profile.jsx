import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate, Link } from "react-router-dom";

const Profile = ({ user }) => {
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
<<<<<<< HEAD
                    {/* <Link to={`/dashboard/${username}`} className='link' >{username}</Link> */}
                    <p>{username}</p>
                    {/* <Link to={`/${username}/createEvent`} className='link'>CreateEvent </Link> */}
=======
                    <Link to={`/dashboard/${user.username}`} className='link' >{user.username}</Link>
                    {/* <Link to={`/${user.username}/createEvent`} className='link'>CreateEvent </Link> */}
>>>>>>> 0cba77c07b6e67039d36bd2457913a2087df4905
                    <Link onClick={handleLogOut} className="link" to="/">Log Out </Link>
                </div>
            </div>
        </div>
    )
}

Profile.propTypes = {
    user: PropTypes.any.isRequired,
};

export default Profile;