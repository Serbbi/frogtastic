import { useContext, createContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "./OrganizationProvider";
import PropTypes from "prop-types";

const AuthContext = createContext();
const MAX_RETRIES = 10;

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	const [errorMessage, setErrorMessage] = useState("");
	const { setOrganization } = useOrganization();
	let retries = 1;

	const navigate = useNavigate();

	const loginAction = useCallback(async (data) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `username=${data.username}&password=${data.password}`,
			});
			const res = await response.json();

			if (res.access_token) {
				setUser(data.username);
				setToken(res.access_token);
				localStorage.setItem("site", res.access_token);
				localStorage.setItem("privileges", JSON.stringify(res.dict));
				if (res.organizations === null) { //just for the demo on railway
					res.organizations = [];
				}
				setOrganization("1");
				localStorage.setItem("orgs", res.organizations);
				localStorage.setItem("userId", res.id);
				localStorage.setItem("username", res.username);
				localStorage.setItem("email", res.email);
				navigate("/home");
				setErrorMessage("");
			} else {
				setErrorMessage(res.detail);
			}
		} catch (err) {
			if (err instanceof TypeError && retries < MAX_RETRIES) {
				console.error(err);
				setErrorMessage("Server is waking up, please wait a moment...");
				// loginAction(data); // retry 10 times till the server is up
				retries++;
			} else if (retries === MAX_RETRIES) {
				setErrorMessage("No response from server, please try again later or contact support.");
			} else {
				console.error(err);
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
			const res = await response.json();
			console.log(res);
			if (res.username) {
				loginAction(data);
			} else {
				setErrorMessage(res.detail);
			}
		} catch (err) {
			if (err instanceof TypeError && retries < MAX_RETRIES) {
				console.error(err);
				setErrorMessage("Server is waking up, please wait a moment...");
				// signUpAction(data); // retry 10 times till the server is up
				retries++;
			} else if (retries === MAX_RETRIES) {
				console.error(err);
				setErrorMessage("No response from server, please try again later or contact support.");
			} else {
				console.error(err);
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
