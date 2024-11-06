import React, { useEffect } from 'react';
import useUserStore from '../../store/userStore';
import MainPage from '../../pages/MainPage';
import { getAuthValidation } from '../../apis/auth';
import { useNavigate } from 'react-router-dom';

export default function MainGuard(): React.ReactElement {
	const { setUser, user } = useUserStore();
	const navigate = useNavigate();

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
		} else {
			navigate('/map');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return <MainPage />;
}
