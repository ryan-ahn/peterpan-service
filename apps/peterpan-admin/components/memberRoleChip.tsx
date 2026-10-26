import Chip from "@repo/ui/components/chip";

import type { MemberRole } from "@lib/adminData";

/**
 * constants
 */
export const MEMBER_ROLE_LABEL: Record<MemberRole, string> = {
  owner: "관리자",
  manager: "관리자",
  member: "회원",
};

/**
 * types
 */
type Props = {
  role: MemberRole;
};

/**
 * 회원 권한 칩. 오너도 관리자와 같게 보인다. 관리자는 gold, 일반 회원은 gray
 * @param role 오너·관리자·회원
 */
const MemberRoleChip = ({ role }: Props) => (
  <Chip
    variant={role === "member" ? "line" : "tint"}
    color={role === "member" ? "gray" : "gold"}
    size="small"
    text={MEMBER_ROLE_LABEL[role]}
  />
);

export default MemberRoleChip;
