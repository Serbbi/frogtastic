import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";


function Login() {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });
    // const navigate = useNavigate();

    const auth = useAuth();
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            auth.loginAction(input);
            return;
        }
        alert("pleae provide a valid input");
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Login</div>
        </div>
        <form onSubmit={handleSubmitEvent}>
            <input
                placeholder="Username"
                onChange={handleInput}
                name="username"/>
            <label className="errorLabel">{ }</label>

            <input
                placeholder="Password"
                onChange={handleInput}
                name="password"/>
            <label className="errorLabel">{ }</label>

            <button type="submit" className={"submitButton"}>Login</button>
        </form>
        <div>
            <a href="/signup">Don't have an account? Sign up here!</a>
        </div>
    </div>
}

export default Login