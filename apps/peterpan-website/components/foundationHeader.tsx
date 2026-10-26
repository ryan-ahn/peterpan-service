import BrandText from "@components/brandText";

/**
 * types
 */
type Props = {
  overline: string;
  title: string;
  lead: string;
};

/**
 * 하위 페이지 공통 머리(재단소개·마을소개·소통·정보공개). 본문과 같은 가운데 칼럼(page-article)에 놓는다
 * @param overline 제목 위 영문 분류
 * @param title 페이지 제목
 * @param lead 제목 아래 요약
 */
const FoundationHeader = ({ overline, title, lead }: Props) => {
  // render
  return (
    <header className="border-b border-beige">
      <div className="page-article py-16 lg:py-20">
        <BrandText variant="overline" color="pine">
          {overline}
        </BrandText>
        <BrandText
          as="h1"
          variant="title"
          color="pine"
          className="mt-3 tracking-tight">
          {title}
        </BrandText>
        <div className="mt-5 w-10 border-t-2 border-gold" />
        <BrandText variant="lead" color="muted" className="mt-5">
          {lead}
        </BrandText>
      </div>
    </header>
  );
};

export default FoundationHeader;
