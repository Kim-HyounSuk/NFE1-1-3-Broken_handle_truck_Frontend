import { useSearch } from "../../hooks/useSearch";
import SearchIcon from "../../assets/images/searchIcon.svg?react";
import SearchCancelIcon from "../../assets/images/searchCancel.svg?react";

export default function Search() {
  const { searchTerm, inputHandler, clickHandler, searchHandler } = useSearch();

  return (
    <div className="w-[calc(100%-50px)] sm:w-[calc(100%-200px)] mx-auto flex absolute items-center border border-category rounded-lg gap-2 top-6 left-1/2 -translate-x-1/2 z-10 bg-white px-2 py-3">
      <SearchIcon className="w-6 h-6" />
      <input
        className="w-full text-base border-none outline-none tracking-tighter"
        type="text"
        placeholder="트럭 이름 입력 후 엔터 (전설의 붕어빵 -> 붕어빵(O), 붕어(O), 의 붕(O), 의붕(X))"
        value={searchTerm}
        onChange={inputHandler}
        onKeyDown={searchHandler}
      />
      {searchTerm && (
        <SearchCancelIcon onClick={clickHandler} className="cursor-pointer" />
      )}
    </div>
  );
}
