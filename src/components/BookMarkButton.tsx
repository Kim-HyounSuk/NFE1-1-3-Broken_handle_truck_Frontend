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
  const { bookmarks, isLoading, refetch } = useFetchBookmark();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!isLoading && _storeId) {
      setIsBookmarked(
        !!bookmarks.find((bookmark) => bookmark.storeId === _storeId),
      );
    }
  }, [isLoading]);

  // 북마크 post 함수 (등록/삭제)
  const handleBookmarkButtonClick = () => {
    if (_storeId) {
      postBookmark({ storeId: _storeId })
        .then((data) => {
          if (data.msg !== "ok") {
            throw new Error();
          }
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
        })
        .catch(() => {
          // 서버에서 보내주는 메시지가 사용자가 몰라도 되는 정보라 별도로 메시지 작성
          toast.error("북마크 처리에 실패했습니다.");
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
