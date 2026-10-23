import Link from "next/link";

import { LogoLink } from "@/components/logo";
import { FOOTER_LINKS } from "@/content/nav";
import { displayOrPreparing, type SiteContact } from "@/lib/settings";

type SiteFooterProps = {
  contact: SiteContact;
};

const SiteFooter = ({ contact }: SiteFooterProps) => {
  return (
    <footer className="bg-green-deep text-paper">
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-10 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoLink variant="symbol" />
            <div>
              <p className="text-lg font-semibold">피터팬 재단</p>
              <p className="text-xs tracking-[0.16em] text-beige">
                PETER PAN FOUNDATION
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-beige">
            재단법인 피터팬 자폐인복지재단은 성인 중증 자폐성장애인이 혼자가
            되어도 혼자가 아닌 삶을 이어 가도록 생활주거공동체를 준비합니다.
          </p>
        </div>
        <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 text-sm text-beige">
          <dt>재단명</dt>
          <dd className="text-paper">재단법인 피터팬 자폐인복지재단</dd>
          <dt>대표</dt>
          <dd className="text-paper">{contact.representative}</dd>
          <dt>주소</dt>
          <dd className="text-paper">{contact.address}</dd>
          <dt>연락처</dt>
          <dd className="text-paper">{displayOrPreparing(contact.phone)}</dd>
          <dt>이메일</dt>
          <dd className="text-paper">{displayOrPreparing(contact.email)}</dd>
          <dt>고유번호</dt>
          <dd className="text-paper">
            {displayOrPreparing(contact.registrationNumber)}
          </dd>
        </dl>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col gap-4 py-5 text-sm text-beige md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="하단 메뉴">
            {FOOTER_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-paper">
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
