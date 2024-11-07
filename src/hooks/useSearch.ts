import { useState, useEffect } from "react";
import useStoresStore from "../store/storesStore.ts";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { setSearchTerm: setKeyword } = useStoresStore();
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    // input 값에 변경이 있을 때 빈 값이라면 setKeyword('')로 설정
    if (!e.target.value) {
      setKeyword("");
    }
  };

  // 렌더링 시 setKeyword('')으로 설정
  useEffect(() => {
    setKeyword("");
  }, []);

  const clickHandler = () => {
    setSearchTerm("");
    setKeyword("");
  };

  const searchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setKeyword(searchTerm);
    }
  };

  return { searchTerm, inputHandler, clickHandler, searchHandler };
};
