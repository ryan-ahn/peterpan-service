"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import Button from "@repo/ui/components/button";
import Checkbox from "@repo/ui/components/checkbox";
import Chip from "@repo/ui/components/chip";
import Input from "@repo/ui/components/input";
import Modal from "@repo/ui/components/modal";
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
import PostEditor from "@components/postEditor";
import {
  ADMIN_PAGE_SIZE,
  adminPanelClass,
  adminTextErrorColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import {
  type NewsItem,
  type NewsKind,
  type Notice,
  type PressCandidate,
  type PressStatus,
  approvePress,
  collectPressNow,
  deleteNotice,
  hidePress,
  listNewsItems,
  saveNotice,
} from "@lib/adminData";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const TITLE_MAX = 80;

const BODY_MAX = 4000;

const KIND_ORDER: NewsKind[] = ["notice", "activity", "press"];

const KIND_INFO: Record<
  NewsKind,
  { label: string; action: string; empty: string }
> = {
  notice: {
    label: "공지",
    action: "공지 작성",
    empty: "등록된 공지가 없어요.",
  },
  activity: {
    label: "활동",
    action: "활동 작성",
    empty: "등록된 활동이 없어요.",
  },
  press: {
    label: "언론보도",
    action: "지금 가져오기",
    empty: "수집된 기사가 없어요. 매일 아침 9시에 네이버 뉴스에서 가져와요.",
  },
};

const PRESS_STATUS: Record<
  PressStatus,
  { label: string; color: "primary" | "green" | "gray" }
> = {
  pending: { label: "승인 대기", color: "primary" },
  approved: { label: "게시 중", color: "green" },
  hidden: { label: "숨김", color: "gray" },
};

const PRESS_FILTERS: PressFilter[] = ["all", "pending", "approved", "hidden"];

const PRESS_COLUMNS: AdminColumn<NewsItem>[] = [
  {
    key: "title",
    label: "제목",
    render: item => (
      <Text variant="label-3" numberOfLines={1} className="max-w-120">
        {item.title}
      </Text>
    ),
  },
  {
    key: "publisher",
    label: "언론사",
    className: "whitespace-nowrap text-gray-600",
    render: item => item.press?.publisher || "—",
  },
  {
    key: "status",
    label: "상태",
    className: "whitespace-nowrap",
    render: item => {
      const status = PRESS_STATUS[item.press?.status ?? "pending"];
      return (
        <Chip
          variant="tint"
          color={status.color}
          size="small"
          text={status.label}
        />
      );
    },
  },
  {
    key: "createdAt",
    label: "보도일",
    className: "whitespace-nowrap text-gray-600",
    render: item => formatAdminDate({ value: item.createdAt }),
  },
];

const COLUMNS: AdminColumn<NewsItem>[] = [
  {
    key: "title",
    label: "제목",
    render: item => (
      <div className="flex max-w-120 items-center gap-1.5">
        {item.isPinned ? (
          <Icon name="pin" size={16} className="shrink-0 text-primary-500" />
        ) : null}
        <Text variant="label-3" numberOfLines={1}>
          {item.title}
        </Text>
      </div>
    ),
  },
  {
    key: "isPinned",
    label: "상단 고정",
    className: "whitespace-nowrap",
    render: item =>
      item.isPinned ? (
        <Chip variant="tint" color="primary" size="small" text="고정" />
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: "isPublished",
    label: "공개",
    className: "whitespace-nowrap",
    render: item => (
      <Chip
        variant="tint"
        color={item.isPublished ? "green" : "gray"}
        size="small"
        text={item.isPublished ? "공개" : "비공개"}
      />
    ),
  },
  {
    key: "createdAt",
    label: "작성일",
    className: "whitespace-nowrap text-gray-600",
    render: item => formatAdminDate({ value: item.createdAt }),
  },
  {
    key: "updatedAt",
    label: "수정일",
    className: "whitespace-nowrap text-gray-600",
    render: item => formatAdminDate({ value: item.updatedAt }),
  },
];

/**
 * types
 */
type Editor = { kind: NewsKind; item: NewsItem | null } | null;

type PressFilter = PressStatus | "all";

type NewsFilter = Exclude<NewsKind, "press"> | `press-${PressFilter}`;

type ReadNewsParams = {
  search: string;
  page: number;
  filter: NewsFilter;
};

type NoticeEditorSectionProps = {
  notice: Notice | null;
  onClose: () => void;
  onChanged: () => void;
};

type PressReviewSectionProps = {
  press: PressCandidate;
  onClose: () => void;
  onChanged: () => void;
};

/**
 * pre-root runtime
 */
const readNews = (params: ReadNewsParams) => {
  const { search, page, filter } = params;
  const pressFilter = readPressFilter(filter);
  return listNewsItems({
    search,
    page,
    kind: readNewsKind(filter),
    pressStatus: pressFilter === "all" ? null : pressFilter,
  });
};

/**
 * screen — 소식 관리. 공지와 활동을 탭으로 나눠 쓰고, 수집한 언론 보도를 승인한다
 */
const NewsScreen = () => {
  // hooks
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const pathFilter = readFilterFromPath(readNewsPathSegments(pathname));
  const list = useAdminList({
    initialFilter: pathFilter ?? "notice",
    load: readNews,
  });
  useAdminHeader({
    value: list.search,
    placeholder: "제목, 내용",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // states
  const [editor, setEditor] = useState<Editor>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  // variables
  const total = list.result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const activeKind = readNewsKind(list.filter);
  const activeTab = KIND_INFO[activeKind];
  const isPressTab = activeKind === "press";
  const pressFilter = readPressFilter(list.filter);
  const tabs = KIND_ORDER.map(kind => ({
    id: kind,
    label: KIND_INFO[kind].label,
    count: list.result?.counts[kind],
  }));
  // functions
  const collect = async () => {
    setIsCollecting(true);
    try {
      const result = await collectPressNow();
      toast.show({
        text:
          result.added > 0
            ? `새 기사 ${result.added}건을 가져왔어요.`
            : "새로 올라온 기사가 없어요.",
        variant: "success",
      });
      list.handleReload();
    } catch (collectError) {
      toast.show({
        text:
          collectError instanceof Error
            ? collectError.message
            : "기사를 가져오지 못했어요.",
        variant: "error",
      });
    }
    setIsCollecting(false);
  };
  // handlers
  const handleFilterNavigate = (filter: NewsFilter) => {
    router.replace(readPathFromFilter(filter), { scroll: false });
  };
  const handleTabChange = (kind: NewsKind) => {
    handleFilterNavigate(kind === "press" ? "press-all" : kind);
  };
  const handlePressFilterChange = (filter: PressFilter) => {
    handleFilterNavigate(`press-${filter}`);
  };
  // effects
  useEffect(() => {
    const filter = readFilterFromPath(readNewsPathSegments(pathname));
    if (filter === null) {
      router.replace("/news");
      return;
    }
    if (filter !== list.filter) {
      list.handleFilterChange(filter);
    }
    // pathname이 바뀔 때만 맞춘다. 탭 클릭은 주소만 바꾸고 여기서 목록 필터를 갱신한다
    // eslint-disable-next-line react-hooks/exhaustive-deps -- list는 매 렌더 새 객체라 넣지 않는다
  }, [pathname]);
  const handleActionClick = () => {
    if (isPressTab) {
      void collect();
      return;
    }
    setEditor({ kind: activeKind, item: null });
  };
  const handleRowClick = (item: NewsItem) => {
    setEditor({ kind: item.kind, item });
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
        title="소식 관리"
        description={
          isPressTab
            ? "네이버 뉴스에서 매일 모은 기사예요. 승인한 기사만 웹사이트 언론 보도에 원문 링크로 올라가요."
            : "웹사이트 소식에 올라갈 공지와 활동을 올려요. 상단 고정한 글이 맨 위에 보여요."
        }
        actions={
          <Button
            variant={isPressTab ? "line" : "solid"}
            color={isPressTab ? "black" : "primary"}
            size="small"
            text={activeTab.action}
            isLoading={isCollecting}
            leftChildren={
              isPressTab ? undefined : <Icon name="plus" size={16} />
            }
            onClick={handleActionClick}
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
          activeId={activeKind}
          label="소식 분류"
          onChange={handleTabChange}
        />
        {isPressTab ? (
          <div className="flex flex-wrap gap-2 px-4 pt-4">
            {PRESS_FILTERS.map(filter => (
              <Chip
                key={filter}
                variant={pressFilter === filter ? "contain" : "line"}
                color="gray"
                text={`${filter === "all" ? "전체" : PRESS_STATUS[filter].label} ${list.result?.pressCounts[filter] ?? 0}`}
                isSelected={pressFilter === filter}
                onClick={() => handlePressFilterChange(filter)}
              />
            ))}
          </div>
        ) : null}
        <AdminTable
          columns={isPressTab ? PRESS_COLUMNS : COLUMNS}
          rows={list.result?.items ?? []}
          emptyText={
            isPressTab && pressFilter !== "all"
              ? `${PRESS_STATUS[pressFilter].label} 기사가 없어요.`
              : activeTab.empty
          }
          isLoading={list.isLoading}
          readRowKey={item => item.id}
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
      {editor?.kind === "notice" ? (
        <NoticeEditorSection
          key={editor.item?.id ?? "new"}
          notice={editor.item?.notice ?? null}
          onClose={handleEditorClose}
          onChanged={handleEditorChanged}
        />
      ) : null}
      {editor?.kind === "activity" ? (
        <PostEditor
          key={editor.item?.id ?? "new"}
          post={editor.item?.post ?? null}
          board="news"
          onClose={handleEditorClose}
          onChanged={handleEditorChanged}
        />
      ) : null}
      {editor?.kind === "press" && editor.item?.press ? (
        <PressReviewSection
          key={editor.item.id}
          press={editor.item.press}
          onClose={handleEditorClose}
          onChanged={handleEditorChanged}
        />
      ) : null}
    </div>
  );
};

/**
 * section — 수집한 언론 보도 검토. 승인하면 웹사이트에 게시하고, 숨기면 내린다
 */
const PressReviewSection = ({
  press,
  onClose,
  onChanged,
}: PressReviewSectionProps) => {
  // hooks
  const toast = useToast();
  // states
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  // variables
  const status = PRESS_STATUS[press.status];
  // handlers
  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      await approvePress({ id: press.id });
      toast.show({ text: "언론 보도에 게시했어요.", variant: "success" });
      onChanged();
    } catch (approveError) {
      setError(
        approveError instanceof Error
          ? approveError.message
          : "게시하지 못했어요.",
      );
      setIsApproving(false);
    }
  };
  const handleHide = async () => {
    setIsHiding(true);
    setError(null);
    try {
      await hidePress({ id: press.id });
      toast.show({ text: "기사를 숨겼어요.", variant: "success" });
      onChanged();
    } catch (hideError) {
      setError(
        hideError instanceof Error ? hideError.message : "숨기지 못했어요.",
      );
      setIsHiding(false);
    }
  };
  // render
  return (
    <AdminDrawer
      isOpen
      title={press.title}
      subtitle={`${press.publisher || "언론사 미상"} · ${formatAdminDate({ value: press.publishedAt, hasTime: true })}`}
      footer={
        <>
          {press.status === "approved" ? null : (
            <Button
              variant="solid"
              color="black"
              size="small"
              text="승인하고 게시"
              isLoading={isApproving}
              isDisabled={isHiding}
              onClick={handleApprove}
            />
          )}
          {press.status === "hidden" ? null : (
            <Button
              variant="ghost"
              color="danger"
              size="small"
              text={press.status === "approved" ? "게시 내리기" : "숨기기"}
              className="ml-auto"
              isLoading={isHiding}
              isDisabled={isApproving}
              onClick={handleHide}
            />
          )}
        </>
      }
      onClose={onClose}>
      <div>
        <Chip
          variant="tint"
          color={status.color}
          size="small"
          text={status.label}
        />
      </div>
      <Text variant="body-3" className="whitespace-pre-wrap">
        {press.summary || "요약이 없어요."}
      </Text>
      <Button
        variant="line"
        color="gray"
        size="small"
        text="원문 기사 보기"
        href={press.url}
        isExternal
        rightChildren={<Icon name="external-link" size={14} />}
      />
      <Text variant="caption-1" color={adminTextLabelColor}>
        웹사이트에는 제목·언론사·요약과 원문 링크만 올라가요. 숨긴 기사는 다시
        수집돼도 대기 목록에 올라오지 않아요.
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
    setIsSaving(true);
    setError(null);
    try {
      await saveNotice({
        id: notice?.id ?? null,
        title,
        body,
        isPinned,
        isPublished,
      });
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
      await deleteNotice({ id: notice.id });
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

/**
 * utils
 */
const readNewsKind = (filter: NewsFilter): NewsKind => {
  if (filter === "notice" || filter === "activity") {
    return filter;
  }
  return "press";
};

const readPressFilter = (filter: NewsFilter): PressFilter => {
  if (filter === "press-pending") return "pending";
  if (filter === "press-approved") return "approved";
  if (filter === "press-hidden") return "hidden";
  return "all";
};

const PRESS_PATH_FILTERS = new Set<PressFilter>([
  "pending",
  "approved",
  "hidden",
]);

/**
 * `[[...view]]` 경로를 소식 목록 필터로 읽는다. 알 수 없는 주소는 null
 */
const readFilterFromPath = (segments: string[]): NewsFilter | null => {
  if (segments.length === 0) {
    return "notice";
  }
  if (segments.length === 1) {
    if (segments[0] === "activity") {
      return "activity";
    }
    if (segments[0] === "press") {
      return "press-all";
    }
    return null;
  }
  if (
    segments.length === 2 &&
    segments[0] === "press" &&
    PRESS_PATH_FILTERS.has(segments[1] as PressFilter)
  ) {
    return `press-${segments[1]}` as NewsFilter;
  }
  return null;
};

const readPathFromFilter = (filter: NewsFilter) => {
  if (filter === "notice") {
    return "/news";
  }
  if (filter === "activity") {
    return "/news/activity";
  }
  if (filter === "press-all") {
    return "/news/press";
  }
  if (filter === "press-pending") {
    return "/news/press/pending";
  }
  if (filter === "press-approved") {
    return "/news/press/approved";
  }
  if (filter === "press-hidden") {
    return "/news/press/hidden";
  }
  return "/news";
};

const readNewsPathSegments = (pathname: string) => {
  const rest = pathname.replace(/^\/news\/?/, "");
  if (!rest) {
    return [];
  }
  return rest.split("/").filter(Boolean);
};

export default NewsScreen;
