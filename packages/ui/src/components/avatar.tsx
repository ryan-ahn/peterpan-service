import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const avatar = tv({
  base: "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100 font-semibold text-gray-600",
  variants: {
    size: {
      small: "size-7 text-3 leading-4",
      medium: "size-9 text-3.5 leading-5",
      large: "size-12 text-5 leading-6",
    },
  },
});

/**
 * types
 */
export type Size = "small" | "medium" | "large";

type Props = {
  name: string;
  src?: string | null;
  size?: Size;
  className?: string;
};

/**
 * 프로필 원. 사진이 없으면 이름 첫 글자를 보인다
 * @param name 이름. 대체 텍스트와 첫 글자에 쓴다
 * @param src 사진 주소
 * @param size 크기
 * @param className 추가 클래스
 */
const Avatar = ({ name, src, size = "medium", className }: Props) => {
  // variables
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  // render
  return (
    <span className={cn(avatar({ size }), className)}>
      {src ? (
        <img className="size-full object-cover" src={src} alt={name} />
      ) : (
        <span aria-label={name}>{initial}</span>
      )}
    </span>
  );
};

export default Avatar;
