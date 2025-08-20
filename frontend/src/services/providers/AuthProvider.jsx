import { useContext, createContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import * as AuthService from '../api/auth/authService';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(sessionStorage.getItem("token") || "");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleLoginSuccess = useCallback((res, rememberMe = false) => {
		setUser(res.username);
		setToken(res.access_token);

		sessionStorage.setItem("token", res.access_token);
		sessionStorage.setItem("privileges", JSON.stringify(res.dict || {}));
		sessionStorage.setItem("orgs", res.organizations || []);
		sessionStorage.setItem("userId", res.id);
		sessionStorage.setItem("username", res.username);
		sessionStorage.setItem("email", res.email);

		if (rememberMe) {
			localStorage.setItem("token", res.access_token);
		}

		if (res.organizations.length === 0) {
			navigate("/home/join-organization");
		} else {
			navigate("/home/upload-image");
		}

		setErrorMessage("");
	}, [navigate]);

	const loginAction = useCallback(async (data, rememberMe = false) => {
		try {
			const res = await AuthService.login(data);
			handleLoginSuccess(res, rememberMe);
		} catch (err) {
			setErrorMessage(err.message);
		}
	}, [handleLoginSuccess]);

	const signUpAction = useCallback(async (data) => {
		try {
			const res = await AuthService.signUp(data);
			if (res.username) {
				await loginAction(data);
			} else {
				setErrorMessage("Sign up failed");
			}
		} catch (err) {
			setErrorMessage(err.message);
		}
	}, [loginAction]);

	const restoreSession = useCallback(async (storedToken) => {
		try {
			const res = await AuthService.validateToken(storedToken);
			handleLoginSuccess({ ...res, access_token: storedToken, dict: res.attributes });
		} catch (err) {
			console.warn("Session restoration failed:", err.message);
			localStorage.clear();
			sessionStorage.clear();
		}
	}, [handleLoginSuccess]);

	const googleLoginAction = useCallback(async (google_token) => {
		try {
			const res = await AuthService.googleLogin(google_token);
			handleLoginSuccess(res, true); // always remember for Google
		} catch (err) {
			console.error(err);
			setErrorMessage(err.message);
		}
	}, [handleLoginSuccess]);

	const getErrorMessage = useCallback(() => errorMessage, [errorMessage]);

	const functions = useMemo(() => ({
		loginAction,
		signUpAction,
		restoreSession,
		googleLoginAction,
		getErrorMessage,
		setErrorMessage,
	}), [loginAction, signUpAction, restoreSession, googleLoginAction, getErrorMessage, setErrorMessage]);

	const value = useMemo(() => ({
		token,
		user,
		...functions
	}), [token, user, functions]);

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
