import Link from "next/link";

import type { SiteContact } from "@repo/db/siteContact";

import Logo from "@components/logo";
import { displayOrPreparing } from "@lib/format";
import { FOOTER_LINKS } from "@lib/nav";

/**
 * types
 */
type Props = {
  contact: SiteContact;
};

/**
 * 하단 재단 정보와 링크
 * @param contact 관리자 기본정보에서 저장한 연락처
 */
const SiteFooter = ({ contact }: Props) => {
  // variables
  const rows = [
    { label: "재단명", value: "재단법인 피터팬 자폐인복지재단" },
    { label: "대표", value: contact.representative },
    { label: "주소", value: contact.address },
    { label: "연락처", value: displayOrPreparing(contact.phone) },
    { label: "이메일", value: displayOrPreparing(contact.email) },
    {
      label: "고유번호",
      value: displayOrPreparing(contact.registrationNumber),
    },
  ];
  // render
  return (
    <footer className="bg-pine-deep text-paper">
      <div className="page-wide grid gap-10 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-16 place-items-center rounded-xlarge bg-white">
              <Logo variant="symbol" />
            </span>
            <div>
              <p className="text-6 leading-7 font-semibold">피터팬 재단</p>
              <p className="font-en text-3 leading-4 font-medium tracking-caps text-beige">
                PETER PAN FOUNDATION
              </p>
            </div>
          </div>
          <p className="mt-5 text-4 leading-5 text-gold">
            자폐인의 오늘, 더 넓은 내일로
          </p>
          <p className="mt-3 max-w-md text-4 leading-9 text-beige">
            재단법인 피터팬 자폐인복지재단은 성인 중증 자폐성장애인이 혼자가
            되어도 혼자가 아닌 삶을 이어 가도록 생활주거공동체를 준비합니다.
          </p>
        </div>
        <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 text-4 leading-5 text-beige">
          {rows.map(row => (
            <div key={row.label} className="contents">
              <dt>{row.label}</dt>
              <dd className="text-paper">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="border-t border-white/10">
        <div className="page-wide flex flex-col gap-4 py-5 text-4 leading-5 text-beige md:flex-row md:items-center md:justify-between">
          <nav
            className="flex flex-wrap gap-x-4 gap-y-2"
            aria-label="하단 메뉴">
            {FOOTER_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-paper">
                {link.label}
              </Link>
            ))}
          </nav>
          <p>© 2026 피터팬 재단</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
