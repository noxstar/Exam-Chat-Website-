import './Landing.css'
import React, { useState } from 'react';

import Login from './Login';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const Landing = (props) => {
    const { loggedIn, username, setLoggedIn, setusername, setIsAdmin } = props;
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const onLoginClick = () => {
        // Navigate to the login page
        navigate('/Login');
    };

    const onSignupClick = () => {
        // Navigate to the signup page
        navigate('/Signup');
    };
    const onChannelClick = () => {
        // Navigate to the channel page
        navigate('/ChannelPage');
    };

    const onLogoutClick = () => {
        // Clear user information
        setLoggedIn(false);
        setusername(null);
        setIsAdmin(false);

        // Show the logout success message
        setShowLogoutModal(true);

        // Redirect to the home page after a delay
        setTimeout(() => {
            navigate('/');
        }, 2000); // Redirect after 2 seconds (adjust as needed)
    };

    
    return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-3xl font-semibold mb-6">Welcome!</h1>
                <p className="mb-4">CMPT 353 Project</p>
                <p className="mb-4">Post questions and get answers from other users!</p>
                
                {loggedIn ? (
                  <div>
                    <button
                      className="blueButton"
                      onClick={onLogoutClick}
                    >
                      Log out
                    </button>
                    <div className="mb-2">Your username is {username}</div>
                    <button
                      className="blueButton"
                      onClick={onChannelClick}
                    >
                      Go to Channels
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                     className="blueButton"
                     onClick={onLoginClick}
                    >
                      Log in
                    </button>
                    <Link to="/signup">
                      <button
                        className="blueButton"
                        onClick={onSignupClick}
                      >
                        Sign up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
};

export default Landing;