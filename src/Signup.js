import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const onSignUpClick = async () => {
        // Reset errors
        setUsernameError('');
        setPasswordError('');
        setShowSuccessModal(false);
        setShowErrorModal(false);

        // Validate form fields
        if (username === '') {
            setUsernameError('Please enter a username');
            return;
        }

        // Check username availability
    const checkUsernameResponse = await fetch('http://localhost:8086/checkUsernameAvailability', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: encodeURIComponent(username),
        }),
    });

    const checkUsernameResult = await checkUsernameResponse.json();

    if (checkUsernameResponse.ok) {
        // Username is available, proceed with registration
        if (password === '') {
            setPasswordError('Please enter a password');
            return;
        }

        if (password.length < 7) {
            setPasswordError('The password must be 7 characters or longer');
            return;
          }

        // Make API request to sign up
        fetch('http://localhost:8086/SignUp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: encodeURIComponent(username),
              password: encodeURIComponent(password),
            }),
          })
      .then((response) => {
        if (response.ok) {
          // Registration successful
          console.log('User registered successfully');
          setShowSuccessModal(true);

          
         

        } else {
          return response.json().then((errorResult) => {
            // Handle registration errors
            console.error('Registration error:', errorResult.error);
            setShowErrorModal(true);
          });
        }
      })
      .catch((error) => {
        console.error('Error during registration:', error);
      });
    } else {
        // Username is already taken, show an error
        setUsernameError('Username is already taken');
    }


        
  };

        
    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Sign Up</div>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={username}
                    placeholder="Enter your Username here"
                    onChange={(ev) => setUsername(ev.target.value)}
                    className="inputBox"
                />
                <label className="errorLabel">{usernameError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="inputBox"
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    className="inputButton"
                    type="button"
                    onClick={onSignUpClick}
                    value="Sign Up"
                />
            </div>
            <Modal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
                contentLabel="Sign Up Successful"
                className="modal"
            >
                <h2>Sign Up Successful!</h2>
                <p>You have been registered.</p>
                <div>
                    <p>Do you want to proceed to login?</p>
                    <button onClick={() => navigate('/Login')}>Login</button>
                </div>
            </Modal>

            <Modal
                isOpen={showErrorModal}
                onRequestClose={() => setShowErrorModal(false)}
                contentLabel="Sign Up Error"
                className="modal"
            >
                <h2>Sign Up Error</h2>
                <p>There was an error during registration. Please try again.</p>
            </Modal>
         </div>
    );
};

export default SignUp;