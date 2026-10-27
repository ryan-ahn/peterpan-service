"use client";

import { useState } from "react";

import { donationKindLabel } from "@repo/db/boards";
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
import {
  ADMIN_PAGE_SIZE,
  adminPanelClass,
  adminTextErrorColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import { type Inquiry, deleteInquiry, listInquiries } from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const COLUMNS: AdminColumn<Inquiry>[] = [
  {
    key: "name",
    label: "이름",
    render: inquiry => (
      <div className="flex min-w-0 flex-col">
        <Text variant="label-3">{inquiry.name}</Text>
        <Text variant="caption-2" color={adminTextLabelColor}>
          {inquiry.email}
        </Text>
      </div>
    ),
  },
  {
    key: "kind",
    label: "후원 방식",
    className: "whitespace-nowrap",
    render: inquiry => (
      <Chip
        variant="tint"
        color={inquiry.kind === "pledge" ? "gold" : "gray"}
        size="small"
        text={donationKindLabel(inquiry.kind)}
      />
    ),
  },
  {
    key: "amount",
    label: "보낸 금액",
    className: "whitespace-nowrap text-gray-600",
    render: inquiry => inquiry.amount || "—",
  },
  {
    key: "phone",
    label: "전화",
    className: "whitespace-nowrap text-gray-600",
    render: inquiry => inquiry.phone || "—",
  },
  {
    key: "createdAt",
    label: "접수일",
    className: "whitespace-nowrap text-gray-600",
    render: inquiry => formatAdminDate({ value: inquiry.createdAt }),
  },
];

/**
 * types
 */
type ReadInquiriesParams = {
  search: string;
  page: number;
  filter: "all";
};

type InquiryDetailSectionProps = {
  inquiry: Inquiry;
  onClose: () => void;
  onChanged: () => void;
};

/**
 * pre-root runtime
 */
const readInquiries = (params: ReadInquiriesParams) => {
  const { search, page } = params;
  return listInquiries({ search, page });
};

/**
 * screen — 후원 관리. 웹사이트 후원하기에서 남긴 후원
 */
const InquiriesScreen = () => {
  // hooks
  const list = useAdminList({ initialFilter: "all", load: readInquiries });
  useAdminHeader({
    value: list.search,
    placeholder: "이름, 이메일, 전화",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // states
  const [selected, setSelected] = useState<Inquiry | null>(null);
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
        title="후원 관리"
        description="웹사이트 후원하기에서 남긴 후원입니다. 입금 확인과 기록을 마친 후원 내역은 파기해 주세요."
      />
      {list.error ? (
        <Text variant="caption-1" color={adminTextErrorColor}>
          {list.error}
        </Text>
      ) : null}
      <section className={adminPanelClass}>
        <AdminTable
          columns={COLUMNS}
          rows={list.result?.items ?? []}
          emptyText="들어온 후원이 없어요."
          isLoading={list.isLoading}
          readRowKey={inquiry => inquiry.id}
          onRowClick={setSelected}
        />
        <AdminPager
          page={list.page}
          pageCount={pageCount}
          total={total}
          unit="건"
          onChange={list.setPage}
        />
      </section>
      {selected ? (
        <InquiryDetailSection
          key={selected.id}
          inquiry={selected}
          onClose={handleDetailClose}
          onChanged={handleDetailChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 후원 상세·파기
 */
const InquiryDetailSection = ({
  inquiry,
  onClose,
  onChanged,
}: InquiryDetailSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // handlers
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInquiry({ id: inquiry.id });
      toast.show({ text: "후원 내역을 파기했어요.", variant: "success" });
      onChanged();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "파기하지 못했어요.",
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
        title={inquiry.name}
        subtitle={formatAdminDate({ value: inquiry.createdAt, hasTime: true })}
        footer={
          <Button
            variant="ghost"
            color="danger"
            size="small"
            text="후원 내역 파기"
            className="ml-auto"
            onClick={handleDeleteOpen}
          />
        }
        onClose={onClose}>
        <dl className="grid grid-cols-[--spacing(22)_1fr] gap-x-3 gap-y-2.5 rounded-large bg-gray-50 px-4 py-3.5 text-4 leading-5">
          <dt className="text-gray-500">이메일</dt>
          <dd className="break-all">{inquiry.email}</dd>
          <dt className="text-gray-500">전화</dt>
          <dd>{inquiry.phone || "—"}</dd>
          <dt className="text-gray-500">후원 방식</dt>
          <dd>{donationKindLabel(inquiry.kind)}</dd>
          <dt className="text-gray-500">보낸 금액</dt>
          <dd>{inquiry.amount || "—"}</dd>
          <dt className="text-gray-500">입금자명</dt>
          <dd>{inquiry.depositorName || inquiry.name}</dd>
          <dt className="text-gray-500">이름 벽</dt>
          <dd>{inquiry.wallName || "올리지 않음"}</dd>
        </dl>
        <div className="flex flex-col gap-2">
          <Text as="span" variant="label-3">
            남기는 말
          </Text>
          <Text variant="body-3" className="whitespace-pre-wrap">
            {inquiry.message || "남긴 말이 없어요."}
          </Text>
        </div>
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
        title="후원 내역을 파기할까요?"
        description={`${inquiry.name} 님의 연락처와 남긴 내용이 지워지고 되돌릴 수 없어요.`}
        secondaryButton={{
          text: "취소",
          isDisabled: isDeleting,
          onClick: handleDeleteClose,
        }}
        primaryButton={{
          text: "파기",
          color: "danger",
          isLoading: isDeleting,
          onClick: handleDelete,
        }}
        onClose={handleDeleteClose}
      />
    </>
  );
};

export default InquiriesScreen;
