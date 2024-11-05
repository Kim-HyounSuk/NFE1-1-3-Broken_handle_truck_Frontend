import { create, StateCreator } from 'zustand';
import { INotification } from '../types/notification';
import { getNotificationList, postNotificationAsRead, postNotificationAsReadAll } from '../apis/notification';
import { toast } from 'react-toastify';

interface Notification {
	type: 'NEW_NOTIFICATION';
	data: INotification;
}

interface NotificationStore {
	notificationList: INotification[];
	isNewNotification: boolean;
	isConnected: boolean;
	manualClose: boolean;
	initializeSocket: (userId: string) => void;
	closeSocket: () => void;
	postAllAsRead: () => Promise<void>;
	postNotificationAsRead: (notification: string) => void;
	setManualClose: (value: boolean) => void;
}

const notificationStore: StateCreator<NotificationStore> = (set, get) => {
	let socket: WebSocket | null = null;

	const connectSocket = (userId: string) => {
		if (get().isConnected || get().manualClose) {
			return;
		}

		const apiURL = import.meta.env.VITE_API_URL as string;
		const customURL = apiURL.substring(5);
		const wsURL = `wss${customURL}?userId=${userId}`;

		socket = new WebSocket(wsURL);
		set({ isConnected: true, manualClose: false });

		socket.onopen = () => {
			console.log('Websocket이 연결되었습니다.');
		};

		socket.onmessage = (event) => {
			const newNotification = JSON.parse(event.data) as Notification;

			set((state) => ({
				notificationList: [newNotification.data, ...state.notificationList],
				isNewNotification: true,
			}));

			toast.success('알림이 도착했습니다.');
		};

		socket.onclose = () => {
			set({ isConnected: false });
			socket = null;

			if (!get().manualClose) {
				setTimeout(() => connectSocket(userId), 1000);
			}
		};

		socket.onerror = (error) => {
			console.error('Websocket 오류 발생:', error);
			set({ isConnected: false });
			socket?.close();
			socket = null;

			if (!get().manualClose) {
				setTimeout(() => connectSocket(userId), 1000);
			}
		};
	};

	return {
		notificationList: [],
		isNewNotification: false,
		isConnected: false,
		manualClose: false,

		initializeSocket: async (userId) => {
			// 수동 종료 상태가 아닐 때만 소켓 초기화
			if (get().manualClose || get().isConnected) return;

			const data = await getNotificationList();
			const unreadNotifications = (data.notifications || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
			set({
				notificationList: unreadNotifications,
				isNewNotification: unreadNotifications.length > 0,
			});

			// 기존에 열려 있는 소켓이 있다면 닫기
			if (socket) {
				socket.close();
				socket = null;
			}

			connectSocket(userId);
		},

		closeSocket: () => {
			if (socket) {
				set({ manualClose: true, isConnected: false });
				socket.close();
				socket = null;
			}
		},

		postAllAsRead: async () => {
			const res = await postNotificationAsReadAll();

			if (res.msg === 'ok') {
				set({
					notificationList: [],
					isNewNotification: false,
				});
				toast.success('모든 알림을 읽음 처리 하였습니다.');
			} else {
				toast.error(`${res.msg}`);
			}
		},

		postNotificationAsRead: async (notificationId) => {
			const res = await postNotificationAsRead({ notificationId });

			if (res.msg === 'ok') {
				set((state) => ({
					notificationList: state.notificationList.filter((notification) => notification._id !== notificationId),
					isNewNotification: state.notificationList.some((notification) => notification._id !== notificationId),
				}));
				toast.success('읽음 처리 되었습니다.');
			} else {
				toast.error(`${res.msg}`);
			}
		},

		setManualClose: (value: boolean) => {
			set({ manualClose: value });
		},
	};
};

const useNotificationStore = create<NotificationStore>(notificationStore);

export default useNotificationStore;
