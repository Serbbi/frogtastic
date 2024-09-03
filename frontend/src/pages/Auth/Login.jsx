import React, { useState } from "react";
import { useAuth } from "../../services/providers/AuthProvider";
import "./Login.css";

function Login() {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const auth = useAuth();
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
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
            className="rotate" width={100}/>
        </div>
        <div className="rightContainer">
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
                    type="password"/>
                <label className="errorLabel">{auth.getErrorMessage()}</label>

                <button type="submit" className={"submitButton"}>Log In</button>
            </form>
            {/* <a href="/user/password/reset">Forgot your password?</a> */}
            <div>
                <p>Don't have an account? <a href="/signup">Register here!</a></p>
            </div>
        </div>
    </div>
}

export default Login;