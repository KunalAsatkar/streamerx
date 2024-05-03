import './Navbar.css'
import Profile from './Profile';
import { useState, useEffect } from 'react';
import profileImage from '../assets/profile.png';
import { Link, Outlet } from 'react-router-dom'
import axios from 'axios';
// import {GiHamburgerMenu} from 'react-icons/gi'


const Navbar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const handleClick = () => {
        // console.log(`showProfile`);
        setShowProfile(!showProfile);
    }
    const checkLoggedIn = async () => {
        const token = localStorage.getItem("jwt_token");
        console.log(token);
        const result = await axios.get('http://localhost:8000/auth/user', {
            headers:
            {
                "Content-Type": "appliation/json",
                "Authorization": token
            }
        })
            .then((response) => {
                console.log(response);
                setLoggedIn(true);
                return response.data.status
            })
            .catch((err) => {
                console.log(err);
                setLoggedIn(false);
                return false;
            });
        console.log(result, "Navbar");
        // setLoggedIn(result);
        return result;
    };
    useEffect(() => {
        const check = async () => {
            let result = await checkLoggedIn()
            setLoggedIn(result);
            // console.log(loggedIn);
        }
        check();
    }, []);
    // useEffect(() => {
    //     const check = async () => {
    //         let result = await checkLoggedIn()
    //         setLoggedIn(result);
    //     }
    //     check();
    // }, [loggedIn]);

    return (
        <div>
            <section className="navbar">

                <div className="logo">
                    <Link to={loggedIn ? `/wellcome` : `/`} className='link'>StreamerX</Link>
                </div>
                <div className="navigation">
                    <div>
                        <Link className="head link" to="/golive">GoLive</Link>
                    </div>
                    <div>
                        <Link className="head link" to="/videouploads">Videouploads</Link>
                    </div>
                    {/* <div>
                        <Link className="head link" to="/contact">Contact</Link>
                    </div> */}
                    {!loggedIn && (<div>
                        <Link className="head link" to="/auth">Login/Register</Link>
                    </div>)}
                    {loggedIn && (<div className="profile-container">
                        <button className="user-icon-button" onClick={handleClick} >
                            <img className="profile-image" src={profileImage} alt="" />
                        </button>
                        {showProfile && (<Profile
                            onLogout={checkLoggedIn} />)}
                    </div>)}
                </div>

            </section>
            <div><Outlet /></div>
        </div>
    );
}

export default Navbar;
