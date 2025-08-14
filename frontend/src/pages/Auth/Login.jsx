import { useState, useEffect } from "react";
import { useAuth } from "../../services/providers/AuthProvider";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import "./Login.css";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState({
        username: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const auth = useAuth();
    const { restoreSession } = auth;
    const errorMessage = auth.getErrorMessage();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            restoreSession(token);
        }
    }, [restoreSession]);

    useEffect(() => {
        if (errorMessage.match(/Incorrect|resource|failed/)) {
            setIsLoading(false);
        }
    }, [errorMessage]);


    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            setIsLoading(true);
            auth.setErrorMessage("");
            auth.loginAction(input, rememberMe);
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

    return <div className="main-container-auth">
        <div className="left-container"></div>
        <div className="right-container"></div>
        <div className="center-container">
            <div className="center-left-container"></div>
            <div className="center-right-container">
                <form onSubmit={handleSubmitEvent} className="form-container">
                    <h2 className="form-title">Log In</h2>
                    <input
                        className="auth-input"
                        placeholder="Username"
                        onChange={handleInput}
                        name="username" />

                    <input
                        className="auth-input"
                        placeholder="Password"
                        onChange={handleInput}
                        name="password"
                        type="password" />
                    {auth.getErrorMessage() &&
                        <label className="error-label">{auth.getErrorMessage()}</label>
                    }

                    <div className="log-in-options">
                        <label onChange={() => setRememberMe(!rememberMe)} className="remember-me-container">
                            <input type="checkbox" className="remember-me-checkbox" />
                            <span className="remember-me-label">Remember me</span>
                        </label>
                        <Link to="/user/password/reset" onClick={() => console.log("yo")} className="forgot-password-link">Forgot password?</Link>
                    </div>

                    <button type="submit" className="primary-button auth-button" disabled={isLoading}>
                        {isLoading &&
                            <span className='loader'></span>}
                        <span className={isLoading ? 'invisible' : ''}>Log In</span>
                    </button>
                    <p className="signup-prompt">Don't have an account? <Link to="/signup" className="signup-link">Register here!</Link></p> {/*TODO: Abort any requests made to the server if we change pages*/}
                </form>
                <div className="google-separator">
                    <hr className="line-separator" />
                    or log in with
                    <hr className="line-separator" />
                </div>
                <GoogleLoginButton />
            </div>
        </div>
    </div>
}