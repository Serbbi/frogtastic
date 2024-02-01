import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	const [errorMessage, setErrorMessage] = useState("");
	const [privileges, setPrivileges] = useState(localStorage.getItem("privileges") || "");
	const navigate = useNavigate();

	const signUpAction = async (data) => {
		try {
			const response = await fetch("http://127.0.0.1:8000/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: data.username, hashed_password: data.password }),
			});
			const res = await response.json();
			console.log(res);
			if(res.username) {
				loginAction(data);
			} else {
				setErrorMessage(res.detail);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const loginAction = async (data) => {
		try {
			const response = await fetch("http://127.0.0.1:8000/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `username=${data.username}&password=${data.password}`,
			});
			const res = await response.json();
			console.log(res);
			if (res.access_token) {
				setUser(data.username);
				setToken(res.access_token);
				setPrivileges(res.privileges);
				localStorage.setItem("site", res.access_token);
				localStorage.setItem("privileges", JSON.stringify(res.privileges));
				navigate("/home");
			} else {
				setErrorMessage(res.detail);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const logOut = () => {
		setUser(null);
		setToken("");
		localStorage.removeItem("site");
		navigate("/login");
	};

	const getErrorMessage = () => {
		return errorMessage;
	};

	const getPrivileges = () => {
		return privileges;
	}

	return (
		<AuthContext.Provider value={{ token, user, loginAction, logOut, signUpAction, getErrorMessage, getPrivileges }}>
			{children}
		</AuthContext.Provider>
	);

};

export default AuthProvider;

export const useAuth = () => {
	return useContext(AuthContext);
};
