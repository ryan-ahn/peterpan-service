"use client";

import { useState } from "react";

import { BOARDS } from "@repo/db/boards";
import Button from "@repo/ui/components/button";
import Chip from "@repo/ui/components/chip";
import Tab from "@repo/ui/components/tab";
import Icon from "@repo/ui/icon";
import Text from "@repo/ui/text";

import { useAdminHeader } from "@components/adminFrame";
import AdminPageHeader from "@components/adminPageHeader";
import AdminPager from "@components/adminPager";
import AdminTable, { type AdminColumn } from "@components/adminTable";
import PostEditor from "@components/postEditor";
import {
  ADMIN_PAGE_SIZE,
  adminPanelClass,
  adminTextErrorColor,
} from "@constants/adminUi";
import { type Post, listPosts } from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const DISCLOSURE_BOARDS = BOARDS.filter(board => board.id !== "news");

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
    key: "year",
    label: "연도",
    className: "whitespace-nowrap",
    render: post =>
      post.year ? (
        <Chip
          variant="line"
          color="gray"
          size="small"
          text={`${post.year}년`}
        />
      ) : (
        <span className="text-gray-400">—</span>
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
type DisclosureBoardId = (typeof DISCLOSURE_BOARDS)[number]["id"];

type Editor = { post: Post | null } | null;

type ReadDisclosuresParams = {
  search: string;
  page: number;
  filter: DisclosureBoardId;
};

/**
 * pre-root runtime
 */
const readDisclosures = (params: ReadDisclosuresParams) => {
  const { search, page, filter } = params;
  return listPosts({ search, page, board: filter });
};

/**
 * screen — 공시 관리. 경영 공시, 기부금 공시
 */
const DisclosuresScreen = () => {
  // hooks
  const list = useAdminList({
    initialFilter: "management",
    load: readDisclosures,
  });
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
  const tabs = DISCLOSURE_BOARDS.map(board => ({
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
        title="공시 관리"
        description="경영 공시와 기부금 공시를 올립니다. 공시 자료는 첨부파일로 웹사이트에 열려요."
        actions={
          <Button
            variant="solid"
            color="primary"
            size="small"
            text="공시 작성"
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
          label="공시"
          onChange={list.handleFilterChange}
        />
        <AdminTable
          columns={COLUMNS}
          rows={list.result?.items ?? []}
          emptyText="등록된 공시가 없어요."
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
        <PostEditor
          key={editor.post?.id ?? "new"}
          post={editor.post}
          board={editor.post?.board ?? list.filter}
          onClose={handleEditorClose}
          onChanged={handleEditorChanged}
        />
      ) : null}
    </div>
  );
};

export default DisclosuresScreen;
