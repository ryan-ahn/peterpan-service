"use client";

import { useState } from "react";

import Avatar from "@repo/ui/components/avatar";
import Button from "@repo/ui/components/button";
import Chip from "@repo/ui/components/chip";
import Modal from "@repo/ui/components/modal";
import { useToast } from "@repo/ui/components/toast";
import Text from "@repo/ui/text";

import AdminDrawer from "@components/adminDrawer";
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
  deleteMember,
  listMembers,
} from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const PROVIDER_LABEL: Record<string, string> = {
  kakao: "카카오",
  google: "구글",
};

const FILTERS: MemberFilter[] = ["all", "manager", "member"];

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
    key: "provider",
    label: "가입 경로",
    className: "whitespace-nowrap text-gray-600",
    render: member => PROVIDER_LABEL[member.provider] ?? member.provider,
  },
  {
    key: "joinedAt",
    label: "가입일",
    className: "whitespace-nowrap text-gray-600",
    render: member => formatAdminDate({ value: member.joinedAt }),
  },
];

/**
 * types
 */
type MemberFilter = Exclude<MemberRole, "owner"> | "all";

type ReadMembersParams = {
  search: string;
  page: number;
  filter: MemberFilter;
};

type MemberDetailSectionProps = {
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
 * screen — 회원 관리
 */
const MembersScreen = () => {
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
  const handleDetailClose = () => {
    setSelected(null);
  };
  const handleDetailChanged = () => {
    setSelected(null);
    list.handleReload();
  };
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="회원 관리"
        description="카카오·구글로 로그인한 회원을 찾고 정리합니다. 관리자 지정은 권한 관리에서 합니다."
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
          onRowClick={setSelected}
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
        <MemberDetailSection
          key={selected.id}
          member={selected}
          onClose={handleDetailClose}
          onChanged={handleDetailChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 회원 상세·삭제
 */
const MemberDetailSection = ({
  member,
  onClose,
  onChanged,
}: MemberDetailSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // variables
  const isOwner = member.role === "owner";
  // handlers
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMember({ id: member.id });
      toast.show({ text: "회원을 삭제했어요.", variant: "success" });
      onChanged();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "삭제하지 못했어요.",
      );
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };
  const handleDeleteOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };
  // render
  return (
    <>
      <AdminDrawer
        isOpen
        title={member.name}
        subtitle={member.email ?? "이메일 없음"}
        footer={
          isOwner ? null : (
            <Button
              variant="ghost"
              color="danger"
              size="small"
              text="회원 삭제"
              className="ml-auto"
              onClick={handleDeleteOpen}
            />
          )
        }
        onClose={onClose}>
        <dl className="grid grid-cols-[--spacing(22)_1fr] gap-x-3 gap-y-2.5 rounded-large bg-gray-50 px-4 py-3.5 text-4 leading-5">
          <dt className="text-gray-500">권한</dt>
          <dd>
            <MemberRoleChip role={member.role} />
          </dd>
          <dt className="text-gray-500">가입 경로</dt>
          <dd>{PROVIDER_LABEL[member.provider] ?? member.provider}</dd>
          <dt className="text-gray-500">가입일</dt>
          <dd>{formatAdminDate({ value: member.joinedAt, hasTime: true })}</dd>
        </dl>
        <Text variant="caption-2" color={adminTextLabelColor}>
          {isOwner
            ? "이 계정은 삭제할 수 없어요."
            : "관리자 지정·해제는 권한 관리에서 해요."}
        </Text>
        {error ? (
          <Text
            variant="caption-1"
            color={adminTextErrorColor}
            className="rounded-medium bg-red-50 px-3 py-2">
            {error}
          </Text>
        ) : null}
      </AdminDrawer>
      <Modal
        isOpen={isDeleteOpen}
        title="회원을 삭제할까요?"
        description={`${member.name} 회원의 로그인 계정과 정보가 지워지고 되돌릴 수 없어요.`}
        secondaryButton={{
          text: "취소",
          isDisabled: isDeleting,
          onClick: handleDeleteClose,
        }}
        primaryButton={{
          text: "삭제",
          color: "danger",
          isLoading: isDeleting,
          onClick: handleDelete,
        }}
        onClose={handleDeleteClose}
      />
    </>
  );
};

export default MembersScreen;
