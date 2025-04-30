import { useContext, createContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();
const MAX_RETRIES = 10;

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	let attempt = 1;

	const loginAction = useCallback(async (data) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `username=${data.username}&password=${data.password}`,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.detail || "Login failed");
			}
			const res = await response.json();

			if (res.access_token) {
				setUser(data.username);
				setToken(res.access_token);
				localStorage.setItem("site", res.access_token);
				localStorage.setItem("privileges", JSON.stringify(res.dict));
				if (res.organizations === null) { //just for the demo on railway
					res.organizations = [];
				}
				localStorage.setItem("orgs", res.organizations);
				localStorage.setItem("userId", res.id);
				localStorage.setItem("username", res.username);
				localStorage.setItem("email", res.email);
				navigate("/home");
				setErrorMessage("");
			} else {
				setErrorMessage(res.detail || "Login failed");
			}
		} catch (err) {
			if (attempt < MAX_RETRIES) {
				let errorMessage = "";

				if (err instanceof TypeError) {
					errorMessage = "Network issue";
				} else if (err instanceof SyntaxError) {
					errorMessage = "Invalid server response";
				} else if (err.message) {
					if (err.message.includes("Incorrect")) {
						setErrorMessage("Incorrect username or password");
						return;
					}
					errorMessage = err.message;
				} else {
					errorMessage = "Temporary issue";
				}

				setErrorMessage(`${errorMessage} (attempt ${attempt}/${MAX_RETRIES})...`);
				const delay = Math.min(1000 * Math.pow(2, attempt++), 30000);
				await new Promise(resolve => setTimeout(resolve, delay));
				return loginAction(data);
			} else {
				if (err.message) {
					setErrorMessage(err.message);
				} else if (err instanceof TypeError) {
					setErrorMessage("Could not connect to server");
				} else {
					setErrorMessage("Login failed");
				}
			}
		}
	}, [navigate]);

	const signUpAction = useCallback(async (data) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: data.username,
					hashed_password: data.password,
					email: data.email,
					attributes: {},
					organizations: []
				}),
			});
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.detail || "Sign up failed");
			}
			const res = await response.json();

			if (res.username) {
				loginAction(data);
			} else {
				setErrorMessage(res.detail || "Sign up failed");
			}
		} catch (err) {
			if (attempt < MAX_RETRIES) {
				let errorMessage = "";

				if (err instanceof TypeError) {
					errorMessage = "Network issue";
				} else if (err instanceof SyntaxError) {
					errorMessage = "Invalid server response";
				} else if (err.message) {
					errorMessage = err.message;
				} else {
					errorMessage = "Temporary issue";
				}

				setErrorMessage(`${errorMessage} (attempt ${attempt}/${MAX_RETRIES})...`);
				const delay = Math.min(1000 * Math.pow(2, attempt++), 30000);
				await new Promise(resolve => setTimeout(resolve, delay));
				return signUpAction(data);
			} else {
				if (err.message) {
					setErrorMessage(err.message);
				} else if (err instanceof TypeError) {
					setErrorMessage("Could not connect to server");
				} else {
					setErrorMessage("Login failed");
				}
			}
		}
	}, [loginAction]);

	const logOut = useCallback(() => {
		setUser(null);
		setToken("");
		localStorage.removeItem("site");
		navigate("/login");
	}, [navigate]);

	const getErrorMessage = useCallback(() => {
		return errorMessage;
	}, [errorMessage]);

	const value = useMemo(() => ({
		token,
		user,
		loginAction,
		logOut,
		signUpAction,
		getErrorMessage,
		setErrorMessage,
	}), [token, user, loginAction, logOut, signUpAction, getErrorMessage, setErrorMessage]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
