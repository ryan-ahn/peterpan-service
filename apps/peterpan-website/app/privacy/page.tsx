import type { Metadata } from "next";

import BrandText from "@components/brandText";
import PageIntro from "@components/pageIntro";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "재단법인 피터팬 자폐인복지재단 개인정보처리방침.",
};

/**
 * constants
 */
const BLANK = "〔작성 필요〕";

/** 빈 값은 화면에 〔작성 필요〕로 보인다. 채우면 그대로 노출된다 */
const PRIVACY_OFFICER = {
  name: "안상혁",
  position: "개발담당자",
  phone: "010-9779-6777",
  email: "kaaiinn@naver.com",
};

const PRIVACY_DESK = {
  department: "개발팀",
  phone: "010-9779-6777",
  email: "kaaiinn@naver.com",
};

const EFFECTIVE_DATE = "";

const SECTIONS: PolicySection[] = [
  {
    title: "제1조 (개인정보의 처리 목적)",
    paragraphs: [
      "재단은 다음 목적을 위해 개인정보를 처리합니다. 처리한 개인정보는 다음 목적 외의 용도로 쓰지 않으며, 목적이 바뀌면 「개인정보 보호법」 제18조에 따라 별도 동의를 받는 등 필요한 조치를 합니다.",
    ],
    bullets: [
      "회원 관리: 카카오·구글 로그인을 통한 본인 식별, 게시판 글·댓글·좋아요 등 회원 서비스 제공, 부정 이용 방지, 운영자 권한 확인",
      "후원 확인과 안내: 후원 알림을 남긴 분의 입금 확인, 이름 벽 기록, 연락과 문의 응대",
      "기부금 영수증 발급과 후원 내역 관리: 후원이 시작된 분의 영수증 발급, 관계 법령에 따른 기록 보존",
      "게시판 운영: 이용자가 쓴 글과 댓글의 게시, 신고 처리, 관리",
      "서비스 안정성 확보: 접속 기록 확인, 오류와 보안 사고 대응",
    ],
  },
  {
    title: "제2조 (처리하는 개인정보 항목과 보유 기간)",
    paragraphs: [
      "재단은 법령에 따른 보유 기간 또는 정보주체에게 동의받은 보유 기간 안에서 개인정보를 처리하고 보유합니다. 항목과 기간은 다음과 같습니다.",
    ],
    table: {
      head: ["구분", "처리 항목", "보유 기간"],
      rows: [
        [
          "회원 (카카오·구글 로그인)",
          "필수: 로그인 서비스 식별자, 이름(닉네임), 이메일, 프로필 이미지, 로그인 방식 / 선택: 휴대전화 번호, 생년월일 (마이페이지에서 직접 입력)",
          "회원 탈퇴 시까지",
        ],
        [
          "게시판 이용",
          "글·댓글 내용, 글쓴이 이름, 작성 일시, 좋아요 기록",
          "본인이 삭제하거나 회원 탈퇴 시까지",
        ],
        [
          "후원 알림",
          "필수: 이름, 이메일, 후원 방식 / 선택: 휴대전화 번호, 보낸 금액, 입금자명, 이름 벽에 올릴 이름, 남기는 말",
          "안내 완료 후 1년",
        ],
        [
          "기부금 영수증 발급",
          "이름, 주민등록번호(법인은 사업자등록번호), 주소, 연락처, 후원 금액과 일자",
          "5년 (「소득세법」·「법인세법」 등 관계 법령)",
        ],
        [
          "자동 생성 정보",
          "접속 IP, 브라우저·기기 정보, 접속 일시, 로그인 유지 쿠키",
          "접속 기록 3개월 (「통신비밀보호법」), 쿠키는 로그아웃 또는 만료 시까지",
        ],
      ],
    },
    bullets: [
      "로그인 정보는 이용자가 카카오·구글에서 제공에 동의한 범위 안에서만 받습니다. 이름과 프로필 이미지는 처음 가입할 때 한 번 가져오고, 이후에는 마이페이지에서 직접 바꿀 수 있습니다.",
      "기부금 영수증용 주민등록번호는 웹사이트에서 받지 않으며, 영수증 발급을 신청한 분께 관계 법령의 근거에 따라 별도로 받습니다.",
      "회원 탈퇴 후에도 작성한 글과 댓글은 남을 수 있습니다. 탈퇴 전에 직접 지우거나 삭제를 요청할 수 있습니다.",
    ],
  },
  {
    title: "제3조 (개인정보의 파기 절차와 방법)",
    bullets: [
      "보유 기간이 지나거나 처리 목적을 이룬 개인정보는 지체 없이(5일 이내) 파기합니다.",
      "다른 법령에 따라 계속 보존해야 하는 경우에는 별도의 저장 공간으로 옮기거나 분리하여 보관합니다.",
      "전자 파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.",
    ],
  },
  {
    title: "제4조 (개인정보의 제3자 제공)",
    paragraphs: [
      "재단은 정보주체의 개인정보를 제1조의 목적 범위 안에서만 처리하며, 판매나 광고를 위해 제3자에게 제공하지 않습니다. 다만 다음의 경우에는 제공할 수 있습니다.",
    ],
    bullets: [
      "정보주체가 별도로 동의한 경우",
      "법률에 특별한 규정이 있거나 법령상 의무를 지키기 위해 불가피한 경우",
      "기부금 영수증 발급 내역을 관계 법령에 따라 국세청에 제출하는 경우",
    ],
  },
  {
    title: "제5조 (개인정보 처리 업무의 위탁)",
    paragraphs: [
      "재단은 원활한 서비스 운영을 위해 다음과 같이 업무를 위탁합니다. 위탁 계약 시 개인정보가 안전하게 관리되도록 「개인정보 보호법」 제26조에 따라 필요한 사항을 정하고 수탁자를 관리·감독합니다.",
    ],
    table: {
      head: ["수탁자", "위탁 업무"],
      rows: [
        [
          "Supabase Inc.",
          "회원 인증, 데이터베이스와 파일 보관 (데이터 저장 위치: 대한민국 서울)",
        ],
        ["Vercel Inc.", "웹사이트 호스팅과 운영"],
      ],
    },
    bullets: [
      "카카오·구글은 이용자가 선택한 로그인 수단을 제공하는 사업자로, 각 사의 개인정보 처리방침이 적용됩니다.",
      "수탁자나 위탁 업무가 바뀌면 이 처리방침으로 지체 없이 알립니다.",
    ],
  },
  {
    title: "제6조 (개인정보의 국외 이전)",
    paragraphs: [
      "재단은 「개인정보 보호법」 제28조의8에 따라 서비스 운영에 필요한 범위에서 다음과 같이 개인정보를 국외로 이전합니다.",
    ],
    table: {
      head: ["이전받는 자", "국가", "이전 항목", "일시·방법", "목적·보유 기간"],
      rows: [
        [
          "Vercel Inc.",
          "미국 등 서버 소재국",
          "웹사이트 이용 중 전송되는 정보 (접속 기록, 로그인 쿠키, 입력한 양식 내용)",
          "서비스 이용 시 네트워크로 수시 전송",
          "웹사이트 호스팅 / 위탁 계약 종료 시까지",
        ],
        [
          "Supabase Inc.",
          "미국 (데이터는 서울에 저장)",
          "제2조의 회원·게시판·후원 정보",
          "서비스 이용 시 네트워크로 수시 전송",
          "인증·데이터 보관 / 위탁 계약 종료 시까지",
        ],
      ],
    },
    bullets: [
      "국외 이전을 원하지 않으면 회원 로그인과 후원 참여 신청을 하지 않을 수 있습니다. 이 경우 해당 서비스는 이용할 수 없지만, 재단소개·소식 등 공개 화면은 그대로 볼 수 있습니다.",
    ],
  },
  {
    title: "제7조 (정보주체와 법정대리인의 권리·의무와 행사 방법)",
    bullets: [
      "정보주체는 재단에 언제든지 개인정보 열람, 정정, 삭제, 처리 정지, 동의 철회를 요청할 수 있습니다.",
      "요청은 제12조의 담당 부서에 이메일이나 서면, 전화로 할 수 있으며, 재단은 지체 없이(10일 이내) 조치하고 결과를 알립니다.",
      "마이페이지에서 내 정보를 직접 열람·정정하고, 남긴 문의와 게시글을 지우거나 회원 탈퇴를 할 수 있습니다. 탈퇴하면 회원 정보·프로필 이미지·문의 내역을 바로 삭제합니다.",
      "법정대리인이나 위임을 받은 사람을 통해서도 권리를 행사할 수 있으며, 이 경우 위임장을 제출해야 합니다.",
      "법령에서 보존을 정한 정보는 삭제를 요청할 수 없고, 다른 사람의 권리를 침해할 우려가 있으면 처리 정지 요청이 거절될 수 있습니다.",
      "정보주체는 자신이나 다른 사람의 개인정보를 잘못 입력하거나 침해해서는 안 됩니다.",
    ],
  },
  {
    title: "제8조 (만 14세 미만 아동의 개인정보)",
    bullets: [
      "회원 로그인과 후원 참여 신청은 만 14세 이상만 할 수 있습니다.",
      "만 14세 미만 아동의 개인정보가 법정대리인 동의 없이 수집된 것을 확인하면 지체 없이 파기합니다.",
    ],
  },
  {
    title: "제9조 (민감정보의 처리)",
    paragraphs: [
      "재단은 자폐성장애인과 가족을 위한 공익법인으로서 장애·건강에 관한 정보가 특히 보호되어야 함을 알고 있습니다.",
    ],
    bullets: [
      "재단은 웹사이트에서 장애 여부나 건강 상태 등 민감정보를 수집하지 않습니다.",
      "게시판과 후원 신청의 남기는 말에 본인이나 가족의 장애·건강 정보, 연락처를 적지 않도록 부탁드립니다. 적힌 경우 요청하면 지체 없이 삭제하며, 재단이 발견하면 비공개로 바꿀 수 있습니다.",
      "앞으로 입주 상담 등으로 민감정보가 필요하면 「개인정보 보호법」 제23조에 따라 다른 정보와 구분하여 별도 동의를 받습니다.",
    ],
  },
  {
    title: "제10조 (개인정보의 안전성 확보 조치)",
    paragraphs: [
      "재단은 「개인정보 보호법」 제29조에 따라 다음과 같은 안전성 확보 조치를 합니다.",
    ],
    bullets: [
      "관리적 조치: 내부 관리계획 수립·시행, 개인정보를 다루는 사람의 최소화와 정기 교육",
      "기술적 조치: 운영자 권한 구분과 접근 권한 관리, 모든 구간 HTTPS 암호화 통신, 데이터베이스 접근 통제, 접속 기록 보관",
      "물리적 조치: 출입이 통제된 클라우드 데이터센터 이용, 종이 문서의 잠금 보관",
    ],
  },
  {
    title: "제11조 (개인정보 자동 수집 장치의 설치·운영과 거부)",
    bullets: [
      "재단은 로그인 상태를 유지하기 위한 쿠키만 사용하며, 방문 분석이나 광고를 위한 쿠키와 행태정보는 수집하지 않습니다.",
      "이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다. 쿠키를 거부하면 로그인이 필요한 기능을 이용할 수 없습니다.",
    ],
  },
];

const REMEDY_AGENCIES = [
  "개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)",
  "개인정보침해신고센터: 118 (privacy.kisa.or.kr)",
  "대검찰청: 1301 (www.spo.go.kr)",
  "경찰청: 182 (ecrm.police.go.kr)",
];

/**
 * types
 */
type PolicyTable = {
  head: string[];
  rows: string[][];
};

type PolicySection = {
  title: string;
  paragraphs?: string[];
  table?: PolicyTable;
  bullets?: string[];
};

type PolicySectionProps = {
  section: PolicySection;
};

/**
 * screen — 개인정보처리방침
 */
const PrivacyScreen = () => {
  // variables
  const officerSection: PolicySection = {
    title: "제12조 (개인정보 보호책임자와 담당 부서)",
    paragraphs: [
      "재단은 개인정보 처리 업무를 총괄하고 관련 불만 처리와 피해 구제를 위해 다음과 같이 개인정보 보호책임자와 담당 부서를 둡니다. 개인정보 열람 청구도 아래 담당 부서에서 받습니다.",
    ],
    table: {
      head: ["구분", "성명·부서", "직책", "연락처", "이메일"],
      rows: [
        [
          "개인정보 보호책임자",
          fillBlank(PRIVACY_OFFICER.name),
          fillBlank(PRIVACY_OFFICER.position),
          fillBlank(PRIVACY_OFFICER.phone),
          fillBlank(PRIVACY_OFFICER.email),
        ],
        [
          "담당 부서",
          fillBlank(PRIVACY_DESK.department),
          "—",
          fillBlank(PRIVACY_DESK.phone),
          fillBlank(PRIVACY_DESK.email),
        ],
      ],
    },
  };
  const remedySection: PolicySection = {
    title: "제13조 (권익침해 구제 방법)",
    paragraphs: [
      "개인정보 침해로 인한 구제를 받기 위해 아래 기관에 분쟁 해결이나 상담을 신청할 수 있습니다.",
    ],
    bullets: REMEDY_AGENCIES,
  };
  const changeSection: PolicySection = {
    title: "제14조 (개인정보 처리방침의 변경)",
    bullets: [
      `이 개인정보 처리방침은 ${fillBlank(EFFECTIVE_DATE)}부터 적용됩니다.`,
      "내용이 바뀌면 시행 7일 전부터 웹사이트에 알리며, 정보주체의 권리에 중요한 변경은 30일 전부터 알립니다.",
      "이전 개인정보 처리방침: 2026년 10월 23일 시행본",
    ],
  };
  // render
  return (
    <article className="page-reading flex flex-col gap-10 py-12">
      <div className="flex flex-col gap-6">
        <PageIntro title="개인정보처리방침" />
        <BrandText variant="body">
          재단법인 피터팬 자폐인복지재단 설립추진위원회(이하
          &ldquo;재단&rdquo;)는 「개인정보 보호법」 제30조에 따라 정보주체의
          개인정보를 보호하고 관련 고충을 신속하고 원활하게 처리하기 위해 다음과
          같이 개인정보 처리방침을 수립·공개합니다. 재단 설립 등기가 끝나면 처리
          주체를 법인 명의로 바꾸어 알립니다.
        </BrandText>
      </div>
      {[...SECTIONS, officerSection, remedySection, changeSection].map(
        section => (
          <PolicySectionView key={section.title} section={section} />
        ),
      )}
    </article>
  );
};

/**
 * inner components
 */
const PolicySectionView = ({ section }: PolicySectionProps) => {
  // render
  return (
    <section className="flex flex-col gap-4">
      <BrandText as="h2" variant="heading" color="pine">
        {section.title}
      </BrandText>
      {section.paragraphs?.map(paragraph => (
        <BrandText key={paragraph.slice(0, 24)} variant="body">
          {paragraph}
        </BrandText>
      ))}
      {section.table ? (
        <div className="overflow-x-auto rounded-large border border-beige">
          <table className="w-full min-w-120 border-collapse text-left text-4 leading-6">
            <thead className="bg-beige/40">
              <tr>
                {section.table.head.map(cell => (
                  <th
                    key={cell}
                    scope="col"
                    className="px-3 py-2 font-semibold whitespace-nowrap">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map(row => (
                <tr key={row.join("|")} className="border-t border-beige">
                  {row.map((cell, index) => (
                    <td
                      key={`${index}-${cell}`}
                      className="px-3 py-2 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {section.bullets ? (
        <ul className="list-disc pl-5 text-5 leading-11">
          {section.bullets.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

/**
 * utils
 */
const fillBlank = (value: string) => value.trim() || BLANK;

export default PrivacyScreen;
