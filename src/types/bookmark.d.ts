import { BaseApiResponse } from "./response";

// GET	bookmark
interface IBookmarkListItem {
  _id: string;
  storeId: string;
  comments: number;
  name: string;
  isOpen: boolean;
  category: string;
}

interface BookmarkListApiResponse extends BaseApiResponse {
  bookmarks: IBookmarkListItem[];
}

// POST	bookmark
interface IBookmark {
  _id: string;
  userId: string;
  storeId: string;
}

interface PostBookmarkApiParams {
  storeId: string;
}

interface PostBookmarkResponse extends BaseApiResponse {
  bookmark: IBookmark;
}

export type {
  IBookmarkListItem,
  BookmarkListApiResponse,
  IBookmark,
  PostBookmarkApiParams,
  PostBookmarkResponse,
};
