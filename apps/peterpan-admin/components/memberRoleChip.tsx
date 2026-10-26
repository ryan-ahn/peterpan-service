import Chip, { type Color } from "@repo/ui/components/chip";

import type { MemberRole } from "@lib/adminData";

/**
 * constants
 */
export const MEMBER_ROLE_LABEL: Record<MemberRole, string> = {
  owner: "슈퍼 관리자",
  super: "슈퍼 관리자",
  manager: "관리자",
  member: "회원",
};

const ROLE_COLOR: Record<MemberRole, Color> = {
  owner: "gold",
  super: "gold",
  manager: "primary",
  member: "gray",
};

/**
 * types
 */
type Props = {
  role: MemberRole;
};

/**
 * 회원 권한 칩. 오너도 슈퍼 관리자와 같게 보인다. 슈퍼 관리자 gold, 관리자 primary, 일반 회원 gray
 * @param role 오너·슈퍼 관리자·관리자·회원
 */
const MemberRoleChip = ({ role }: Props) => (
  <Chip
    variant={role === "member" ? "line" : "tint"}
    color={ROLE_COLOR[role]}
    size="small"
    text={MEMBER_ROLE_LABEL[role]}
  />
);

export default MemberRoleChip;
