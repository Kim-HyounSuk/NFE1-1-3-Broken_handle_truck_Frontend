import React, { useEffect } from 'react';
import useUserStore from '../../store/userStore';
import { Outlet, useNavigate } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import { getAuthValidation } from '../../apis/auth';

export default function AuthGaurd(): React.ReactElement {
	const { setUser, user } = useUserStore();
	const navigate = useNavigate();
	const { initializeSocket, closeSocket, manualClose, setManualClose } = useNotificationStore();

	const validateAuth = async () => {
		const data = await getAuthValidation();
		if (data.msg === 'ok') {
			setUser(data.user);
		} else {
			setUser(null);
			navigate('/login');
		}
	};

	useEffect(() => {
		if (!user) {
			validateAuth();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (user) {
			initializeSocket(user._id);
		}
	}, [user, manualClose, initializeSocket]);

	useEffect(() => {
		return () => {
			closeSocket();
			setManualClose(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Outlet />;
}
