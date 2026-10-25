import type { ReactNode } from "react";

import Text from "@repo/ui/text";

import { adminTextHeadingColor, adminTextLabelColor } from "@constants/adminUi";

/**
 * types
 */
type Props = {
  title: string;
  description: string;
  actions?: ReactNode;
};

/**
 * 관리 화면 제목 줄
 * @param title 화면 이름
 * @param description 한 줄 설명
 * @param actions 오른쪽 버튼(작성 등)
 */
const AdminPageHeader = ({ title, description, actions }: Props) => {
  // render
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1">
        <Text as="h1" variant="heading-3" color={adminTextHeadingColor}>
          {title}
        </Text>
        <Text variant="body-3" color={adminTextLabelColor}>
          {description}
        </Text>
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
};

export default AdminPageHeader;
