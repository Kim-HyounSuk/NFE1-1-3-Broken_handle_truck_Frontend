import { useState, useEffect } from "react";
import { getBookmark } from "../apis/bookmark";
import useTitleStore from "../store/titleStore";
import useNotificationStore from "../store/notificationStore.ts";
import Card from "../components/Card";
import Heart from "../assets/images/heart.svg?react";
import NoBookMark from "../components/bookmark/NoBookMark";

// _id는 북마크 아이디
// storeId는 스토어 아이디
interface BookmarkItem {
  id: string;
  storeId: string;
  comments: number;
  name: string;
  isOpen: boolean;
  category: string;
}

export default function BookMarkPage() {
  const setTitle = useTitleStore((state) => state.setTitle);
  const { notificationList } = useNotificationStore();
  const [bookmark, setBookmark] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setTitle("북마크");
  }, []);

  // get 모든 북마크 데이터 저장
  useEffect(() => {
    const getBookmarkData = async () => {
      const res = await getBookmark();

      setBookmark(res.bookmarks as BookmarkItem[]);
    };

    getBookmarkData();
  }, [notificationList]);

  // 북마크 상태 업데이트 함수
  const handleBookmarkToggle = (storeId: string) => {
    setBookmark((prev) => {
      return prev.filter((item) => item.storeId !== storeId); // 기존 북마크 삭제
    });
  };

  return (
    <>
      {bookmark.length >= 1 ? (
        <div className="flex py-11 flex-col gap-y-8 mx-auto w-[calc(100%-50px)] sm:w-[calc(100%-230px)]">
          <p className="flex items-center">
            <Heart width={18} height={18} />
            <strong className="px-1 tracking-tight text-lg">
              나만의 푸드트럭
            </strong>
            <strong className="text-primary text-lg">{bookmark.length}</strong>
            <span className="text-lg">개</span>
          </p>
          {bookmark.map((data) => (
            <div key={data.name} className="flex flex-col">
              <Card
                info={data}
                bg="white"
                onBookmarkToggle={handleBookmarkToggle}
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
