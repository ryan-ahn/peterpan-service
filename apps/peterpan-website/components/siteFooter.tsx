import type { SiteContact } from "@repo/db/siteContact";
import Icon from "@repo/ui/icon";

import HoverPrefetchLink from "@components/hoverPrefetchLink";
import Logo from "@components/logo";
import { displayOrPreparing } from "@lib/format";

/**
 * constants
 */
/** 공익법인 의무 게시. 공익위반 사항을 제보할 수 있는 관리·감독 기관 연결 */
const PUBLIC_INTEREST_REPORT_URL = "https://www.clean.go.kr";

/**
 * types
 */
type Props = {
  contact: SiteContact;
};

/**
 * 하단 재단 법정 표기와 개인정보처리방침. 메뉴는 상단에만 둔다
 * @param contact 관리자 기본정보에서 저장한 연락처
 */
const SiteFooter = ({ contact }: Props) => {
  // variables
  const rows = [
    { label: "재단명", value: "재단법인 피터팬 자폐인복지재단" },
    { label: "대표", value: contact.representative },
    {
      label: "고유번호",
      value: displayOrPreparing(contact.registrationNumber),
    },
    { label: "주소", value: contact.address },
    { label: "연락처", value: displayOrPreparing(contact.phone) },
    { label: "이메일", value: displayOrPreparing(contact.email) },
  ];
  // render
  return (
    <footer className="bg-pine-deep text-paper">
      <div className="page-wide flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-large bg-white">
            <Logo variant="symbol" />
          </span>
          <div>
            <p className="text-5 leading-6 font-semibold">피터팬 재단</p>
            <p className="font-en text-3 leading-4 font-medium tracking-caps text-beige">
              PETER PAN FOUNDATION
            </p>
          </div>
        </div>
        <dl className="flex flex-col gap-1.5 text-4 leading-5 text-beige md:max-w-160 md:flex-row md:flex-wrap md:gap-x-5">
          {rows.map(row => (
            <div key={row.label} className="flex gap-2">
              <dt className="shrink-0">{row.label}</dt>
              <dd className="text-paper">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="border-t border-white/10">
        <div className="page-wide flex flex-col gap-2 py-5 text-4 leading-5 text-beige md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <HoverPrefetchLink
              href="/privacy"
              className="font-semibold text-gold hover:text-paper">
              개인정보처리방침
            </HoverPrefetchLink>
            <a
              href={PUBLIC_INTEREST_REPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-paper">
              공익위반 신고
              <Icon name="external-link" size={14} />
              <span className="sr-only">(국민권익위원회, 새 창)</span>
            </a>
          </div>
          <p>© 2026 재단법인 피터팬 자폐인복지재단. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
