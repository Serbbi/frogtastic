import { useState } from 'react';
import { useAuth } from '../../hooks/AuthProvider';
import './signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Signup() {
    const [input, setInput] = useState({
        username: "",
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
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmitEvent} className="formContainerSignup">
                <div className='inputContainer'>
                    <input
                        className='inputField'
                        placeholder="Username"
                        onChange={handleInput}
                        name="username" />
                    <div className='icon'>
                        <FontAwesomeIcon icon="fa-solid fa-circle-question" />
                        <span className='tooltiptext'>You can use your name e.g. John Cena</span>
                    </div>
                </div>
                <div className='inputContainer'>
                    <input
                        className='inputField'
                        placeholder="Password"
                        onChange={handleInput}
                        name="password" />
                    <div className='icon'>
                        <FontAwesomeIcon icon="fa-solid fa-circle-question" />
                        <span className='tooltiptext'>Whatever password you like</span>
                    </div>
                </div>

                <label className="errorLabel">{auth.getErrorMessage()}</label>

                <button type="submit" className={"submitButton"}>Sign up</button>
            </form>
            <div>
                <a href="/">Already have an account? Log in here!</a>
            </div>
        </div>
    );
};
