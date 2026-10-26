"use client";

import { useState } from "react";

import Avatar from "@repo/ui/components/avatar";
import Chip from "@repo/ui/components/chip";
import Modal from "@repo/ui/components/modal";
import { useToast } from "@repo/ui/components/toast";
import Text from "@repo/ui/text";

import { useAdminHeader } from "@components/adminFrame";
import AdminPageHeader from "@components/adminPageHeader";
import AdminPager from "@components/adminPager";
import AdminTable, { type AdminColumn } from "@components/adminTable";
import MemberRoleChip, { MEMBER_ROLE_LABEL } from "@components/memberRoleChip";
import {
  ADMIN_PAGE_SIZE,
  adminPanelClass,
  adminTextErrorColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import {
  type Member,
  type MemberRole,
  listMembers,
  setManager,
} from "@lib/adminData";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const FILTERS: PermissionFilter[] = ["all", "manager", "member"];

const COLUMNS: AdminColumn<Member>[] = [
  {
    key: "name",
    label: "회원",
    render: member => (
      <div className="flex items-center gap-2.5">
        <Avatar name={member.name} src={member.avatarUrl} size="small" />
        <div className="flex min-w-0 flex-col">
          <Text variant="label-3">{member.name}</Text>
          <Text variant="caption-2" color={adminTextLabelColor}>
            {member.email ?? "이메일 없음"}
          </Text>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    label: "권한",
    className: "whitespace-nowrap",
    render: member => <MemberRoleChip role={member.role} />,
  },
  {
    key: "action",
    label: "",
    className: "whitespace-nowrap text-right text-gray-600",
    render: member => readActionText(member.role),
  },
];

/**
 * types
 */
type PermissionFilter = Exclude<MemberRole, "owner"> | "all";

type ReadMembersParams = {
  search: string;
  page: number;
  filter: PermissionFilter;
};

type ManagerConfirmSectionProps = {
  member: Member;
  onClose: () => void;
  onChanged: () => void;
};

/**
 * pre-root runtime
 */
const readMembers = (params: ReadMembersParams) => {
  const { search, page, filter } = params;
  return listMembers({ search, page, role: filter });
};

/**
 * screen — 권한 관리. 오너가 관리자를 지정·해제한다
 */
const PermissionsScreen = () => {
  // hooks
  const list = useAdminList({ initialFilter: "all", load: readMembers });
  useAdminHeader({
    value: list.search,
    placeholder: "이름, 이메일",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // states
  const [selected, setSelected] = useState<Member | null>(null);
  // variables
  const total = list.result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  // handlers
  const handleRowClick = (member: Member) => {
    if (member.role === "owner") {
      return;
    }
    setSelected(member);
  };
  const handleConfirmClose = () => {
    setSelected(null);
  };
  const handleConfirmChanged = () => {
    setSelected(null);
    list.handleReload();
  };
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="권한 관리"
        description="회원을 눌러 관리자로 지정하거나 해제합니다. 관리자는 권한 관리를 뺀 관리 화면을 씁니다. 고정 표시된 계정은 바꿀 수 없어요."
      />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(filter => (
          <Chip
            key={filter}
            variant={list.filter === filter ? "contain" : "line"}
            color="gray"
            text={`${filter === "all" ? "전체" : MEMBER_ROLE_LABEL[filter]} ${list.result?.counts[filter] ?? 0}`}
            isSelected={list.filter === filter}
            onClick={() => list.handleFilterChange(filter)}
          />
        ))}
      </div>
      {list.error ? (
        <Text variant="caption-1" color={adminTextErrorColor}>
          {list.error}
        </Text>
      ) : null}
      <section className={adminPanelClass}>
        <AdminTable
          columns={COLUMNS}
          rows={list.result?.items ?? []}
          emptyText="조건에 맞는 회원이 없어요."
          isLoading={list.isLoading}
          readRowKey={member => member.id}
          onRowClick={handleRowClick}
        />
        <AdminPager
          page={list.page}
          pageCount={pageCount}
          total={total}
          unit="명"
          onChange={list.setPage}
        />
      </section>
      {selected ? (
        <ManagerConfirmSection
          key={selected.id}
          member={selected}
          onClose={handleConfirmClose}
          onChanged={handleConfirmChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 관리자 지정·해제 확인
 */
const ManagerConfirmSection = ({
  member,
  onClose,
  onChanged,
}: ManagerConfirmSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [isSaving, setIsSaving] = useState(false);
  // variables
  const isManager = member.role === "manager";
  // handlers
  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await setManager({ id: member.id, isManager: !isManager });
      toast.show({
        text: isManager ? "관리자 권한을 해제했어요." : "관리자로 지정했어요.",
        variant: "success",
      });
      onChanged();
    } catch (saveError) {
      toast.show({
        text:
          saveError instanceof Error
            ? saveError.message
            : "권한을 바꾸지 못했어요.",
        variant: "error",
      });
      setIsSaving(false);
    }
  };
  // render
  return (
    <Modal
      isOpen
      title={isManager ? "관리자 권한을 해제할까요?" : "관리자로 지정할까요?"}
      description={
        isManager
          ? `${member.name} 님은 더 이상 관리 화면에 들어올 수 없어요.`
          : `${member.name} 님이 권한 관리를 뺀 모든 관리 화면을 쓸 수 있어요.`
      }
      secondaryButton={{
        text: "취소",
        isDisabled: isSaving,
        onClick: onClose,
      }}
      primaryButton={{
        text: isManager ? "해제" : "지정",
        color: isManager ? "danger" : undefined,
        isLoading: isSaving,
        onClick: handleConfirm,
      }}
      onClose={onClose}
    />
  );
};

/**
 * utils
 */
const readActionText = (role: MemberRole) => {
  if (role === "owner") {
    return "고정";
  }
  return role === "manager" ? "관리자 해제" : "관리자 지정";
};

export default PermissionsScreen;
