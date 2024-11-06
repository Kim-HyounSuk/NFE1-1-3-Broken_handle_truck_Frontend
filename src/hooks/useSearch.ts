import { useState } from "react";
import useStoresStore from "../store/storesStore.ts";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { setSearchTerm: setKeyword } = useStoresStore();
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value); // input change 값 확인용
    setSearchTerm(e.target.value);
  };

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
