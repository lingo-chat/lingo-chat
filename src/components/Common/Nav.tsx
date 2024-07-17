import React from 'react';
import { Link } from 'react-router-dom';

const Nav: React.FC = () => {
	return (
		<div>
			<div className="nav">
				<Link className="navMenu" to={'/'}>
					HOME
				</Link>
				<Link className="navMenu" to={'/developer-info'}>
					개발자 정보
				</Link>
			</div>
		</div>
	);
};
export default Nav;
