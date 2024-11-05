import { useQuery } from "@tanstack/react-query";
import { getStoreList } from "../apis/store.ts";
import useStoresStore from "../store/storesStore.ts";
import type { StoreListApiResponse } from "../types/store";

export default function useFetchStores() {
  const { category, name, lat, lon } = useStoresStore();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["stores", { category, name, lat, lon }],
    queryFn: () => getStoreList({ category, name, lat, lon }),
    select: (data: StoreListApiResponse) => data.stores,
    refetchInterval: 1000 * 60, // 1분?
  });

  return { data, isLoading, refetch };
}
