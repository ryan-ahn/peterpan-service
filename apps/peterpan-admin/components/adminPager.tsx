import Pagination from "@repo/ui/components/pagination";
import Text from "@repo/ui/text";

import { adminTextLabelColor } from "@constants/adminUi";

/**
 * types
 */
type Props = {
  page: number;
  pageCount: number;
  total: number;
  unit: string;
  onChange: (page: number) => void;
};

/**
 * 목록 아래 개수와 쪽 번호
 * @param page 현재 쪽(1부터)
 * @param pageCount 전체 쪽 수
 * @param total 전체 개수
 * @param unit 개수 단위(명·건)
 * @param onChange 쪽 변경
 */
const AdminPager = ({ page, pageCount, total, unit, onChange }: Props) => {
  // render
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
      <Text variant="caption-1" color={adminTextLabelColor}>
        총 {total.toLocaleString("ko-KR")}
        {unit}
      </Text>
      <Pagination page={page} pageCount={pageCount} onChange={onChange} />
    </div>
  );
};

export default AdminPager;
