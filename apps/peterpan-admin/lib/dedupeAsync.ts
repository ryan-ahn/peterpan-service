/**
 * 같은 키로 겹쳐 호출된 비동기 작업은 진행 중인 Promise를 공유한다.
 * 개발 Strict Mode가 effect를 두 번 돌려도 네트워크는 한 번만 나간다
 */

const pools = new Map<string, Promise<unknown>>();

export const dedupeAsync = async <T>(
  key: string,
  run: () => Promise<T>,
): Promise<T> => {
  const pending = pools.get(key);
  if (pending) {
    return pending as Promise<T>;
  }
  const promise = run().finally(() => {
    if (pools.get(key) === promise) {
      pools.delete(key);
    }
  });
  pools.set(key, promise);
  return promise;
};
