import { useEffect } from 'react';
import useTitleStore from '../store/titleStore';
import PinkNoti from '../assets/images/pinkNoti.svg?react';
import Message from '../components/Message';
import Logo from '../assets/images/pinkLogo.svg?react';
import useNotificationStore from '../store/notificationStore';
import { categoryImages } from '../assets/images/category';

export default function NotificationPage() {
    const setTitle = useTitleStore((state) => state.setTitle);
    const { notificationList, postNotificationAsRead, postAllAsRead } = useNotificationStore();

    useEffect(() => {
        setTitle('알림');
    }, []);

    return (
        <>
            {notificationList.length > 0 ? (
                <div className="flex flex-col gap-y-5 py-11 mx-auto w-[calc(100%-50px)] sm:w-[calc(100%-230px)]">
                    <div className="flex justify-between items-center">
                        <p className="flex items-center tracking-tighter mb-2">
                            <PinkNoti width={18} height={18} />
                            <strong className="px-1 tracking-tight text-lg">알림</strong>
                            <strong className="text-primary text-lg">{notificationList.length}</strong>
                            <span className="text-lg">개</span>
                        </p>
                        <button
                            onClick={postAllAsRead}
                            className="border-1 border-primary rounded-lg py-1 px-5 tracking-tighter text-primary text-sm"
                        >
                            모두 읽음
                        </button>
                    </div>
                    {notificationList.map((notification, idx) => (
                        <Message
                            onClick={() => postNotificationAsRead(notification._id)}
                            key={idx}
                            data={notification}
                            ImgComponent={categoryImages[notification.sender.category].component}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-full flex justify-center items-center mx-auto w-[calc(100%-100px)] sm:w-[calc(100%-200px)]">
                    <div className="flex flex-col gap-y-2 justify-center items-center tracking-tighter">
                        <Logo width={120} height={120} />
                        <div className="text-center text-2xl sm:text-3xl font-point">
                            받은 알림이 없습니다.
                            <br />
                            <span className="font-point text-primary">사장님</span>을 기다려주세요!
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
