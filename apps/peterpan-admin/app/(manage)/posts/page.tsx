"use client";

import { type ChangeEvent, useEffect, useState } from "react";

import { BOARDS, type BoardId, NEWS_CATEGORIES } from "@repo/db/boards";
import Button from "@repo/ui/components/button";
import Checkbox from "@repo/ui/components/checkbox";
import Chip from "@repo/ui/components/chip";
import Input from "@repo/ui/components/input";
import Modal from "@repo/ui/components/modal";
import Select from "@repo/ui/components/select";
import Tab from "@repo/ui/components/tab";
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
  adminTextLabelColor,
} from "@constants/adminUi";
import {
  type Post,
  type PostFile,
  deletePost,
  deletePostFile,
  listPostFiles,
  listPosts,
  savePost,
} from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const TITLE_MAX = 120;

const SUMMARY_MAX = 200;

const BODY_MAX = 20000;

const BOARD_LABEL = Object.fromEntries(
  BOARDS.map(board => [board.id, board.label]),
) as Record<BoardId, string>;

const BOARD_OPTIONS = BOARDS.map(board => ({
  value: board.id,
  label: board.label,
}));

const CATEGORY_OPTIONS = NEWS_CATEGORIES.filter(
  category => category.id !== "notice",
).map(category => ({ value: category.id, label: category.label }));

const COLUMNS: AdminColumn<Post>[] = [
  {
    key: "title",
    label: "제목",
    render: post => (
      <div className="flex max-w-120 items-center gap-1.5">
        {post.isPinned ? (
          <Icon name="pin" size={16} className="shrink-0 text-primary-500" />
        ) : null}
        <Text variant="label-3" numberOfLines={1}>
          {post.title}
        </Text>
      </div>
    ),
  },
  {
    key: "category",
    label: "분류",
    className: "whitespace-nowrap",
    render: post => (
      <Chip variant="line" color="gray" size="small" text={formatGroup(post)} />
    ),
  },
  {
    key: "isPublished",
    label: "공개",
    className: "whitespace-nowrap",
    render: post => (
      <Chip
        variant="tint"
        color={post.isPublished ? "green" : "gray"}
        size="small"
        text={post.isPublished ? "공개" : "비공개"}
      />
    ),
  },
  {
    key: "createdAt",
    label: "작성일",
    className: "whitespace-nowrap text-gray-600",
    render: post => formatAdminDate({ value: post.createdAt }),
  },
  {
    key: "updatedAt",
    label: "수정일",
    className: "whitespace-nowrap text-gray-600",
    render: post => formatAdminDate({ value: post.updatedAt }),
  },
];

/**
 * types
 */
type Editor = { post: Post | null } | null;

type ReadPostsParams = {
  search: string;
  page: number;
  filter: BoardId;
};

type PostEditorSectionProps = {
  post: Post | null;
  board: BoardId;
  onClose: () => void;
  onChanged: () => void;
};

type AttachmentListProps = {
  files: PostFile[];
  newFiles: File[];
  onFileDelete: (file: PostFile) => void;
  onNewFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * pre-root runtime
 */
const readPosts = (params: ReadPostsParams) => {
  const { search, page, filter } = params;
  return listPosts({ search, page, board: filter });
};

/**
 * screen — 게시물 관리. 재단소식(활동·언론보도), 경영공시, 기부금 공시
 */
const PostsScreen = () => {
  // hooks
  const list = useAdminList({ initialFilter: "news", load: readPosts });
  useAdminHeader({
    value: list.search,
    placeholder: "제목, 본문",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // states
  const [editor, setEditor] = useState<Editor>(null);
  // variables
  const total = list.result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const tabs = BOARDS.map(board => ({
    id: board.id,
    label: board.label,
    count: list.result?.counts[board.id],
  }));
  // handlers
  const handleCreateClick = () => {
    setEditor({ post: null });
  };
  const handleRowClick = (post: Post) => {
    setEditor({ post });
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
        title="게시물 관리"
        description="재단소식과 경영공시·기부금 공시를 올립니다. 공시 자료는 첨부파일로 웹사이트에 열려요."
        actions={
          <Button
            variant="solid"
            color="primary"
            size="small"
            text="게시물 작성"
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
        <Tab
          className="px-2"
          items={tabs}
          activeId={list.filter}
          label="게시판"
          onChange={list.handleFilterChange}
        />
        <AdminTable
          columns={COLUMNS}
          rows={list.result?.items ?? []}
          emptyText="조건에 맞는 게시물이 없어요."
          isLoading={list.isLoading}
          readRowKey={post => post.id}
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
        <PostEditorSection
          key={editor.post?.id ?? "new"}
          post={editor.post}
          board={list.filter}
          onClose={handleEditorClose}
          onChanged={handleEditorChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 게시물 작성·수정
 */
const PostEditorSection = ({
  post,
  board: initialBoard,
  onClose,
  onChanged,
}: PostEditorSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [board, setBoard] = useState<BoardId>(post?.board ?? initialBoard);
  const [category, setCategory] = useState(post?.category ?? "activity");
  const [year, setYear] = useState(post?.year ? String(post.year) : "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [externalUrl, setExternalUrl] = useState(post?.externalUrl ?? "");
  const [isPinned, setIsPinned] = useState(post?.isPinned ?? false);
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? true);
  const [files, setFiles] = useState<PostFile[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // variables
  const isNew = !post;
  const isNews = board === "news";
  // handlers
  const handleSave = async () => {
    const nextTitleError = title.trim() ? null : "제목을 입력해 주세요.";
    setTitleError(nextTitleError);
    if (nextTitleError) {
      return;
    }
    const formData = new FormData();
    formData.set("id", post?.id ?? "");
    formData.set("board", board);
    formData.set("category", isNews ? category : "");
    formData.set("year", isNews ? "" : year);
    formData.set("title", title);
    formData.set("summary", summary);
    formData.set("body", body);
    formData.set("externalUrl", externalUrl);
    formData.set("isPinned", String(isPinned));
    formData.set("isPublished", String(isPublished));
    newFiles.forEach(file => formData.append("files", file));
    setIsSaving(true);
    setError(null);
    try {
      await savePost(formData);
      toast.show({
        text: isNew ? "게시물을 등록했어요." : "게시물을 저장했어요.",
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
    if (!post) {
      return;
    }
    setIsDeleting(true);
    try {
      await deletePost({ id: post.id });
      toast.show({ text: "게시물을 삭제했어요.", variant: "success" });
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
  const handleFileDelete = async (file: PostFile) => {
    try {
      await deletePostFile({ id: file.id });
      setFiles(current => current.filter(item => item.id !== file.id));
      toast.show({ text: "첨부파일을 지웠어요.", variant: "success" });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "첨부파일을 지우지 못했어요.",
      );
    }
  };
  const handleNewFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewFiles(Array.from(event.target.files ?? []));
  };
  const handleDeleteOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };
  // effects
  useEffect(() => {
    if (!post) {
      return;
    }
    let isCancelled = false;
    listPostFiles({ postId: post.id })
      .then(result => {
        if (!isCancelled) {
          setFiles(result);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("첨부파일을 불러오지 못했어요.");
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [post]);
  // render
  return (
    <>
      <AdminDrawer
        isOpen
        title={isNew ? "게시물 작성" : "게시물 수정"}
        subtitle={
          post
            ? `마지막 수정 ${formatAdminDate({ value: post.updatedAt, hasTime: true })}`
            : "공개로 저장하면 웹사이트에 바로 보여요."
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
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="게시판"
            value={board}
            options={BOARD_OPTIONS}
            onChange={setBoard}
          />
          {isNews ? (
            <Select
              label="분류"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={setCategory}
            />
          ) : (
            <Input
              label="연도"
              value={year}
              maxLength={4}
              placeholder="2026"
              onChange={setYear}
            />
          )}
        </div>
        <Input
          label="제목"
          value={title}
          maxLength={TITLE_MAX}
          errorMessage={titleError ?? undefined}
          onChange={setTitle}
        />
        <Input
          label="요약"
          value={summary}
          maxLength={SUMMARY_MAX}
          onChange={setSummary}
        />
        <Textarea
          label="본문"
          value={body}
          rows={10}
          maxLength={BODY_MAX}
          helperText="빈 줄로 문단을 나눠요."
          hasCounter
          onChange={setBody}
        />
        <Input
          label="외부 링크"
          type="url"
          value={externalUrl}
          placeholder="https://"
          onChange={setExternalUrl}
        />
        <AttachmentList
          files={files}
          newFiles={newFiles}
          onFileDelete={handleFileDelete}
          onNewFilesChange={handleNewFilesChange}
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
        title="게시물을 삭제할까요?"
        description="삭제한 게시물과 첨부파일은 웹사이트에서 사라지고 되돌릴 수 없어요."
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
 * inner components
 */
const AttachmentList = ({
  files,
  newFiles,
  onFileDelete,
  onNewFilesChange,
}: AttachmentListProps) => (
  <div className="flex flex-col gap-2">
    <Text as="span" variant="label-3">
      첨부파일
    </Text>
    {files.length > 0 ? (
      <ul className="flex flex-col gap-1.5">
        {files.map(file => (
          <li
            key={file.id}
            className="flex items-center gap-2 rounded-medium bg-gray-50 px-3 py-2 text-4 leading-5">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 flex-1 truncate text-primary-600 underline">
              {file.fileName}
            </a>
            <button
              type="button"
              aria-label={`${file.fileName} 지우기`}
              className="grid size-7 shrink-0 place-items-center rounded-small text-gray-500 hover:bg-gray-100"
              onClick={() => onFileDelete(file)}>
              <Icon name="trash" size={16} />
            </button>
          </li>
        ))}
      </ul>
    ) : null}
    <input
      type="file"
      multiple
      className="text-4 leading-5 text-gray-700 file:mr-3 file:rounded-medium file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-gray-800"
      onChange={onNewFilesChange}
    />
    <Text variant="caption-2" color={adminTextLabelColor}>
      {newFiles.length > 0
        ? `저장할 때 ${newFiles.length}개를 올려요.`
        : "파일당 20MB까지. 이미지는 media, 문서는 documents 버킷에 저장돼요."}
    </Text>
  </div>
);

/**
 * utils
 */
const formatGroup = (post: Post) => {
  if (post.board !== "news") {
    return post.year ? `${post.year}년` : BOARD_LABEL[post.board];
  }
  return (
    NEWS_CATEGORIES.find(category => category.id === post.category)?.label ??
    "소식"
  );
};

export default PostsScreen;
