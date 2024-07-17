import React from 'react';

interface GoogleLoginButtonProps {
	onLoginClick: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLoginClick }) => {
	return (
		<div className="google-login">
			<button className="loginButton" onClick={onLoginClick}>
				Login with Google
			</button>
		</div>
	);
};

export default GoogleLoginButton;
