"use client";

import { useState } from "react";

import Avatar from "@repo/ui/components/avatar";
import Checkbox from "@repo/ui/components/checkbox";
import Chip from "@repo/ui/components/chip";
import Modal from "@repo/ui/components/modal";
import RadioGroup, { type Option } from "@repo/ui/components/radioGroup";
import { useToast } from "@repo/ui/components/toast";
import Text from "@repo/ui/text";

import { useAdminHeader, useAdminSelf } from "@components/adminFrame";
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
  type MemberRoleFilter,
  listMembers,
  setMemberRole,
} from "@lib/adminData";
import {
  ADMIN_MENUS,
  ADMIN_MENU_IDS,
  ADMIN_MENU_LABEL,
  type AdminMenuId,
} from "@lib/adminMenu";
import type { AdminSelf } from "@lib/adminSession";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const FILTERS: PermissionFilter[] = ["all", "super", "manager", "member"];

const ROLE_OPTIONS: Option<MemberRoleFilter>[] = [
  { value: "member", label: MEMBER_ROLE_LABEL.member },
  { value: "manager", label: MEMBER_ROLE_LABEL.manager },
  { value: "super", label: MEMBER_ROLE_LABEL.super },
];

const LOCK_LABEL: Record<LockReason, string> = {
  owner: "고정",
  self: "본인",
  super: "오너만 변경",
};

const LOCK_MESSAGE: Record<LockReason, string> = {
  owner: "이 계정의 권한은 바꿀 수 없어요.",
  self: "내 권한은 바꿀 수 없어요.",
  super: "슈퍼 관리자 권한은 오너만 바꿀 수 있어요.",
};

/**
 * types
 */
type PermissionFilter = MemberRoleFilter | "all";

type LockReason = "owner" | "self" | "super";

type ReadMembersParams = {
  search: string;
  page: number;
  filter: PermissionFilter;
};

type PermissionEditSectionProps = {
  member: Member;
  isOwner: boolean;
  onClose: () => void;
  onChanged: () => void;
};

type ReadLockReasonParams = {
  member: Member;
  self: AdminSelf;
};

type ReadSavedTextParams = {
  before: Member["role"];
  after: MemberRoleFilter;
};

/**
 * pre-root runtime
 */
const readMembers = (params: ReadMembersParams) => {
  const { search, page, filter } = params;
  return listMembers({ search, page, role: filter });
};

/**
 * screen — 권한 관리. 슈퍼 관리자가 관리자를 등록·해제하고 메뉴 권한을 준다. 슈퍼 관리자 지정은 오너만
 */
const PermissionsScreen = () => {
  // hooks
  const self = useAdminSelf();
  const toast = useToast();
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
  const columns: AdminColumn<Member>[] = [
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
      key: "menus",
      label: "메뉴 권한",
      className: "text-gray-600",
      render: member => readMenuText(member),
    },
    {
      key: "action",
      label: "",
      className: "whitespace-nowrap text-right text-gray-600",
      render: member => {
        const lockReason = readLockReason({ member, self });
        return lockReason ? LOCK_LABEL[lockReason] : "권한 설정";
      },
    },
  ];
  // handlers
  const handleRowClick = (member: Member) => {
    const lockReason = readLockReason({ member, self });
    if (lockReason) {
      toast.show({ text: LOCK_MESSAGE[lockReason], variant: "info" });
      return;
    }
    setSelected(member);
  };
  const handleEditClose = () => {
    setSelected(null);
  };
  const handleEditChanged = () => {
    setSelected(null);
    list.handleReload();
  };
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="권한 관리"
        description="회원을 눌러 관리자로 등록하고 쓸 수 있는 메뉴를 고릅니다. 슈퍼 관리자는 모든 메뉴와 권한 관리를 쓰며, 슈퍼 관리자 지정·해제는 오너만 할 수 있어요."
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
          columns={columns}
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
        <PermissionEditSection
          key={selected.id}
          member={selected}
          isOwner={self.role === "owner"}
          onClose={handleEditClose}
          onChanged={handleEditChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 권한·메뉴 권한 바꾸기
 */
const PermissionEditSection = ({
  member,
  isOwner,
  onClose,
  onChanged,
}: PermissionEditSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [role, setRole] = useState<MemberRoleFilter>(
    member.role === "owner" ? "super" : member.role,
  );
  const [menus, setMenus] = useState<AdminMenuId[]>(
    member.role === "manager" ? member.menus : ADMIN_MENU_IDS,
  );
  const [isSaving, setIsSaving] = useState(false);
  // variables
  const roleOptions = isOwner
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter(option => option.value !== "super");
  const isManager = role === "manager";
  const isAllMenus = menus.length === ADMIN_MENU_IDS.length;
  const isMenuMissing = isManager && menus.length === 0;
  // handlers
  const handleAllMenusChange = (isChecked: boolean) => {
    setMenus(isChecked ? ADMIN_MENU_IDS : []);
  };
  const handleMenuChange = (menu: AdminMenuId, isChecked: boolean) => {
    setMenus(current =>
      ADMIN_MENU_IDS.filter(id =>
        id === menu ? isChecked : current.includes(id),
      ),
    );
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setMemberRole({ id: member.id, role, menus });
      toast.show({
        text: readSavedText({ before: member.role, after: role }),
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
      size="medium"
      title={`${member.name} 님 권한`}
      description={member.email ?? "이메일 없음"}
      secondaryButton={{
        text: "취소",
        isDisabled: isSaving,
        onClick: onClose,
      }}
      primaryButton={{
        text: "저장",
        isLoading: isSaving,
        isDisabled: isMenuMissing,
        onClick: handleSave,
      }}
      onClose={onClose}>
      <div className="flex flex-col gap-5">
        <RadioGroup
          name="role"
          label="권한"
          value={role}
          options={roleOptions}
          onChange={setRole}
        />
        {isManager ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-3.5 leading-5 font-medium text-gray-700">
              쓸 수 있는 메뉴
            </legend>
            <Checkbox
              isChecked={isAllMenus}
              isIndeterminate={!isAllMenus && menus.length > 0}
              label="전체 선택"
              onChange={handleAllMenusChange}
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-large bg-gray-50 px-4 py-3.5">
              {ADMIN_MENUS.map(menu => (
                <Checkbox
                  key={menu.id}
                  isChecked={menus.includes(menu.id)}
                  label={menu.label}
                  onChange={isChecked => handleMenuChange(menu.id, isChecked)}
                />
              ))}
            </div>
            {isMenuMissing ? (
              <Text variant="caption-2" color={adminTextErrorColor}>
                메뉴를 하나 이상 골라 주세요.
              </Text>
            ) : null}
          </fieldset>
        ) : (
          <Text variant="caption-2" color={adminTextLabelColor}>
            {role === "super"
              ? "모든 관리 메뉴와 권한 관리를 쓸 수 있어요. 다른 회원을 관리자로 등록하고 메뉴 권한을 바꿀 수 있어요."
              : "관리 화면에 들어올 수 없는 일반 회원이 돼요."}
          </Text>
        )}
      </div>
    </Modal>
  );
};

/**
 * utils
 */
const readMenuText = (member: Member) => {
  if (member.role === "member") {
    return "-";
  }
  if (member.role !== "manager") {
    return "모든 메뉴";
  }
  if (member.menus.length === 0) {
    return "없음";
  }
  if (member.menus.length === ADMIN_MENU_IDS.length) {
    return "모든 메뉴";
  }
  return member.menus.map(menu => ADMIN_MENU_LABEL[menu]).join(", ");
};

/**
 * 바꿀 수 없는 행이면 그 까닭. 바꿀 수 있으면 null
 */
const readLockReason = (params: ReadLockReasonParams): LockReason | null => {
  const { member, self } = params;
  if (member.role === "owner") {
    return "owner";
  }
  if (member.id === self.id) {
    return "self";
  }
  if (member.role === "super" && self.role !== "owner") {
    return "super";
  }
  return null;
};

const readSavedText = (params: ReadSavedTextParams) => {
  const { before, after } = params;
  if (after === "member") {
    return "회원으로 내렸어요.";
  }
  if (before === after) {
    return "메뉴 권한을 바꿨어요.";
  }
  return `${MEMBER_ROLE_LABEL[after]}로 지정했어요.`;
};

export default PermissionsScreen;
