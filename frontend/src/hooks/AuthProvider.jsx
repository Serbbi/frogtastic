import { useContext, createContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	const [errorMessage, setErrorMessage] = useState("");
	const [privileges, setPrivileges] = useState(localStorage.getItem("privileges") || "");
	const navigate = useNavigate();

	const signUpAction = async (data) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: data.username, hashed_password: data.password, attributes: {}, organizations: []}),
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
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/token`, {
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
				setPrivileges(res.dict);
				localStorage.setItem("site", res.access_token);
				localStorage.setItem("privileges", JSON.stringify(res.dict));
				localStorage.setItem("orgs", res.organizations);
				localStorage.setItem("userId", res.id);
				localStorage.setItem("username", data.username);
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

	function getErrorMessage() {
		return errorMessage;
	}

	function getPrivileges() {
		return privileges;
	}

	const value = useMemo(() => ({
		token, 
		user, 
		loginAction, 
		logOut, 
		signUpAction, 
		getErrorMessage, 
		getPrivileges
	}), [token, user, loginAction, logOut, signUpAction, getErrorMessage, getPrivileges]);
	
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
