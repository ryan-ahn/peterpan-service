import type { ReactNode } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionProfile } from "@repo/auth/session";
import { PROFILE_LIMIT, donationKindLabel } from "@repo/db/boards";
import Button, { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import {
  deleteMyBoardPost,
  deleteMyInquiry,
  removeMyAvatar,
  updateMyProfile,
  withdrawMe,
} from "@app/mypage/actions";
import AvatarPicker from "@components/avatarPicker";
import BrandText from "@components/brandText";
import FlashToast from "@components/flashToast";
import PageIntro from "@components/pageIntro";
import { getMyProfile, listMyBoardPosts, listMyInquiries } from "@lib/account";
import { formatDate } from "@lib/format";

export const metadata: Metadata = {
  title: "마이페이지",
  robots: { index: false, follow: false },
};

/**
 * constants
 */
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

const PROVIDER_LABEL: Record<string, string> = {
  kakao: "카카오",
  google: "구글",
};

const ERROR_MESSAGES: Record<string, string> = {
  name: `닉네임은 1~${PROFILE_LIMIT.name}자로 적어 주세요.`,
  phone: "휴대전화 번호를 확인해 주세요. 예: 010-1234-5678",
  birthDate: "생년월일을 확인해 주세요.",
  confirm: "안내를 확인했다는 칸에 표시해 주세요.",
  owner: "재단 오너 계정은 권한을 넘긴 뒤에 탈퇴할 수 있습니다.",
};

const TABS = [
  { id: "settings", label: "개인정보 설정" },
  { id: "inquiries", label: "내 문의 내역" },
  { id: "posts", label: "내 게시글" },
] as const;

const FIELD_CLASS =
  "h-12 rounded-xlarge border border-beige bg-white px-4 outline-none focus:border-pine read-only:bg-paper read-only:text-muted";

/**
 * types
 */
type Props = {
  searchParams: Promise<{ tab?: string; saved?: string; error?: string }>;
};

type TabId = (typeof TABS)[number]["id"];

type TabNavProps = {
  activeId: TabId;
};

type Profile = NonNullable<Awaited<ReturnType<typeof getMyProfile>>>;

type Inquiry = Awaited<ReturnType<typeof listMyInquiries>>[number];

type BoardPost = Awaited<ReturnType<typeof listMyBoardPosts>>[number];

type ProfileSectionProps = {
  profile: Profile;
  isAdmin: boolean;
};

type SettingsSectionProps = {
  profile: Profile;
  savedAt: string | null;
  error: string | null;
};

type InquirySectionProps = {
  inquiries: Inquiry[];
};

type PostSectionProps = {
  posts: BoardPost[];
};

type WithdrawSectionProps = {
  error: string | null;
};

type BlockProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
};

type FieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  type?: "text" | "tel" | "date" | "email";
  placeholder?: string;
  hint?: string;
  isReadOnly?: boolean;
  maxLength?: number;
};

type NoticeProps = {
  tone: "pine" | "gold";
  children: ReactNode;
};

type EmptyProps = {
  children: ReactNode;
};

type DeleteButtonProps = {
  id: string;
  action: (formData: FormData) => Promise<void>;
  question: string;
};

/**
 * screen — 마이페이지. 프로필 아래 탭(`?tab=`)으로 개인정보 설정(회원 탈퇴 포함)·내 문의·내 게시글 중 하나만 보인다
 */
const MyPageScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const user = await getSessionProfile();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/mypage")}`);
  }
  const [profile, inquiries, posts] = await Promise.all([
    getMyProfile(user.id),
    listMyInquiries(user.id),
    listMyBoardPosts(user.id),
  ]);
  if (!profile) {
    redirect("/login");
  }
  const error = params.error ? (ERROR_MESSAGES[params.error] ?? null) : null;
  const isWithdrawError =
    params.error === "confirm" || params.error === "owner";
  const activeTab = readTab(params.tab);
  // render
  return (
    <section className="page-article flex flex-col gap-8 py-12">
      <PageIntro eyebrow="내 계정" title="마이페이지" />
      <ProfileSection profile={profile} isAdmin={user.role !== null} />
      <TabNav activeId={activeTab} />
      {activeTab === "settings" ? (
        <>
          <SettingsSection
            profile={profile}
            savedAt={params.saved ?? null}
            error={isWithdrawError ? null : error}
          />
          <WithdrawSection error={isWithdrawError ? error : null} />
        </>
      ) : null}
      {activeTab === "inquiries" ? (
        <InquirySection inquiries={inquiries} />
      ) : null}
      {activeTab === "posts" ? <PostSection posts={posts} /> : null}
    </section>
  );
};

/**
 * section
 */
const TabNav = ({ activeId }: TabNavProps) => (
  <nav
    aria-label="마이페이지 메뉴"
    className="flex gap-1 rounded-full border border-beige bg-white p-1">
    {TABS.map(tab => {
      const isActive = tab.id === activeId;
      return (
        <Link
          key={tab.id}
          href={tab.id === "settings" ? "/mypage" : `/mypage?tab=${tab.id}`}
          aria-current={isActive ? "page" : undefined}
          scroll={false}
          className={cn(
            "flex-1 rounded-full px-2 py-2.5 text-center text-3.5 leading-5 whitespace-nowrap transition-colors duration-150 md:px-3 md:text-4",
            isActive
              ? "bg-pine font-semibold text-paper"
              : "text-muted hover:bg-paper hover:text-pine",
          )}>
          {tab.label}
        </Link>
      );
    })}
  </nav>
);

const ProfileSection = ({ profile, isAdmin }: ProfileSectionProps) => (
  <div className="flex flex-col items-center gap-6 rounded-3xlarge border border-beige bg-white p-6 md:flex-row md:items-center md:p-8">
    <div className="flex flex-col items-center gap-1">
      <AvatarPicker name={profile.name} avatarUrl={profile.avatarUrl} />
      {profile.avatarUrl ? (
        <form action={removeMyAvatar}>
          <button
            type="submit"
            className="text-3.5 leading-5 text-muted underline-offset-2 hover:text-pine hover:underline">
            기본 이미지로
          </button>
        </form>
      ) : null}
    </div>
    <div className="flex flex-1 flex-col items-center gap-1 md:items-start">
      <p className="text-8 leading-10 font-semibold text-pine">
        {profile.name || "회원"}
      </p>
      <BrandText variant="smallCompact" color="muted">
        {profile.email ?? "이메일 없음"}
      </BrandText>
      <BrandText variant="caption" color="goldDeep" className="mt-1">
        {PROVIDER_LABEL[profile.provider] ?? profile.provider} 계정 ·{" "}
        {formatDate(profile.createdAt)} 가입
      </BrandText>
    </div>
    <div className="flex w-full flex-col gap-2 md:w-auto">
      {isAdmin ? (
        <Button
          variant="solid"
          color="pine"
          size="small"
          text="관리자 화면"
          href={ADMIN_URL}
          rightChildren={<Icon name="external-link" size={14} />}
          isRound
          isFullWidth
        />
      ) : null}
      <form action="/auth/logout" method="post">
        <Button
          variant="line"
          color="paper"
          size="small"
          type="submit"
          text="로그아웃"
          leftChildren={<Icon name="log-out" size={14} />}
          isRound
          isFullWidth
        />
      </form>
    </div>
  </div>
);

const SettingsSection = ({ profile, savedAt, error }: SettingsSectionProps) => (
  <Block
    id="settings"
    title="개인정보 설정"
    description="닉네임은 게시판과 상단 메뉴에 보입니다. 휴대전화와 생년월일은 후원 안내에만 쓰고 공개하지 않습니다.">
    <form action={updateMyProfile} className="grid gap-4 md:grid-cols-2">
      <Field
        label="닉네임"
        name="name"
        defaultValue={profile.name}
        maxLength={PROFILE_LIMIT.name}
      />
      <Field
        label="이메일"
        name="email"
        type="email"
        defaultValue={profile.email ?? ""}
        hint="로그인한 계정의 이메일입니다."
        isReadOnly
      />
      <Field
        label="휴대전화"
        name="phone"
        type="tel"
        defaultValue={profile.phone}
        placeholder="010-1234-5678"
      />
      <Field
        label="생년월일"
        name="birthDate"
        type="date"
        defaultValue={profile.birthDate ?? ""}
      />
      <div className="flex items-center justify-end gap-4 md:col-span-2">
        {error ? (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-4 leading-5 text-gold-deep">
            <Icon name="alert-circle" size={16} />
            {error}
          </p>
        ) : null}
        {savedAt ? (
          <FlashToast key={savedAt} text="저장했습니다." param="saved" />
        ) : null}
        <Button
          variant="solid"
          color="pine"
          type="submit"
          text="저장하기"
          isRound
        />
      </div>
    </form>
  </Block>
);

const InquirySection = ({ inquiries }: InquirySectionProps) => (
  <Block
    id="inquiries"
    title="내 문의 내역"
    description="로그인한 상태로 남긴 후원 알림입니다. 필요 없으면 직접 지울 수 있습니다.">
    {inquiries.length === 0 ? (
      <Empty>
        남긴 문의가 없습니다.{" "}
        <Link href="/donate" className="text-pine underline">
          후원 알림 남기기
        </Link>
      </Empty>
    ) : (
      <ul className="overflow-hidden rounded-2xlarge border border-beige bg-white">
        {inquiries.map(inquiry => (
          <li
            key={inquiry.id}
            className="flex flex-col gap-2 border-b border-beige px-5 py-4 last:border-b-0 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium text-pine">
                  {donationKindLabel(inquiry.kind)}
                </span>
                {inquiry.amount ? (
                  <span className="text-4 leading-5 text-ink">
                    {inquiry.amount}
                  </span>
                ) : null}
                <span className="text-4 leading-5 text-muted">
                  {formatDate(inquiry.createdAt)}
                </span>
              </p>
              {inquiry.message ? (
                <p className="text-4 leading-6 break-all whitespace-pre-line text-ink/80">
                  {inquiry.message}
                </p>
              ) : null}
            </div>
            <DeleteButton
              id={inquiry.id}
              action={deleteMyInquiry}
              question="이 문의를 지울까요?"
            />
          </li>
        ))}
      </ul>
    )}
  </Block>
);

const PostSection = ({ posts }: PostSectionProps) => (
  <Block
    id="posts"
    title="내 게시글"
    description="게시판에 쓴 글을 고치거나 지웁니다.">
    {posts.length === 0 ? (
      <Empty>
        쓴 글이 없습니다.{" "}
        <Link href="/board/write" className="text-pine underline">
          글쓰기
        </Link>
      </Empty>
    ) : (
      <ul className="overflow-hidden rounded-2xlarge border border-beige bg-white">
        {posts.map(post => (
          <li
            key={post.id}
            className="flex flex-col gap-2 border-b border-beige px-5 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:gap-6">
            <Link
              href={`/board/${post.id}`}
              className="min-w-0 hover:text-pine">
              <span className="font-medium break-all">{post.title}</span>
              <span className="mt-1 flex gap-3 text-4 leading-5 text-muted">
                <span>{formatDate(post.createdAt)}</span>
                <span>댓글 {post.commentCount}</span>
                <span>좋아요 {post.likeCount}</span>
              </span>
            </Link>
            <div className="flex shrink-0 items-start gap-2">
              <Link
                href={`/board/write?id=${post.id}`}
                className={buttonStyle({
                  variant: "line",
                  color: "pine",
                  size: "xsmall",
                  isRound: true,
                })}>
                <Icon name="edit" size={14} />
                고치기
              </Link>
              <DeleteButton
                id={post.id}
                action={deleteMyBoardPost}
                question="이 글을 지울까요? 댓글과 좋아요도 함께 지워집니다."
              />
            </div>
          </li>
        ))}
      </ul>
    )}
  </Block>
);

const WithdrawSection = ({ error }: WithdrawSectionProps) => (
  <Block
    id="withdraw"
    title="회원 탈퇴"
    description="탈퇴하면 프로필, 사진, 문의 내역이 바로 지워지고 되돌릴 수 없습니다. 게시판에 쓴 글과 댓글은 남고 글쓴이 연결만 끊깁니다.">
    <form
      action={withdrawMe}
      className="flex flex-col gap-4 rounded-2xlarge border border-beige bg-white px-5 py-5 md:flex-row md:items-center md:justify-between">
      {error ? <Notice tone="gold">{error}</Notice> : null}
      <label className="flex items-start gap-2 text-4 leading-6">
        <input name="confirm" type="checkbox" className="mt-1 accent-pine" />위
        안내를 확인했고 탈퇴합니다.
      </label>
      <Button
        variant="line"
        color="paper"
        size="small"
        type="submit"
        text="탈퇴하기"
        isRound
      />
    </form>
  </Block>
);

/**
 * inner components
 */
const Block = ({ id, title, description, children }: BlockProps) => (
  <div id={id} className="flex scroll-mt-28 flex-col gap-4">
    <div>
      <BrandText as="h2" variant="heading" color="pine">
        {title}
      </BrandText>
      {description ? (
        <BrandText variant="smallCompact" color="muted" className="mt-1">
          {description}
        </BrandText>
      ) : null}
    </div>
    {children}
  </div>
);

const Field = ({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  hint,
  isReadOnly = false,
  maxLength,
}: FieldProps) => (
  <label className="flex flex-col gap-2 text-4 leading-5">
    {label}
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      readOnly={isReadOnly}
      maxLength={maxLength}
      className={FIELD_CLASS}
    />
    {hint ? (
      <span className="text-3.5 leading-5 text-muted">{hint}</span>
    ) : null}
  </label>
);

const Notice = ({ tone, children }: NoticeProps) => (
  <p
    role="status"
    className={cn(
      "rounded-xlarge bg-paper px-4 py-3 text-4 leading-5 md:col-span-2",
      tone === "pine" ? "text-pine" : "text-gold-deep",
    )}>
    {children}
  </p>
);

const Empty = ({ children }: EmptyProps) => (
  <p className="rounded-2xlarge border border-beige bg-white px-6 py-8 text-4 leading-6 text-muted">
    {children}
  </p>
);

const DeleteButton = ({ id, action, question }: DeleteButtonProps) => (
  <details className="group relative shrink-0">
    <summary
      className={buttonStyle({
        variant: "line",
        color: "paper",
        size: "xsmall",
        isRound: true,
        className: "list-none [&::-webkit-details-marker]:hidden",
      })}>
      <Icon name="trash" size={14} />
      지우기
    </summary>
    <form
      action={action}
      className="absolute top-full right-0 z-10 mt-2 flex w-56 flex-col gap-3 rounded-xlarge border border-beige bg-white p-4 shadow-large">
      <input type="hidden" name="id" value={id} />
      <p className="text-4 leading-5 text-ink">
        {question} 되돌릴 수 없습니다.
      </p>
      <Button
        variant="solid"
        color="pine"
        size="xsmall"
        type="submit"
        text="지우기"
        isRound
        isFullWidth
      />
    </form>
  </details>
);

/**
 * utils
 */
const readTab = (value: string | undefined): TabId =>
  TABS.find(tab => tab.id === value)?.id ?? "settings";

export default MyPageScreen;
