import BrandText from "@components/brandText";

/**
 * types
 */
type Props = {
  title: string;
  description: string;
};

/**
 * 재단소개 탭 본문의 구역 제목과 한 줄 설명
 * @param title 구역 제목
 * @param description 한 줄 설명
 */
const FoundationHeading = ({ title, description }: Props) => {
  // render
  return (
    <div>
      <BrandText as="h2" variant="heading" color="pine">
        {title}
      </BrandText>
      <BrandText variant="smallCompact" color="muted" className="mt-2">
        {description}
      </BrandText>
    </div>
  );
};

export default FoundationHeading;
