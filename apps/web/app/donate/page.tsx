import type { Metadata } from "next";

import { submitDonationInquiry } from "@/app/donate/actions";

export const metadata: Metadata = { title: "기부하기" };

type DonatePageProps = {
  searchParams: Promise<{ sent?: string }>;
};

const DonatePage = async ({ searchParams }: DonatePageProps) => {
  const params = await searchParams;
  return (
    <section className="mx-auto grid w-[min(1100px,calc(100%-2rem))] gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-sm text-gold-deep">함께하기</p>
        <h1 className="mt-2 text-4xl font-semibold text-green">기부와 후원</h1>
        <div className="mt-6 flex flex-col gap-4 leading-8 text-muted">
          <p>
            창립발기는 1구좌 10만 원으로 참여할 수 있습니다. 소액의 정기 후원도
            마을의 주춧돌이 됩니다. 계좌와 기부금영수증 발행 정보는 설립 등기와
            지정 절차가 끝난 뒤 이 페이지에 공개합니다.
          </p>
          <p>
            지금은 참여 의사를 남겨 주시면, 연락처가 확정되는 대로 재단이
            안내합니다. 남기신 정보는 후원 안내 외의 목적으로 쓰지 않습니다.
          </p>
        </div>
        <ul className="mt-8 flex flex-col gap-3 text-sm">
          <li className="rounded-2xl bg-white px-4 py-3">창립발기 1구좌 10만 원</li>
          <li className="rounded-2xl bg-white px-4 py-3">정기 후원</li>
          <li className="rounded-2xl bg-white px-4 py-3">일시 후원</li>
        </ul>
      </div>
      <form action={submitDonationInquiry} className="rounded-[2rem] bg-white p-6 md:p-8">
        {params.sent === "1" ? (
          <p className="mb-4 rounded-2xl bg-paper px-4 py-3 text-sm text-green">
            참여 의사를 남겼습니다. 안내가 준비되면 연락드리겠습니다.
          </p>
        ) : null}
        <div className="grid gap-4">
          <Field label="이름" name="name" required />
          <Field label="이메일" name="email" type="email" required />
          <Field label="전화" name="phone" />
          <label className="flex flex-col gap-2 text-sm">
            참여 방법
            <select name="kind" className="h-12 rounded-2xl border border-beige px-4" defaultValue="founding">
              <option value="founding">창립발기 (1구좌 10만 원)</option>
              <option value="monthly">정기 후원</option>
              <option value="once">일시 후원</option>
            </select>
          </label>
          <Field label="희망 금액" name="amount" placeholder="예: 10만 원" />
          <label className="flex flex-col gap-2 text-sm">
            하고 싶은 말
            <textarea name="message" rows={4} className="rounded-2xl border border-beige px-4 py-3" />
          </label>
          <label className="flex items-start gap-2 text-sm leading-6">
            <input name="consent" type="checkbox" required className="mt-1" />
            개인정보 수집·이용에 동의합니다. 항목은 이름, 연락처, 참여 내용이며
            후원 안내 후 파기합니다.{" "}
            <a href="/privacy" className="text-green underline">
              처리방침
            </a>
          </label>
          <button type="submit" className="h-12 rounded-full bg-green text-white">
            참여 의사 남기기
          </button>
        </div>
      </form>
    </section>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-2 text-sm">
    {label}
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="h-12 rounded-2xl border border-beige px-4"
    />
  </label>
);

export default DonatePage;
