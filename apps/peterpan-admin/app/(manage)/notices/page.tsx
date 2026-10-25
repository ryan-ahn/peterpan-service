"use client";

import { useState } from "react";

import Button from "@repo/ui/components/button";
import Checkbox from "@repo/ui/components/checkbox";
import Chip from "@repo/ui/components/chip";
import Input from "@repo/ui/components/input";
import Modal from "@repo/ui/components/modal";
import Textarea from "@repo/ui/components/textarea";
import { useToast } from "@repo/ui/components/toast";
import Toggle from "@repo/ui/components/toggle";
import Icon from "@repo/ui/icon";
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
} from "@constants/adminUi";
import {
  type Post as Notice,
  deletePost,
  listNotices,
  savePost,
} from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const TITLE_MAX = 80;

const BODY_MAX = 4000;

const COLUMNS: AdminColumn<Notice>[] = [
  {
    key: "title",
    label: "제목",
    render: notice => (
      <div className="flex max-w-120 items-center gap-1.5">
        {notice.isPinned ? (
          <Icon name="pin" size={16} className="shrink-0 text-primary-500" />
        ) : null}
        <Text variant="label-3" numberOfLines={1}>
          {notice.title}
        </Text>
      </div>
    ),
  },
  {
    key: "isPinned",
    label: "상단 고정",
    className: "whitespace-nowrap",
    render: notice =>
      notice.isPinned ? (
        <Chip variant="tint" color="primary" size="small" text="고정" />
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: "isPublished",
    label: "공개",
    className: "whitespace-nowrap",
    render: notice => (
      <Chip
        variant="tint"
        color={notice.isPublished ? "green" : "gray"}
        size="small"
        text={notice.isPublished ? "공개" : "비공개"}
      />
    ),
  },
  {
    key: "createdAt",
    label: "작성일",
    className: "whitespace-nowrap text-gray-600",
    render: notice => formatAdminDate({ value: notice.createdAt }),
  },
  {
    key: "updatedAt",
    label: "수정일",
    className: "whitespace-nowrap text-gray-600",
    render: notice => formatAdminDate({ value: notice.updatedAt }),
  },
];

/**
 * types
 */
type Editor = { notice: Notice | null } | null;

type ReadNoticesParams = {
  search: string;
  page: number;
  filter: "all";
};

type NoticeEditorSectionProps = {
  notice: Notice | null;
  onClose: () => void;
  onChanged: () => void;
};

/**
 * pre-root runtime
 */
const readNotices = (params: ReadNoticesParams) => {
  const { search, page } = params;
  return listNotices({ search, page });
};

/**
 * screen — 공지사항 관리
 */
const NoticesScreen = () => {
  // hooks
  const list = useAdminList({ initialFilter: "all", load: readNotices });
  useAdminHeader({
    value: list.search,
    placeholder: "제목, 내용",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // states
  const [editor, setEditor] = useState<Editor>(null);
  // variables
  const total = list.result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  // handlers
  const handleCreateClick = () => {
    setEditor({ notice: null });
  };
  const handleRowClick = (notice: Notice) => {
    setEditor({ notice });
  };
  const handleEditorClose = () => {
    setEditor(null);
  };
  const handleEditorChanged = () => {
    setEditor(null);
    list.handleReload();
  };
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="공지사항 관리"
        description="재단소식 게시판의 공지를 등록합니다. 상단 고정한 공지가 맨 위에 보여요."
        actions={
          <Button
            variant="solid"
            color="primary"
            size="small"
            text="공지 작성"
            leftChildren={<Icon name="plus" size={16} />}
            onClick={handleCreateClick}
          />
        }
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
          emptyText="등록된 공지사항이 없어요."
          isLoading={list.isLoading}
          readRowKey={notice => notice.id}
          onRowClick={handleRowClick}
        />
        <AdminPager
          page={list.page}
          pageCount={pageCount}
          total={total}
          unit="건"
          onChange={list.setPage}
        />
      </section>
      {editor ? (
        <NoticeEditorSection
          key={editor.notice?.id ?? "new"}
          notice={editor.notice}
          onClose={handleEditorClose}
          onChanged={handleEditorChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 공지사항 작성·수정
 */
const NoticeEditorSection = ({
  notice,
  onClose,
  onChanged,
}: NoticeEditorSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [title, setTitle] = useState(notice?.title ?? "");
  const [body, setBody] = useState(notice?.body ?? "");
  const [isPinned, setIsPinned] = useState(notice?.isPinned ?? false);
  const [isPublished, setIsPublished] = useState(notice?.isPublished ?? true);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // variables
  const isNew = !notice;
  // handlers
  const handleSave = async () => {
    const nextTitleError = title.trim() ? null : "제목을 입력해 주세요.";
    const nextBodyError = body.trim() ? null : "내용을 입력해 주세요.";
    setTitleError(nextTitleError);
    setBodyError(nextBodyError);
    if (nextTitleError || nextBodyError) {
      return;
    }
    const formData = new FormData();
    formData.set("id", notice?.id ?? "");
    formData.set("board", "news");
    formData.set("category", "notice");
    formData.set("title", title);
    formData.set("summary", notice?.summary ?? "");
    formData.set("body", body);
    formData.set("externalUrl", notice?.externalUrl ?? "");
    formData.set("isPinned", String(isPinned));
    formData.set("isPublished", String(isPublished));
    setIsSaving(true);
    setError(null);
    try {
      await savePost(formData);
      toast.show({
        text: isNew ? "공지사항을 등록했어요." : "공지사항을 저장했어요.",
        variant: "success",
      });
      onChanged();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "저장하지 못했어요.",
      );
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!notice) {
      return;
    }
    setIsDeleting(true);
    try {
      await deletePost({ id: notice.id });
      toast.show({ text: "공지사항을 삭제했어요.", variant: "success" });
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
        title={isNew ? "공지 작성" : "공지 수정"}
        subtitle={
          isPinned ? "목록 맨 위에 고정돼요." : "작성일 순서대로 목록에 보여요."
        }
        footer={
          <>
            <Button
              variant="solid"
              color="black"
              size="small"
              text={isNew ? "등록" : "저장"}
              isLoading={isSaving}
              onClick={handleSave}
            />
            {isNew ? null : (
              <Button
                variant="ghost"
                color="danger"
                size="small"
                text="삭제"
                className="ml-auto"
                onClick={handleDeleteOpen}
              />
            )}
          </>
        }
        onClose={onClose}>
        <Input
          label="제목"
          value={title}
          maxLength={TITLE_MAX}
          errorMessage={titleError ?? undefined}
          onChange={setTitle}
        />
        <Textarea
          label="내용"
          value={body}
          rows={10}
          maxLength={BODY_MAX}
          errorMessage={bodyError ?? undefined}
          hasCounter
          onChange={setBody}
        />
        <div className="flex flex-col gap-3">
          <Checkbox
            label="상단 고정"
            isChecked={isPinned}
            onChange={setIsPinned}
          />
          <Toggle
            label="웹사이트에 공개"
            isOn={isPublished}
            onChange={setIsPublished}
          />
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
        title="공지사항을 삭제할까요?"
        description="삭제한 공지는 웹사이트에서 사라지고 되돌릴 수 없어요."
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

export default NoticesScreen;
