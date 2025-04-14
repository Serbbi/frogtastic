import { useState, useEffect } from 'react';
import { useAuth } from '../../services/providers/AuthProvider';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Signup.css';

export default function Signup() {
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordConfirmVisibility, setPasswordConfirmVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const auth = useAuth();

    useEffect(() => {
        if (auth.getErrorMessage().includes("Incorrect") || auth.getErrorMessage().includes("resource")) {
            setIsLoading(false);
        }
    }, [auth.getErrorMessage()]);

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.password !== input.passwordConfirm) {
            alert("passwords do not match");
            return
        }

        if (input.username !== "" && input.password !== "") {
            setIsLoading(true);
            auth.signUpAction(input);
            return;
        }
        alert("please provide a valid input");
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function togglePasswordVisibility(name) {
        if (name === "password") {
            setPasswordVisibility(!passwordVisibility);
        } else {
            setPasswordConfirmVisibility(!passwordConfirmVisibility);
        }
    }

    function validateEmail(e) {
        const email = e.target.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email === "") {
            e.target.nextElementSibling.textContent = "Please fill out this field.";
        } else if (!emailRegex.test(email)) {
            e.target.nextElementSibling.textContent = "Please enter an email address.";
        } else {
            e.target.nextElementSibling.textContent = "";
            e.target.classList.remove("errorInput");
        }
        if (e.target.nextElementSibling.textContent !== "") {
            e.target.classList.add("errorInput");
        }
    }

    function validateUsername(e) {
        const username = e.target.value;
        const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
        if (username === "") {
            e.target.nextElementSibling.textContent = "Please fill out this field.";
        } else if (username.length < 3) {
            e.target.nextElementSibling.textContent = "Username must be at least 3 characters long.";
        } else if (!usernameRegex.test(username)) {
            e.target.nextElementSibling.textContent = "Username can only contain letters, numbers, periods, underscores, and dashes.";
        } else {
            e.target.nextElementSibling.textContent = "";
            e.target.classList.remove("errorInput");
        }

        if (e.target.nextElementSibling.textContent !== "") {
            e.target.classList.add("errorInput");
        }
    }

    function validatePassword(e) {
        const password = e.target.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (password === "") {
            e.target.parentElement.nextElementSibling.textContent = "Please fill out this field.";
        } else if (password.length < 8) {
            e.target.parentElement.nextElementSibling.textContent = "Password must be at least 8 characters long.";
        } else if (!passwordRegex.test(password)) {
            e.target.parentElement.nextElementSibling.textContent = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
        } else {
            e.target.parentElement.nextElementSibling.textContent = "";
            e.target.classList.remove("errorInput");
        }

        if (e.target.parentElement.nextElementSibling.textContent !== "") {
            e.target.classList.add("errorInput");
        }
    }

    function validateConfirmPassword(e) {
        const password = e.target.value;
        if (password === "") {
            e.target.parentElement.nextElementSibling.textContent = "Please fill out this field.";
        } else if (password !== input.password) {
            e.target.parentElement.nextElementSibling.textContent = "Passwords do not match.";
        } else {
            e.target.parentElement.nextElementSibling.textContent = "";
            e.target.classList.remove("errorInput");
        }

        if (e.target.parentElement.nextElementSibling.textContent !== "") {
            e.target.classList.add("errorInput");
        }
    }

    return (
        <div className='mainContainerSignup'>
            <div className="leftSignUp">
                <div className="formAndTitle">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmitEvent} className="formContainerSignup">
                        <div className="inputGroup">
                            <div className='inputContainer'>
                                <input
                                    className='inputField'
                                    placeholder="Username"
                                    onChange={handleInput}
                                    name="username"
                                    onBlur={validateUsername} />
                                <p className='errorText'></p>
                            </div>
                        </div>
                        <div className="inputGroup">
                            <div className='inputContainer'>
                                <input
                                    className='inputField'
                                    placeholder="Email"
                                    onChange={handleInput}
                                    name="email"
                                    type='email'
                                    onBlur={validateEmail} />
                                <p className='errorText'></p>
                            </div>
                        </div>
                        <div className="inputGroup">
                            <div className='inputContainer'>
                                <input
                                    className='inputField'
                                    placeholder="Password"
                                    onChange={handleInput}
                                    name="password"
                                    type={passwordVisibility ? "text" : "password"}
                                    onBlur={validatePassword} />
                                <button type="button" className='eyeButton' onClick={() => togglePasswordVisibility("password")}>
                                    {passwordVisibility ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                </button>
                            </div>
                            <p className='errorText'></p>
                        </div>
                        <div className="inputGroup">
                            <div className='inputContainer'>
                                <input
                                    className='inputField'
                                    placeholder="Confirm Password"
                                    onChange={handleInput}
                                    name="passwordConfirm"
                                    type={passwordConfirmVisibility ? "text" : "password"}
                                    onBlur={validateConfirmPassword} />
                                <button type="button" className='eyeButton' onClick={() => togglePasswordVisibility("passwordConfirm")}>
                                    {passwordConfirmVisibility ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                </button>
                            </div>
                            <p className='errorText'></p>
                        </div>

                        <label className="errorLabel">{auth.getErrorMessage()}</label>

                        <button type="submit" className={"submitButton"} disabled={isLoading}>
                            {isLoading &&
                                <span className='loader'></span>}
                            <span className={isLoading ? 'invisible' : ''}>Sign Up</span>
                        </button>
                        <p>Already have an account? <Link to="/">Log in here!</Link></p>
                        <p>By registering, you agree to our<Link to="/terms-of-service" target='_blank' style={{ fontSize: '0.8rem' }}>terms of service</Link>.</p>
                    </form>
                </div>
            </div>
            <div className="rightSignUp">

            </div>

        </div>
    );
};
