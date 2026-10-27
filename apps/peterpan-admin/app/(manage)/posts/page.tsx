"use client";

import { useEffect, useState } from "react";

import Button from "@repo/ui/components/button";
import Chip from "@repo/ui/components/chip";
import Modal from "@repo/ui/components/modal";
import Tab from "@repo/ui/components/tab";
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
  type MemberComment,
  type MemberPost,
  type MemberPostFilter,
  deleteMemberComment,
  deleteMemberPost,
  listMemberComments,
  listMemberPosts,
  setMemberPostPublished,
} from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const FILTER_TABS: { id: MemberPostFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "published", label: "공개" },
  { id: "hidden", label: "숨김" },
];

const COLUMNS: AdminColumn<MemberPost>[] = [
  {
    key: "title",
    label: "제목",
    render: post => (
      <Text variant="label-3" numberOfLines={1} className="max-w-120">
        {post.title}
      </Text>
    ),
  },
  {
    key: "authorName",
    label: "글쓴이",
    className: "whitespace-nowrap text-gray-700",
    render: post => post.authorName,
  },
  {
    key: "commentCount",
    label: "댓글",
    className: "whitespace-nowrap text-gray-600",
    render: post => post.commentCount,
  },
  {
    key: "likeCount",
    label: "좋아요",
    className: "whitespace-nowrap text-gray-600",
    render: post => post.likeCount,
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
        text={post.isPublished ? "공개" : "숨김"}
      />
    ),
  },
  {
    key: "createdAt",
    label: "작성일",
    className: "whitespace-nowrap text-gray-600",
    render: post => formatAdminDate({ value: post.createdAt }),
  },
];

/**
 * types
 */
type ReadMemberPostsParams = {
  search: string;
  page: number;
  filter: MemberPostFilter;
};

type MemberPostDetailSectionProps = {
  post: MemberPost;
  onClose: () => void;
  onChanged: () => void;
};

/**
 * pre-root runtime
 */
const readMemberPosts = (params: ReadMemberPostsParams) => {
  const { search, page, filter } = params;
  return listMemberPosts({ search, page, filter });
};

/**
 * screen — 게시물 관리. 웹사이트 게시판에 회원이 올린 글과 댓글
 */
const PostsScreen = () => {
  // hooks
  const list = useAdminList({ initialFilter: "all", load: readMemberPosts });
  useAdminHeader({
    value: list.search,
    placeholder: "제목, 본문, 글쓴이",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // states
  const [selected, setSelected] = useState<MemberPost | null>(null);
  // variables
  const total = list.result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const tabs = FILTER_TABS.map(tab => ({
    id: tab.id,
    label: tab.label,
    count: list.result?.counts[tab.id],
  }));
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
        title="게시물 관리"
        description="웹사이트 게시판에 회원이 올린 글이에요. 문제가 있는 글은 숨기거나 삭제하고, 댓글도 여기서 지울 수 있어요."
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
          label="공개 상태"
          onChange={list.handleFilterChange}
        />
        <AdminTable
          columns={COLUMNS}
          rows={list.result?.items ?? []}
          emptyText="조건에 맞는 게시물이 없어요."
          isLoading={list.isLoading}
          readRowKey={post => post.id}
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
        <MemberPostDetailSection
          key={selected.id}
          post={selected}
          onClose={handleDetailClose}
          onChanged={handleDetailChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 회원 글 상세. 공개·숨김, 댓글 지우기, 글 삭제
 */
const MemberPostDetailSection = ({
  post,
  onClose,
  onChanged,
}: MemberPostDetailSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [isPublished, setIsPublished] = useState(post.isPublished);
  const [comments, setComments] = useState<MemberComment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // variables
  const isChanged = isPublished !== post.isPublished;
  // handlers
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await setMemberPostPublished({ id: post.id, isPublished });
      toast.show({
        text: isPublished ? "글을 다시 공개했어요." : "글을 숨겼어요.",
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
  const handleCommentDelete = async (comment: MemberComment) => {
    try {
      await deleteMemberComment({ id: comment.id });
      setComments(current =>
        (current ?? []).filter(item => item.id !== comment.id),
      );
      toast.show({ text: "댓글을 지웠어요.", variant: "success" });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "댓글을 지우지 못했어요.",
      );
    }
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMemberPost({ id: post.id });
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
  const handleDeleteOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };
  // effects
  useEffect(() => {
    let isCancelled = false;
    listMemberComments({ postId: post.id })
      .then(result => {
        if (!isCancelled) {
          setComments(result);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("댓글을 불러오지 못했어요.");
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [post.id]);
  // render
  return (
    <>
      <AdminDrawer
        isOpen
        title={post.title}
        subtitle={`${post.authorName} · ${formatAdminDate({ value: post.createdAt, hasTime: true })}`}
        footer={
          <>
            <Button
              variant="solid"
              color="black"
              size="small"
              text="저장"
              isLoading={isSaving}
              isDisabled={!isChanged}
              onClick={handleSave}
            />
            <Button
              variant="ghost"
              color="danger"
              size="small"
              text="게시물 삭제"
              className="ml-auto"
              onClick={handleDeleteOpen}
            />
          </>
        }
        onClose={onClose}>
        <dl className="grid grid-cols-[--spacing(22)_1fr] gap-x-3 gap-y-2.5 rounded-large bg-gray-50 px-4 py-3.5 text-4 leading-5">
          <dt className="text-gray-500">좋아요</dt>
          <dd>{post.likeCount}</dd>
          <dt className="text-gray-500">댓글</dt>
          <dd>{comments?.length ?? post.commentCount}</dd>
          <dt className="text-gray-500">마지막 수정</dt>
          <dd>{formatAdminDate({ value: post.updatedAt, hasTime: true })}</dd>
        </dl>
        <Text variant="body-3" className="break-all whitespace-pre-wrap">
          {post.body}
        </Text>
        <Toggle
          label="웹사이트에 공개"
          isOn={isPublished}
          onChange={setIsPublished}
        />
        <div className="flex flex-col gap-2">
          <Text as="span" variant="label-3">
            댓글 {comments?.length ?? post.commentCount}
          </Text>
          {comments === null ? (
            <Text variant="caption-1" color={adminTextLabelColor}>
              불러오는 중…
            </Text>
          ) : null}
          {comments?.length === 0 ? (
            <Text variant="caption-1" color={adminTextLabelColor}>
              댓글이 없어요.
            </Text>
          ) : null}
          {comments && comments.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {comments.map(comment => (
                <li
                  key={comment.id}
                  className="flex items-start gap-2 rounded-medium bg-gray-50 px-3 py-2.5">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Text variant="caption-1" color={adminTextLabelColor}>
                      {comment.authorName} ·{" "}
                      {formatAdminDate({ value: comment.createdAt })}
                    </Text>
                    <Text
                      variant="body-3"
                      className="break-all whitespace-pre-wrap">
                      {comment.body}
                    </Text>
                  </div>
                  <button
                    type="button"
                    aria-label="댓글 지우기"
                    className="grid size-7 shrink-0 place-items-center rounded-small text-gray-500 hover:bg-gray-100"
                    onClick={() => handleCommentDelete(comment)}>
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
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
        description="글과 댓글·좋아요가 모두 지워지고 되돌릴 수 없어요. 잠시 가리기만 하려면 숨김으로 저장해 주세요."
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

export default PostsScreen;
