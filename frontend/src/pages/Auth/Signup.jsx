import { useState, useEffect } from 'react';
import { useAuth } from '../../services/providers/AuthProvider';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateEmail, validateUsername, validatePassword } from '../../util/validation';
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

                        <button type="submit" className="primary-button" disabled={isLoading}>
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
