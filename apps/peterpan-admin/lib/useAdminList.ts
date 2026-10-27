"use client";

import { useCallback, useEffect, useState } from "react";

import { dedupeAsync } from "@lib/dedupeAsync";

/**
 * types
 */
type LoadArgs<F extends string> = {
  search: string;
  page: number;
  filter: F;
};

type Loaded<R, F extends string> = LoadArgs<F> & {
  reloadKey: number;
  result: R | null;
  error: string | null;
};

type UseAdminListParams<R, F extends string> = {
  initialFilter: NoInfer<F>;
  load: (args: LoadArgs<F>) => Promise<R>;
};

/**
 * 관리 목록 공통 상태. 검색어·필터·쪽을 들고, 바뀔 때마다 `load`로 다시 읽는다.
 * `load`는 렌더마다 새로 만들지 않도록 모듈 수준 함수로 넘긴다.
 */
const useAdminList = <R, F extends string>(
  params: UseAdminListParams<R, F>,
) => {
  const { initialFilter, load } = params;
  // states
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<F>(initialFilter);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState<Loaded<R, F> | null>(null);
  // variables
  const isLoading =
    !loaded ||
    loaded.search !== query ||
    loaded.filter !== filter ||
    loaded.page !== page ||
    loaded.reloadKey !== reloadKey;
  // handlers
  const handleSearchSubmit = useCallback(() => {
    setPage(1);
    setQuery(search.trim());
  }, [search]);
  const handleFilterChange = (next: F) => {
    setPage(1);
    setFilter(next);
  };
  const handleReload = () => {
    setReloadKey(current => current + 1);
  };
  // effects
  useEffect(() => {
    let isCancelled = false;
    const args = { search: query, page, filter };
    const key = `${load.name}:${reloadKey}:${JSON.stringify(args)}`;
    dedupeAsync(key, () => load(args))
      .then(result => {
        if (!isCancelled) {
          setLoaded({ ...args, reloadKey, result, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setLoaded(current => ({
            ...args,
            reloadKey,
            result: current?.result ?? null,
            error:
              error instanceof Error
                ? error.message
                : "목록을 불러오지 못했어요.",
          }));
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [load, query, page, filter, reloadKey]);
  return {
    search,
    filter,
    page,
    result: loaded?.result ?? null,
    error: loaded?.error ?? null,
    isLoading,
    setSearch,
    setPage,
    handleSearchSubmit,
    handleFilterChange,
    handleReload,
  };
};

export default useAdminList;
