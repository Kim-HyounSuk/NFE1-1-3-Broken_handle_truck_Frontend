import { useEffect } from 'react';
import useTitleStore from '../store/titleStore';
import useNotificationStore from '../store/notificationStore.ts';
import useFetchBookmark from '../hooks/useFetchBookmark.ts';
import Card from '../components/Card';
import NoBookMark from '../components/bookmark/NoBookMark';
import Heart from '../assets/images/heart.svg?react';

export default function BookMarkPage() {
    const setTitle = useTitleStore((state) => state.setTitle);
    const { notificationList } = useNotificationStore();
    const { bookmarks, refetch } = useFetchBookmark();

    useEffect(() => {
        setTitle('북마크');
    }, []);

    // 알림 발생하면 refetch
    useEffect(() => {
        refetch();
    }, [notificationList]);

    return (
        <>
            {bookmarks.length >= 1 ? (
                <div className="flex py-11 flex-col gap-y-5 mx-auto w-[calc(100%-50px)] sm:w-[calc(100%-230px)]">
                    <p className="flex items-center mb-2">
                        <Heart width={18} height={18} />
                        <strong className="px-1 tracking-tight text-lg">나만의 푸드트럭</strong>
                        <strong className="text-primary text-lg">{bookmarks.length}</strong>
                        <span className="text-lg">개</span>
                    </p>
                    {bookmarks.map((data) => (
                        <div key={data.name} className="flex flex-col">
                            <Card
                                info={data}
                                bg="white"
                                // onBookmarkToggle={handleBookmarkToggle}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex justify-center items-center mx-auto w-[calc(100%-50px)] sm:w-[calc(100%-230px)]">
                    <NoBookMark />
                </div>
            )}
        </>
    );
}
