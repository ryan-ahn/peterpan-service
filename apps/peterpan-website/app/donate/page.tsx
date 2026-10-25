import type { Metadata } from "next";
import Link from "next/link";

import Button from "@repo/ui/components/button";

import { submitDonationInquiry } from "@app/donate/actions";
import BrandText from "@components/brandText";
import PageIntro from "@components/pageIntro";

export const metadata: Metadata = { title: "기부하기" };

/**
 * constants
 */
const WAYS = ["창립발기 1구좌 10만 원", "정기 후원", "일시 후원"];

const KIND_OPTIONS = [
  { value: "founding", label: "창립발기 (1구좌 10만 원)" },
  { value: "monthly", label: "정기 후원" },
  { value: "once", label: "일시 후원" },
];

const FIELD_CLASS =
  "h-12 rounded-xlarge border border-beige bg-white px-4 outline-none focus:border-pine";

/**
 * types
 */
type Props = {
  searchParams: Promise<{ sent?: string }>;
};

type FormSectionProps = {
  isSent: boolean;
};

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  isRequired?: boolean;
  placeholder?: string;
};

/**
 * screen — 기부와 후원 안내, 참여 의사 남기기
 */
const DonateScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  // render
  return (
    <section className="page-form grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <GuideSection />
      <FormSection isSent={params.sent === "1"} />
    </section>
  );
};

/**
 * section
 */
const GuideSection = () => (
  <div>
    <PageIntro eyebrow="함께하기" title="기부와 후원" />
    <div className="mt-6 flex flex-col gap-4">
      <BrandText variant="body" color="muted">
        창립발기는 1구좌 10만 원으로 참여할 수 있습니다. 소액의 정기 후원도
        마을의 주춧돌이 됩니다. 계좌와 기부금영수증 발행 정보는 설립 등기와 지정
        절차가 끝난 뒤 이 페이지에 공개합니다.
      </BrandText>
      <BrandText variant="body" color="muted">
        지금은 참여 의사를 남겨 주시면, 연락처가 확정되는 대로 재단이
        안내합니다. 남기신 정보는 후원 안내 외의 목적으로 쓰지 않습니다.
      </BrandText>
    </div>
    <ul className="mt-8 flex flex-col gap-3 text-4 leading-5">
      {WAYS.map(way => (
        <li key={way} className="rounded-xlarge bg-white px-4 py-3">
          {way}
        </li>
      ))}
    </ul>
  </div>
);

const FormSection = ({ isSent }: FormSectionProps) => (
  <form
    action={submitDonationInquiry}
    className="rounded-3xlarge bg-white p-6 md:p-8">
    {isSent ? (
      <p className="mb-4 rounded-xlarge bg-paper px-4 py-3 text-4 leading-5 text-pine">
        참여 의사를 남겼습니다. 안내가 준비되면 연락드리겠습니다.
      </p>
    ) : null}
    <div className="grid gap-4">
      <Field label="이름" name="name" isRequired />
      <Field label="이메일" name="email" type="email" isRequired />
      <Field label="전화" name="phone" type="tel" />
      <label className="flex flex-col gap-2 text-4 leading-5">
        참여 방법
        <select name="kind" defaultValue="founding" className={FIELD_CLASS}>
          {KIND_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <Field label="희망 금액" name="amount" placeholder="예: 10만 원" />
      <label className="flex flex-col gap-2 text-4 leading-5">
        하고 싶은 말
        <textarea
          name="message"
          rows={4}
          className="rounded-xlarge border border-beige px-4 py-3 outline-none focus:border-pine"
        />
      </label>
      <label className="flex items-start gap-2 text-4 leading-7">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 accent-pine"
        />
        <span>
          개인정보 수집·이용에 동의합니다. 항목은 이름, 연락처, 참여 내용이며
          후원 안내 후 파기합니다.{" "}
          <Link href="/privacy" className="text-pine underline">
            처리방침
          </Link>
        </span>
      </label>
      <Button
        variant="solid"
        color="pine"
        type="submit"
        text="참여 의사 남기기"
        isRound
        isFullWidth
      />
    </div>
  </form>
);

/**
 * inner components
 */
const Field = ({
  label,
  name,
  type = "text",
  isRequired = false,
  placeholder,
}: FieldProps) => (
  <label className="flex flex-col gap-2 text-4 leading-5">
    {label}
    <input
      name={name}
      type={type}
      required={isRequired}
      placeholder={placeholder}
      className={FIELD_CLASS}
    />
  </label>
);

export default DonateScreen;
