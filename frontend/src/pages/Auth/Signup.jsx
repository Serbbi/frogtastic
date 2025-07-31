import { useState, useEffect } from 'react';
import { useAuth } from '../../services/providers/AuthProvider';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateEmail, validateUsername, validatePassword, validateConfirmPassword } from '../../util/validation';
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
        if (auth.getErrorMessage().includes("Incorrect") || auth.getErrorMessage().includes("resource") || auth.getErrorMessage().includes("registered")) {
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

    return (
        <div className='main-container-auth'>
            <div className="right-container"></div>
            <div className="left-container"></div>
            <div className="center-container">
                <div className="center-right-container">
                    <form onSubmit={handleSubmitEvent} className="form-container">
                        <h2 className="form-title">Sign Up</h2>
                        <div className="input-group">
                            <div className='input-container'>
                                <input
                                    className='auth-input'
                                    placeholder="Username"
                                    onChange={handleInput}
                                    name="username"
                                    onBlur={validateUsername} />
                                <p className='error-text'></p>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className='input-container'>
                                <input
                                    className='auth-input'
                                    placeholder="Email"
                                    onChange={handleInput}
                                    name="email"
                                    type='email'
                                    onBlur={validateEmail} />
                                <p className='error-text'></p>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className='input-container'>
                                <input
                                    className='auth-input'
                                    placeholder="Password"
                                    onChange={handleInput}
                                    name="password"
                                    type={passwordVisibility ? "text" : "password"}
                                    onBlur={validatePassword} />
                                <button type="button" className='eye-button' onClick={() => togglePasswordVisibility("password")}>
                                    {passwordVisibility ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                </button>
                            </div>
                            <p className='error-text'></p>
                        </div>
                        <div className="input-group">
                            <div className='input-container'>
                                <input
                                    className='auth-input'
                                    placeholder="Confirm Password"
                                    onChange={handleInput}
                                    name="passwordConfirm"
                                    type={passwordConfirmVisibility ? "text" : "password"}
                                    onBlur={(event) => validateConfirmPassword(event, input)} />
                                <button type="button" className='eye-button' onClick={() => togglePasswordVisibility("passwordConfirm")}>
                                    {passwordConfirmVisibility ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                </button>
                            </div>
                            <p className='error-text'></p>
                        </div>

                        {auth.getErrorMessage() && <label className="error-label">{auth.getErrorMessage()}</label>}

                        <button type="submit" className="primary-button" disabled={isLoading}>
                            {isLoading &&
                                <span className='loader'></span>}
                            <span className={isLoading ? 'invisible' : ''}>Sign Up</span>
                        </button>
                        <p className="signup-prompt">Already have an account? <Link to="/" className="signup-link">Log in here!</Link></p>
                        {/* <p className="signup-prompt">By registering, you agree to our <Link to="/terms-of-service" target='_blank' className="signup-link">terms of service</Link>.</p> */}
                    </form>
                </div>
                <div className="center-left-container"></div>
            </div>
        </div>
    );
};
