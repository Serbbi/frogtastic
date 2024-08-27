import { useState } from 'react';
import { useAuth } from '../../hooks/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './signup.css';

export default function Signup() {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });

    const auth = useAuth();
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
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

    return (
        <div className='mainContainerSignup'>
            <div className="formAndTitle">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmitEvent} className="formContainerSignup">
                    <div className='inputContainer'>
                        <input
                            className='inputField'
                            placeholder="Username"
                            onChange={handleInput}
                            name="username" />
                    </div>
                    <div className='inputContainer'>
                        <input
                            className='inputField'
                            placeholder="Email"
                            onChange={handleInput}
                            name="email" />
                    </div>
                    <div className='inputContainer'>
                        <input
                            className='inputField'
                            placeholder="Password"
                            onChange={handleInput}
                            name="password" 
                            type="password" />
                    </div>

                    <label className="errorLabel">{auth.getErrorMessage()}</label>

                    <button type="submit" className={"submitButton"}>Sign up</button>
                    <br />
                    <a href="/">Already have an account? Log in here!</a>
                </form>
            </div> 
        </div>
    );
};
