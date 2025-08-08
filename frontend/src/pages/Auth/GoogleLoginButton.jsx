import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../services/providers/AuthProvider';

export default function GoogleLoginButton() {
    const auth = useAuth();

    const login = useGoogleLogin({
        onSuccess: tokenResponse => handleLogin(tokenResponse),
        onError: error => console.error('Google Login Failed:', error),
    });

    function handleLogin(tokenResponse) {
        console.log(tokenResponse);
        auth.googleLoginAction(tokenResponse.access_token);
    }

    return (
        <button
            onClick={() => login()}
            className="google-login-btn"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/1920px-Google_Favicon_2025.svg.png"
                alt="Google Logo"
                style={{ width: '18px', marginRight: '8px', verticalAlign: 'middle' }}
            />
            Google
        </button>
    );
}
