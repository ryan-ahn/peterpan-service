import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const list = tv({
  base: "flex w-full",
  variants: {
    variant: {
      underline: "gap-1 border-b border-gray-200",
      segment: "gap-1 rounded-large bg-gray-100 p-1",
    },
  },
});

const item = tv({
  base: "inline-flex cursor-pointer items-center justify-center gap-1.5 text-4 leading-5 font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400",
  variants: {
    variant: {
      underline: "-mb-px h-11 border-b-2 px-3",
      segment: "h-9 flex-1 rounded-medium px-3",
    },
    isActive: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "underline",
      isActive: true,
      class: "border-gray-900 text-gray-900",
    },
    {
      variant: "underline",
      isActive: false,
      class: "border-transparent text-gray-500 hover:text-gray-800",
    },
    {
      variant: "segment",
      isActive: true,
      class: "bg-white text-gray-900 shadow-small",
    },
    {
      variant: "segment",
      isActive: false,
      class: "text-gray-500 hover:text-gray-800",
    },
  ],
});

/**
 * types
 */
export type Variant = "underline" | "segment";

export type Item<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

type Props<T extends string> = {
  variant?: Variant;
  items: Item<T>[];
  activeId: T;
  label?: string;
  className?: string;
  onChange: (id: T) => void;
};

/**
 * 탭 목록. 패널은 화면이 `activeId`로 직접 그린다
 * @param variant 형태. underline 밑줄 / segment 칸 나눔
 * @param items 탭
 * @param activeId 선택한 탭
 * @param label 스크린 리더용 묶음 이름
 * @param className 추가 클래스
 * @param onChange 탭 변경
 */
const Tab = <T extends string>({
  variant = "underline",
  items,
  activeId,
  label,
  className,
  onChange,
}: Props<T>) => {
  // render
  return (
    <div
      className={cn(list({ variant }), className)}
      role="tablist"
      aria-label={label}>
      {items.map(tab => (
        <button
          key={tab.id}
          className={item({ variant, isActive: tab.id === activeId })}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          onClick={() => onChange(tab.id)}>
          <span>{tab.label}</span>
          {tab.count === undefined ? null : (
            <span className="text-3 leading-4 text-gray-400">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tab;
