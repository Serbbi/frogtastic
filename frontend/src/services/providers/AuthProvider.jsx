import { useContext, createContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usersPostRequest } from "../api/users/UsersPost";
import { tokenPostRequest } from "../api/token/TokenPost";
import PropTypes from "prop-types";

const AuthContext = createContext();
const MAX_RETRIES = 10;

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	const [errorMessage, setErrorMessage] = useState("");
	const [shouldLoad, setShouldLoad] = useState(false);
	const navigate = useNavigate();
	let attempt = 1;

	const loginAction = useCallback(async (data) => {
		setShouldLoad(true);
		try {
			const response = await tokenPostRequest(data);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				if (response.status >= 400 && response.status < 500) {
					setShouldLoad(false);
					setErrorMessage(errorData.detail || "Sign up failed");
					return;
				}
				throw new Error(errorData.detail || "Login failed");
			}
			setShouldLoad(false);
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
				} else {
					errorMessage = "Temporary issue";
				}

				setErrorMessage(`${errorMessage} (attempt ${attempt}/${MAX_RETRIES})...`);
				const delay = Math.min(1000 * Math.pow(2, attempt++), 30000);
				await new Promise(resolve => setTimeout(resolve, delay));
				return loginAction(data);
			} else {
				setShouldLoad(false);
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
		setShouldLoad(true);
		try {
			const response = await usersPostRequest(data);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				if (response.status >= 400 && response.status < 500) {
					setShouldLoad(false);
					setErrorMessage(errorData.detail || "Sign up failed");
					return;
				}
				throw new Error(errorData.detail || "Sign up failed");
			}
			setShouldLoad(false);
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
				setShouldLoad(false);
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

	const getErrorMessage = useCallback(() => {
		return errorMessage;
	}, [errorMessage]);

	const getShouldLoad = useCallback(() => {
		return shouldLoad;
	}, [shouldLoad]);

	const value = useMemo(() => ({
		token,
		user,
		loginAction,
		signUpAction,
		getErrorMessage,
		getShouldLoad,
	}), [token, user, loginAction, signUpAction, getErrorMessage, getShouldLoad]);

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
