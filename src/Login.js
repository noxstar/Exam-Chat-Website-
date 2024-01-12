import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import './Login.css';
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    console.log('Login component rendered');

    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [usernameError, setusernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        // Set the app element for the modal
        Modal.setAppElement('#root'); // You need to replace '#root' with the appropriate selector for your root element
      }, []);
    

    const navigate = useNavigate();

    const onButtonClick = async () => {
        console.log('Button clicked!');

        // Set initial error values to empty
        setusernameError("");
        setPasswordError("");
        

        // Check if the user has entered both fields correctly
        if (username === "") {
            setusernameError("Please enter your Username");
            return;
        }

        if (password === "") {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        // Make API request for user authentication (login)
        try {
            const response = await fetch('http://localhost:8086/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: encodeURIComponent(username),
                    password: encodeURIComponent(password),
                }),
            });

            console.log('Response:', response);

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful. Result:', result);

                // Assuming your backend sends userId and isAdmin in the response
                const { userId,username, isAdmin } = result;

                // Update the state or context with user information
                props.setLoggedIn(true);
                props.setUserId(userId); 
                props.setusername(username);
                props.setIsAdmin(isAdmin);

                // Store user information in localStorage
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);
                localStorage.setItem('isAdmin', isAdmin);

                // Set the success message
                setShowSuccessModal(true);
                // Redirect to another page (e.g., home page) after a delay
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Redirect after 2 seconds (adjust as needed)
            } else {
                const errorResult = await response.json();
                setShowErrorModal(true);
                console.error('Authentication error:', errorResult.error);
            }
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Login</div>
            </div>
            <br />
            
            <div className={"inputContainer"}>
                <input
                    value={username}
                    placeholder="Enter your Username here"
                    onChange={(ev) => setusername(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{usernameError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={"inputBox"}
                    type="password"

                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className="blueButton"
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"}
                />
            </div>
            <Modal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
                contentLabel="Successful Login"
                className="modal"
            >
                <h2>Successful Login!</h2>
                <p>You are now logged in.</p>
            </Modal>
            <Modal
                isOpen={showErrorModal}
                onRequestClose={() => setShowErrorModal(false)}
                contentLabel="Login Error"
                className="modal"
            >
                <h2>Login Error</h2>
                <p>Invalid credentials. Please check your username and password.</p>
            </Modal>
        </div>
    );
};

export default Login;