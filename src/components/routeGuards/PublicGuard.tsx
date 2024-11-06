import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import { useEffect } from 'react';
import { getAuthValidation } from '../../apis/auth';

export default function PublicGuard(): React.ReactElement {
	const { user, setUser } = useUserStore();
	const navigate = useNavigate();
	const location = useLocation();

	const validateAuth = async () => {
		const data = await getAuthValidation();
		if (data.msg === 'ok') {
			setUser(data.user);
		} else {
			setUser(null);
		}
	};

	useEffect(() => {
		if (!user) {
			validateAuth();
		} else if (location.pathname === '/login' || location.pathname === '/signup') {
			navigate('/map');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, location.pathname]);

	return <Outlet />;
}
