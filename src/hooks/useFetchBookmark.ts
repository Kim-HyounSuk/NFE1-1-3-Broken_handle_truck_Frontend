import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getBookmark } from "../apis/bookmark.ts";
import type { BookmarkListApiResponse } from "../types/bookmark";

export default function useFetchBookmark() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bookmark"],
    queryFn: () =>
      getBookmark().then((data) => {
        if (data.msg !== "ok") {
          toast.error(data.msg);
        }
        return data;
      }),
    select: (data: BookmarkListApiResponse) => data.bookmarks,
  });

  return {
    bookmarks: data || [],
    isLoading,
    refetch,
  };
}
