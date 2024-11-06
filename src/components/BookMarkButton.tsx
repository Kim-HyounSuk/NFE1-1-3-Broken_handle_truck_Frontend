import StarIcon from "../assets/images/star.svg?react";
import { useEffect, useState } from "react";
import { postBookmark } from "../apis/bookmark.ts";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useFetchBookmark from "../hooks/useFetchBookmark.ts";

interface BookMarkButtonProps {
  onClick?: () => void;
  storeId?: string;
  size?: number;
}

export default function BookMarkButton({
  storeId,
  size = 20,
}: BookMarkButtonProps) {
  const { id } = useParams<{ id: string }>();
  const _storeId = storeId || id || "";
  const { bookmarks, refetch } = useFetchBookmark();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (_storeId) {
      setIsBookmarked(
        !!bookmarks.find((bookmark) => bookmark.storeId === _storeId),
      );
    }
  }, []);

  // 북마크 post 함수 (등록/삭제)
  const handleBookmarkButtonClick = () => {
    if (_storeId) {
      postBookmark({ storeId: _storeId })
        .then((data) => {
          setIsBookmarked((prev) => !prev); // 로컬 상태 업데이트
          refetch(); // 리스트 호출
          return data.bookmark;
        })
        .then((isBookmarked) => {
          if (isBookmarked) {
            toast.success("북마크에 추가되었습니다.");
          } else {
            toast.success("북마크에 삭제되었습니다.");
          }
        });
    }
  };

  return (
    <div onClick={handleBookmarkButtonClick} className="relative">
      <StarIcon
        width={size}
        height={size}
        className={`cursor-pointer ${isBookmarked ? "stroke-yellow-300 fill-yellow-300" : "stroke-[#f0f0f0] fill-[#f0f0f0]"}`}
      />
    </div>
  );
}
