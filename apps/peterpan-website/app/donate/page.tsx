import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";

import { getSessionProfile } from "@repo/auth/session";
import Button from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import { submitDonationInquiry } from "@app/donate/actions";
import BandSection from "@components/bandSection";
import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import InfoCard from "@components/infoCard";
import OnceDonationLocked from "@components/onceDonationLocked";
import PledgeSlotPicker from "@components/pledgeSlotPicker";
import { getMyProfile } from "@lib/account";

export const metadata: Metadata = {
  title: "후원하기",
  description:
    "구글폼으로 약정해 주신 분을 위한 창립발기 구좌 선택과 공식 후원 계좌 입금 안내. 보내 주신 후원금은 재단 설립을 위한 출연재산으로 관리합니다.",
};

/**
 * constants
 */
const DONATION_ACCOUNT = {
  bank: "신한은행",
  number: "140-016-509124",
  holder: "재단법인 피터팬 설립추진위원회",
};

const PAYMENT_CHANNELS_NOTE =
  "지금은 계좌이체로만 후원을 받고 있습니다. 재단법인 설립과 결제대행사(PG) 심사가 마무리되면 카드 결제와 매달 자동으로 이어지는 정기 후원을 열겠습니다. 조금만 기다려 주세요.";

const ONCE_DONATION_DESCRIPTION =
  "창립발기 약정 없이 처음 후원하시는 분을 위한 일시 후원입니다. 마음에 드는 금액을 보내 주시면 아래 양식으로 알려 주시고, 이름 벽과 후원 내역에 남깁니다. 지금은 약정 이행만 받고 있어 이 양식은 조만간 열 예정입니다.";

const ONCE_DONATION_LOCKED_HINT =
  "처음 후원 양식은 조만간 열 예정입니다. 지금은 위 안내에 따라 약정 이행을 진행해 주세요.";

const PLEDGE_STEPS = [
  {
    step: "1",
    title: "구좌 선택",
    body: "약정하신 구좌 수를 고르면 입금할 금액(1구좌 10만 원)이 안내됩니다.",
  },
  {
    step: "2",
    title: "입금",
    body: "아래 공식 후원 계좌로 선택한 금액을 보내 주세요. 전액 출연재산으로 관리합니다.",
  },
  {
    step: "3",
    title: "후원 남기기",
    body: "입금 후 양식을 남겨 주시면 입금 내역과 성함을 맞춰 기록합니다.",
  },
];

const PLEDGE_NOTES = [
  "구글폼으로 약정해 주신 분은 약정한 구좌에 맞는 금액을 이 계좌로 보내 주세요.",
  "남겨 주신 이메일과 휴대폰 문자로 개별 안내를 드렸습니다.",
  "공식 계좌로 보내 주신 후원금은 관련 규정에 따라 재단 설립을 위한 출연재산으로 전환됩니다.",
];

const BEFORE_NOTES = [
  "피터팬 재단은 지금 설립을 추진하는 단계입니다. 법인 설립허가와 등기는 아직 마치지 않았습니다.",
  "후원금은 「재단법인 피터팬 설립추진위원회」가 관리합니다.",
  "후원금은 재단 설립을 위한 출연재산으로 쓰이며, 모금과 사용 내역을 공개하겠습니다.",
  "기부금 영수증은 발급 가능 여부와 시점이 확정되면 따로 안내드리겠습니다.",
  "후원을 취소하거나 돌려받아야 하면 재단 연락처로 알려 주세요. 확인한 뒤 개별로 안내드리겠습니다.",
];

const SEPARATE_ACCOUNTS = [
  {
    meta: "후원금 계좌",
    title: "여러분의 후원금",
    body: "공식 후원 계좌입니다. 이 계좌로 들어온 후원금은 관련 규정과 약정에 따라 재단 설립을 위한 출연재산으로 관리합니다.",
  },
  {
    meta: "출연금 계좌",
    title: "꼭두 님의 출연금",
    body: "전경철 님(꼭두)이 모아 두신 132,729,220원이 계좌 개설과 함께 출연금으로 납입되었습니다. 시민 후원금과 따로 관리합니다.",
  },
  {
    meta: "운영비 계좌",
    title: "규정상 둔 운영비",
    body: "추진위원은 무급으로 활동합니다. 쌓인 예산은 회의비로도 쓰지 않습니다.",
  },
];

const WALL_ROWS = 4;

const WALL_BRICKS_PER_ROW = 5;

const FIELD_CLASS =
  "h-12 rounded-xlarge border border-beige bg-white px-4 outline-none focus:border-pine";

/**
 * types
 */
type Props = {
  searchParams: Promise<{ sent?: string }>;
};

type Profile = Awaited<ReturnType<typeof getMyProfile>>;

type NoticeSectionProps = {
  isSent: boolean;
};

type ProfileNoticeFormProps = NoticeSectionProps & {
  variant: "pledge" | "once";
};

type NoticeFormProps = {
  isSent: boolean;
  profile: Profile;
  isLoading?: boolean;
  isLocked?: boolean;
  variant: "pledge" | "once";
};

type AccountRowProps = {
  label: string;
  value: string;
};

type BrickProps = {
  isHalf?: boolean;
};

type CheckItemProps = {
  text: string;
};

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
};

/**
 * screen — 후원하기. 약정 구좌 선택·입금·후원 남기기. 일시 후원은 아래에 따로 둔다
 */
const DonateScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  // render
  return (
    <article>
      <FoundationHeader
        overline="Pledge fulfillment"
        title="약정 이행 · 입금"
        lead="구글폼으로 창립발기 약정을 해 주신 분께 안내드립니다. 약정한 구좌 수를 선택하고 공식 후원 계좌로 입금한 뒤, 아래 양식으로 알려 주시면 입금 내역과 성함을 맞춰 기록합니다. 보내 주신 후원금은 재단 설립을 위한 출연재산으로 관리하고, 모금과 사용 내역을 공개하겠습니다."
      />
      <PledgeDepositSection />
      <SeparateSection />
      <WallSection />
      <NoticeSection isSent={params.sent === "1"} />
      <OnceSection />
    </article>
  );
};

/**
 * section
 */
const PledgeDepositSection = () => (
  <BandSection
    overline="How to send"
    title="구좌 선택과 입금"
    description="창립발기 약정은 1구좌 10만 원입니다. 아래 순서대로 진행해 주세요.">
    <BrandText
      variant="bodyCompact"
      color="muted"
      className="rounded-xlarge border border-beige bg-paper px-5 py-4">
      {PAYMENT_CHANNELS_NOTE}
    </BrandText>
    <ol className="mt-6 grid gap-3 md:grid-cols-3">
      {PLEDGE_STEPS.map(item => (
        <li
          key={item.step}
          className="flex flex-col gap-2 rounded-xlarge border border-beige bg-white px-5 py-5">
          <span className="text-4 leading-5 font-semibold text-sage">
            {item.step}단계
          </span>
          <h3 className="text-5 leading-7 font-semibold text-pine">
            {item.title}
          </h3>
          <p className="text-4 leading-6 text-ink/80">{item.body}</p>
        </li>
      ))}
    </ol>
    <div className="mt-6 rounded-xlarge border border-beige bg-white px-6 py-7">
      <h3 className="text-5 leading-7 font-semibold text-pine">
        공식 후원 계좌
      </h3>
      <dl className="mt-4 flex flex-col gap-3">
        <AccountRow label="은행" value={DONATION_ACCOUNT.bank} />
        <AccountRow label="계좌번호" value={DONATION_ACCOUNT.number} />
        <AccountRow label="예금주" value={DONATION_ACCOUNT.holder} />
      </dl>
      <ul className="mt-6 flex flex-col gap-2 border-t border-beige pt-6">
        {PLEDGE_NOTES.map(note => (
          <CheckItem key={note} text={note} />
        ))}
      </ul>
    </div>
    <div className="mt-4 rounded-xlarge bg-paper px-6 py-6">
      <h3 className="text-5 leading-7 font-semibold text-pine">
        후원 전에 확인해 주세요
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {BEFORE_NOTES.map(note => (
          <CheckItem key={note} text={note} />
        ))}
      </ul>
    </div>
    <Button
      variant="solid"
      color="pine"
      text="구좌 선택 · 후원 남기기"
      href="#notice"
      isRound
      className="mt-6"
    />
  </BandSection>
);

const SeparateSection = () => (
  <BandSection
    overline="Three accounts"
    title="세 개의 통장, 나눠서 투명하게"
    description="설립추진위원회 통장은 쓰임에 따라 셋으로 나뉘어 따로 관리됩니다."
    tone="paper">
    <div className="grid gap-4 md:grid-cols-3">
      {SEPARATE_ACCOUNTS.map(account => (
        <InfoCard
          key={account.meta}
          meta={account.meta}
          title={account.title}
          body={account.body}
        />
      ))}
    </div>
  </BandSection>
);

const WallSection = () => (
  <BandSection
    overline="Name wall"
    title="이름을 벽돌처럼 쌓겠습니다"
    description="재단법인 피터팬이 승인되면 출연자 한 분 한 분의 성함을 이 홈페이지에 벽돌처럼 쌓아 보여 드립니다. 이름 공개에 동의해 주신 분의 이름만 올립니다.">
    <div
      aria-hidden
      className="flex flex-col gap-2 overflow-hidden rounded-xlarge border border-beige bg-paper p-3">
      {Array.from({ length: WALL_ROWS }, (_, row) => {
        const isOffset = row % 2 === 1;
        return (
          <div key={row} className="flex gap-2">
            {isOffset ? <Brick isHalf /> : null}
            {Array.from(
              { length: WALL_BRICKS_PER_ROW - (isOffset ? 1 : 0) },
              (_, index) => (
                <Brick key={index} />
              ),
            )}
            {isOffset ? <Brick isHalf /> : null}
          </div>
        );
      })}
    </div>
    <BrandText variant="bodyCompact" color="muted" className="mt-6">
      이름을 올리고 싶으시면 후원을 남길 때 이름 벽에 올릴 이름을 적어 주세요.
      적어 주신 이름만 공개합니다. 출연과 후원금의 쓰임은{" "}
      <Link href="/disclosure/donations" className="text-pine underline">
        기부금 공시
      </Link>
      로 공개하겠습니다.
    </BrandText>
  </BandSection>
);

const NoticeSection = ({ isSent }: NoticeSectionProps) => (
  <BandSection
    id="notice"
    overline="Step 3"
    title="약정 이행 알리기"
    description="입금을 마친 뒤 약정 구좌와 연락처를 남겨 주세요. 입금 내역과 맞춰 기록하고, 이름 벽과 이후 기부금 영수증 안내에 씁니다."
    tone="paper">
    <Suspense
      fallback={
        <NoticeForm isSent={isSent} profile={null} isLoading variant="pledge" />
      }>
      <ProfileNoticeForm isSent={isSent} variant="pledge" />
    </Suspense>
  </BandSection>
);

const OnceSection = () => (
  <OnceDonationLocked hintText={ONCE_DONATION_LOCKED_HINT}>
    <BandSection
      overline="One-time gift"
      title="처음 후원하시는 분"
      description={ONCE_DONATION_DESCRIPTION}>
      <NoticeForm isSent={false} profile={null} variant="once" isLocked />
    </BandSection>
  </OnceDonationLocked>
);

/**
 * inner components
 */

/**
 * 로그인한 회원이면 이름·이메일·휴대전화를 채운 후원 양식
 */
const ProfileNoticeForm = async ({
  isSent,
  variant,
}: ProfileNoticeFormProps) => {
  // variables
  const user = await getSessionProfile();
  const profile = user ? await getMyProfile(user.id) : null;
  // render
  return <NoticeForm isSent={isSent} profile={profile} variant={variant} />;
};

/**
 * 후원 양식. `isLoading`이면 회원 정보를 읽는 중이라 같은 양식을 누를 수 없게 보인다
 */
const NoticeForm = ({
  isSent,
  profile,
  isLoading = false,
  isLocked = false,
  variant,
}: NoticeFormProps) => (
  <form
    action={isLocked ? undefined : submitDonationInquiry}
    inert={isLoading || isLocked}
    className="rounded-xlarge border border-beige bg-white p-6 md:p-8">
    {isSent && !isLocked ? (
      <p className="mb-6 rounded-xlarge bg-paper px-4 py-3 text-4 leading-5 text-pine">
        후원을 남겼습니다. 입금 내역을 확인한 뒤 연락드리겠습니다.
        {profile ? (
          <>
            {" "}
            <Link href="/mypage?tab=inquiries" className="underline">
              내 후원 내역
            </Link>
            에서 볼 수 있습니다.
          </>
        ) : null}
      </p>
    ) : null}
    <fieldset
      disabled={isLocked}
      className="grid gap-4 border-0 p-0 md:grid-cols-2">
      {variant === "pledge" ? (
        <div className="md:col-span-2">
          <PledgeSlotPicker />
        </div>
      ) : (
        <input type="hidden" name="kind" value="once" />
      )}
      <Field label="이름" name="name" defaultValue={profile?.name} isRequired />
      <Field
        label="이메일"
        name="email"
        type="email"
        defaultValue={profile?.email ?? undefined}
        isRequired
      />
      <Field
        label="휴대전화"
        name="phone"
        type="tel"
        defaultValue={profile?.phone}
      />
      {variant === "once" ? (
        <Field label="보낸 금액" name="amount" placeholder="예: 50,000원" />
      ) : null}
      <Field
        label="입금자명"
        name="depositorName"
        hint="이름과 다를 때만 적어 주세요."
      />
      <div className="md:col-span-2">
        <Field
          label="이름 벽에 올릴 이름"
          name="wallName"
          placeholder="예: 홍길동, 피터팬즈 가족"
        />
      </div>
      <label className="flex flex-col gap-2 text-4 leading-5 md:col-span-2">
        남기는 말
        <textarea
          name="message"
          rows={4}
          className="rounded-xlarge border border-beige px-4 py-3 outline-none focus:border-pine"
        />
      </label>
      <label className="flex items-start gap-2 text-4 leading-7 md:col-span-2">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 accent-pine"
        />
        <span>
          개인정보 수집·이용에 동의합니다. 항목은 이름, 연락처, 후원 내용,
          입금자명, 이름 벽에 올릴 이름이며 기록과 안내를 마치면 파기합니다.{" "}
          <Link href="/privacy" className="text-pine underline">
            처리방침
          </Link>
        </span>
      </label>
      <Button
        variant="solid"
        color="pine"
        type="submit"
        text={variant === "pledge" ? "약정 이행 알리기" : "후원 남기기"}
        isRound
        isFullWidth
        className="md:col-span-2"
        isDisabled={isLocked}
      />
    </fieldset>
  </form>
);

const AccountRow = ({ label, value }: AccountRowProps) => (
  <div className="flex flex-col gap-1 md:flex-row md:gap-6">
    <dt className="w-24 shrink-0 text-4 leading-7 text-ink/70">{label}</dt>
    <dd
      className={
        value
          ? "text-6 leading-8 font-semibold text-pine"
          : "text-5 leading-8 text-ink/50"
      }>
      {value || "공개 준비 중"}
    </dd>
  </div>
);

const Brick = ({ isHalf = false }: BrickProps) => (
  <span
    className={cn(
      "h-8 rounded-small border border-beige bg-white md:h-10",
      isHalf ? "flex-[0.5]" : "flex-1",
    )}
  />
);

const CheckItem = ({ text }: CheckItemProps) => (
  <li className="flex gap-2 text-4 leading-7 text-ink/90">
    <Icon name="check" size={16} className="mt-1.5 shrink-0 text-sage" />
    {text}
  </li>
);

const Field = ({
  label,
  name,
  type = "text",
  isRequired = false,
  placeholder,
  defaultValue,
  hint,
}: FieldProps) => (
  <label className="flex flex-col gap-2 text-4 leading-5">
    {label}
    <input
      name={name}
      type={type}
      required={isRequired}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className={FIELD_CLASS}
    />
    {hint ? <span className="text-3 leading-4 text-ink/60">{hint}</span> : null}
  </label>
);

export default DonateScreen;
