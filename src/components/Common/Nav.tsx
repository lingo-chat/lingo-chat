import React from 'react';
import { Link } from 'react-router-dom';
import { CiHome, CiFaceSmile } from 'react-icons/ci';

const Nav: React.FC = () => {
	return (
		<div>
			<div className="nav">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<CiHome style={{ margin: '10px' }} />
					<Link className="navMenu" to={'/'}>
						HOME
					</Link>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<CiFaceSmile style={{ margin: '10px' }} />
					<Link className="navMenu" to={'/developer-info'}>
						개발자 정보
					</Link>
				</div>
			</div>
		</div>
	);
};
export default Nav;
