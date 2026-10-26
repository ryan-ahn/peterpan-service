import BrandText from "@components/brandText";

/**
 * types
 */
type Item = {
  title: string;
  body: string;
};

type Props = {
  items: readonly Item[];
};

/**
 * 01·02 번호를 붙인 제목·설명 목록. 넓은 화면에서 제목과 설명을 두 칼럼으로 나눈다
 * @param items 제목·설명
 */
const NumberedList = ({ items }: Props) => {
  // render
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="grid gap-2 border-t border-beige py-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] lg:gap-12">
          <div>
            <p className="font-en text-4 leading-5 font-semibold text-gold-deep">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-6 leading-8 font-semibold text-pine">
              {item.title}
            </h3>
          </div>
          <BrandText variant="bodyCompact" color="inkSoft" className="lg:pt-7">
            {item.body}
          </BrandText>
        </li>
      ))}
    </ol>
  );
};

export default NumberedList;
