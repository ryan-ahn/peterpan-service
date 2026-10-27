import Skeleton from "@repo/ui/components/skeleton";
import cn from "@repo/ui/lib/cn";

import { adminPanelClass } from "@constants/adminUi";

/**
 * constants
 */
const ROW_COUNT = 5;

/**
 * 관리 화면 이동 중 본문 자리 표시. 목록 화면의 헤더·검색·표 스켈레톤과 맞춘다
 */
const AdminRouteSkeleton = () => {
  // render
  return (
    <div className="flex flex-col gap-5" aria-busy="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className={cn(adminPanelClass, "overflow-hidden p-0")}>
        <Skeleton className="h-11 w-full rounded-none bg-gray-50" />
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div key={index} className="border-t border-gray-100 px-4 py-3.5">
            <Skeleton className="h-4 w-full max-w-40" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRouteSkeleton;
