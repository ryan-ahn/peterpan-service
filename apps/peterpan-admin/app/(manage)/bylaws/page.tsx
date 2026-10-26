"use client";

import { type ChangeEvent, useEffect, useState } from "react";

import Button from "@repo/ui/components/button";
import Chip from "@repo/ui/components/chip";
import Input from "@repo/ui/components/input";
import Modal from "@repo/ui/components/modal";
import { useToast } from "@repo/ui/components/toast";
import Toggle from "@repo/ui/components/toggle";
import Icon from "@repo/ui/icon";
import Text from "@repo/ui/text";

import AdminDrawer from "@components/adminDrawer";
import AdminPageHeader from "@components/adminPageHeader";
import AdminTable, { type AdminColumn } from "@components/adminTable";
import {
  adminPanelClass,
  adminTextErrorColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import {
  type Bylaw,
  addBylaw,
  deleteBylaw,
  listBylaws,
  publishBylaw,
} from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";

/**
 * constants
 */
const TITLE_MAX = 80;

const COLUMNS: AdminColumn<Bylaw>[] = [
  {
    key: "title",
    label: "정관",
    render: bylaw => (
      <div className="flex max-w-120 flex-col">
        <Text variant="label-3" numberOfLines={1}>
          {bylaw.title}
        </Text>
        <Text variant="caption-2" color={adminTextLabelColor} numberOfLines={1}>
          {bylaw.fileName}
        </Text>
      </div>
    ),
  },
  {
    key: "revisedOn",
    label: "제·개정일",
    className: "whitespace-nowrap text-gray-600",
    render: bylaw => formatAdminDate({ value: bylaw.revisedOn }),
  },
  {
    key: "size",
    label: "크기",
    className: "whitespace-nowrap text-gray-600",
    render: bylaw => formatFileSize(bylaw.size),
  },
  {
    key: "articleCount",
    label: "목차",
    className: "whitespace-nowrap text-gray-600",
    render: bylaw =>
      bylaw.articleCount > 0 ? (
        `${bylaw.articleCount}개 조`
      ) : (
        <span className="text-gray-400">없음</span>
      ),
  },
  {
    key: "createdAt",
    label: "올린 날",
    className: "whitespace-nowrap text-gray-600",
    render: bylaw => formatAdminDate({ value: bylaw.createdAt }),
  },
  {
    key: "isPublished",
    label: "웹사이트",
    className: "whitespace-nowrap",
    render: bylaw => (
      <Chip
        variant="tint"
        color={bylaw.isPublished ? "green" : "gray"}
        size="small"
        text={bylaw.isPublished ? "노출 중" : "보관"}
      />
    ),
  },
];

/**
 * types
 */
type Panel = { kind: "add" } | { kind: "detail"; bylaw: Bylaw } | null;

type BylawAddSectionProps = {
  isFirst: boolean;
  onClose: () => void;
  onChanged: () => void;
};

type BylawDetailSectionProps = {
  bylaw: Bylaw;
  onClose: () => void;
  onChanged: () => void;
};

/**
 * screen — 정관. 올린 판을 모두 남기고, 웹사이트에는 1건만 노출한다
 */
const BylawsScreen = () => {
  // states
  const [bylaws, setBylaws] = useState<Bylaw[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [error, setError] = useState<string | null>(null);
  // handlers
  const handleAddClick = () => {
    setPanel({ kind: "add" });
  };
  const handleRowClick = (bylaw: Bylaw) => {
    setPanel({ kind: "detail", bylaw });
  };
  const handlePanelClose = () => {
    setPanel(null);
  };
  const handleChanged = () => {
    setPanel(null);
    setReloadKey(current => current + 1);
  };
  // effects
  useEffect(() => {
    let isCancelled = false;
    listBylaws()
      .then(result => {
        if (!isCancelled) {
          setBylaws(result);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "정관 목록을 불러오지 못했어요.",
          );
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="정관 관리"
        description="올린 정관은 모두 남아요. 웹사이트 재단소개 › 정관에는 노출 중인 1건만 내려받을 수 있게 보여요."
        actions={
          <Button
            variant="solid"
            color="primary"
            size="small"
            text="정관 추가"
            leftChildren={<Icon name="plus" size={16} />}
            onClick={handleAddClick}
          />
        }
      />
      {error ? (
        <Text variant="caption-1" color={adminTextErrorColor}>
          {error}
        </Text>
      ) : null}
      <section className={adminPanelClass}>
        <AdminTable
          columns={COLUMNS}
          rows={bylaws ?? []}
          emptyText="올린 정관이 없어요. 정관 추가로 첫 파일을 올려 주세요."
          isLoading={!bylaws && !error}
          readRowKey={bylaw => bylaw.id}
          onRowClick={handleRowClick}
        />
      </section>
      {panel?.kind === "add" ? (
        <BylawAddSection
          isFirst={!bylaws?.some(bylaw => bylaw.isPublished)}
          onClose={handlePanelClose}
          onChanged={handleChanged}
        />
      ) : null}
      {panel?.kind === "detail" ? (
        <BylawDetailSection
          key={panel.bylaw.id}
          bylaw={panel.bylaw}
          onClose={handlePanelClose}
          onChanged={handleChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 정관 추가
 */
const BylawAddSection = ({
  isFirst,
  onClose,
  onChanged,
}: BylawAddSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [title, setTitle] = useState("재단법인 피터팬 자폐인복지재단 정관");
  const [revisedOn, setRevisedOn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(isFirst);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // handlers
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };
  const handleSave = async () => {
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!file) {
      setError("정관 파일을 골라 주세요.");
      return;
    }
    const formData = new FormData();
    formData.set("title", title);
    formData.set("revisedOn", revisedOn);
    formData.set("isPublished", String(isPublished));
    formData.set("file", file);
    setIsSaving(true);
    setError(null);
    try {
      await addBylaw(formData);
      toast.show({
        text: isPublished
          ? "정관을 올리고 웹사이트에 노출했어요."
          : "정관을 올렸어요.",
        variant: "success",
      });
      onChanged();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "올리지 못했어요.",
      );
      setIsSaving(false);
    }
  };
  // render
  return (
    <AdminDrawer
      isOpen
      title="정관 추가"
      subtitle="PDF로 올리면 장·조 목차와 조문을 뽑아 웹사이트에 함께 보여요."
      footer={
        <Button
          variant="solid"
          color="black"
          size="small"
          text="올리기"
          isLoading={isSaving}
          onClick={handleSave}
        />
      }
      onClose={onClose}>
      <Input
        label="제목"
        value={title}
        maxLength={TITLE_MAX}
        onChange={setTitle}
      />
      <Input
        label="제·개정일"
        value={revisedOn}
        maxLength={10}
        placeholder="2026-09-15"
        helperText="비워 두면 웹사이트에 날짜 없이 보여요."
        onChange={setRevisedOn}
      />
      <div className="flex flex-col gap-2">
        <Text as="span" variant="label-3">
          파일
        </Text>
        <input
          type="file"
          accept="application/pdf,.pdf,.hwp,.hwpx,.doc,.docx"
          className="text-4 leading-5 text-gray-700 file:mr-3 file:rounded-medium file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-gray-800"
          onChange={handleFileChange}
        />
        <Text variant="caption-2" color={adminTextLabelColor}>
          {file
            ? `${file.name} · ${formatFileSize(file.size)}`
            : "20MB까지. 스캔한 PDF나 한글·워드 파일은 목차 없이 내려받기만 보여요."}
        </Text>
      </div>
      <Toggle
        label="웹사이트에 이 정관 노출"
        isOn={isPublished}
        onChange={setIsPublished}
      />
      {isPublished && !isFirst ? (
        <Text variant="caption-2" color={adminTextLabelColor}>
          지금 노출 중인 정관은 보관으로 바뀌어요.
        </Text>
      ) : null}
      {error ? (
        <Text
          variant="caption-1"
          color={adminTextErrorColor}
          className="rounded-medium bg-red-50 px-3 py-2">
          {error}
        </Text>
      ) : null}
    </AdminDrawer>
  );
};

/**
 * section — 정관 상세. 노출 바꾸기·삭제
 */
const BylawDetailSection = ({
  bylaw,
  onClose,
  onChanged,
}: BylawDetailSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // handlers
  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      await publishBylaw({ id: bylaw.id });
      toast.show({
        text: "이 정관을 웹사이트에 노출했어요.",
        variant: "success",
      });
      onChanged();
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "노출하지 못했어요.",
      );
      setIsPublishing(false);
    }
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBylaw({ id: bylaw.id });
      toast.show({ text: "정관을 지웠어요.", variant: "success" });
      onChanged();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "지우지 못했어요.",
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
        title={bylaw.title}
        subtitle={`올린 날 ${formatAdminDate({ value: bylaw.createdAt, hasTime: true })}`}
        footer={
          <>
            {bylaw.isPublished ? null : (
              <Button
                variant="solid"
                color="black"
                size="small"
                text="웹사이트에 노출"
                isLoading={isPublishing}
                onClick={handlePublish}
              />
            )}
            {bylaw.isPublished ? null : (
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
        <dl className="grid grid-cols-[--spacing(22)_1fr] gap-x-3 gap-y-2.5 rounded-large bg-gray-50 px-4 py-3.5 text-4 leading-5">
          <dt className="text-gray-500">상태</dt>
          <dd>
            <Chip
              variant="tint"
              color={bylaw.isPublished ? "green" : "gray"}
              size="small"
              text={bylaw.isPublished ? "노출 중" : "보관"}
            />
          </dd>
          <dt className="text-gray-500">제·개정일</dt>
          <dd>{formatAdminDate({ value: bylaw.revisedOn })}</dd>
          <dt className="text-gray-500">파일</dt>
          <dd className="min-w-0">
            <a
              href={bylaw.url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-primary-600 underline">
              {bylaw.fileName}
            </a>
            <span className="text-gray-500">
              {" "}
              · {formatFileSize(bylaw.size)}
            </span>
          </dd>
        </dl>
        <Text variant="caption-2" color={adminTextLabelColor}>
          {bylaw.isPublished
            ? "지금 웹사이트에서 내려받는 정관이에요. 다른 정관을 노출하면 이 정관은 보관으로 바뀌고 지울 수 있어요."
            : "보관 중인 정관이에요. 노출하면 지금 노출 중인 정관과 바뀌어요."}
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
        title="정관을 지울까요?"
        description={`${bylaw.fileName} 파일이 지워지고 되돌릴 수 없어요.`}
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

/**
 * utils
 */
const formatFileSize = (size: number) => {
  if (size <= 0) {
    return "—";
  }
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
};

export default BylawsScreen;
