import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/providers/AuthProvider";
import "./Login.css";
import { Link, NavLink } from "react-router-dom";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState({
        username: "",
        password: "",
    });
    const auth = useAuth();
    const logInButtonCroaks = ["Log In", "Croak", "Oac", "Croak but in german", "Croack but in italian", "Croack but in spanish", "Croack but in french", "Croack but in portuguese", "Croack but in russian", "Croack but in chinese", "Croack but in japanese", "Croack but in korean", "Croack but in arabic", "Croack but in hindi", "Croack but in bengali", "Croack but in punjabi", "Croack but in urdu", "Croack but in turkish", "Croack but in vietnamese", "Croack but in thai", "Croack but in swahili", "Croack but in dutch", "Croack but in greek", "Croack but in hebrew", "Croack but in swedish", "Croack but in danish", "Croack but in norwegian", "Croack but in finnish", "Croack but in icelandic", "Croack but in hungarian", "Croack but in czech", "Croack but in slovak", "Croack but in polish", "Croack but in ukrainian", "Croack but in belarusian", "Croack but in bulgarian"];

    useEffect(() => {
        if (auth.getErrorMessage().includes("Incorrect") || auth.getErrorMessage().includes("resource")) {
            setIsLoading(false);
        }
    }, [auth.getErrorMessage()]);

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            setIsLoading(true);
            auth.setErrorMessage("");
            auth.loginAction(input);
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

    return <div className={"mainContainerLogin"}>
        <div className="leftContainer">
            <img src="https://i.pinimg.com/736x/ab/c4/8b/abc48b4afe75a9c72f5cc162e6bf2be9.jpg" alt="logo"
                className="rotate" width={100} />
        </div>
        <div className="rightContainer">
            {/* <NavLink to="/changelog" className="changeLogButton">CHANGE LOG</NavLink> */}
            <h2>Log In</h2>
            <form onSubmit={handleSubmitEvent} className="formContainer">
                <input
                    className={"inputField"}
                    placeholder="Username"
                    onChange={handleInput}
                    name="username" />

                <input
                    className={"inputField"}
                    placeholder="Password"
                    onChange={handleInput}
                    name="password"
                    type="password" />
                <label className="errorLabel">{auth.getErrorMessage()}</label>

                <button type="submit" className="primary-button" disabled={isLoading}>
                    {isLoading &&
                        <span className='loader'></span>}
                    <span className={isLoading ? 'invisible' : ''}>Log In</span>
                </button>
            </form>
            <Link to="/user/password/reset" onClick={() => console.log("yo")}>Forgot your password?</Link>
            <div>
                <p>Don't have an account? <Link to="/signup">Register here!</Link></p> {/*TODO: Abort any requests made to the server if we change pages*/}
            </div>
        </div>
    </div>
}